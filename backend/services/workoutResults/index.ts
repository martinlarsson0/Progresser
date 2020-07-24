import pool from "../../db";
import { BadRequest, GeneralError } from "../../utils";
import {
  WorkoutResultsResponse,
  WorkoutResult,
  WorkoutExerciseResult,
  WeightExerciseResult,
  TimeExerciseResult,
} from "../../types";

export const selectWorkoutResultsService = async (
  userId: number
): Promise<WorkoutResultsResponse> => {
  const client = await pool.connect();
  if (!userId)
    throw new BadRequest("selectWorkoutResults Query invalid input.");

  try {
    // Select all info relating to users workout results
    const { rows: userWorkoutResults } = await client.query(
      `
            SELECT 
                id,
                user_id as "userId",
                workout_id as "workoutId",
                perceived_difficulty as "perceivedDifficulty",
                note,
                latest_date as "latestDate"
            FROM user_workout_result
            WHERE user_id = $1`,
      [userId]
    );

    const { rows: workoutExerciseResults } = await client.query(
      `
            SELECT 
                id,
                user_id as "userId",
                workout_result_id as "workoutResultId",
                perceived_difficulty as "perceivedDifficulty",
                note,
                type
            FROM workout_exercise_result
            WHERE user_id = $1`,
      [userId]
    );

    const { rows: weightExerciseResults } = await client.query(
      `
            SELECT 
                id,
                user_id as "userId",
                workout_result_id as "workoutResultId",
                exercise_result_id as "exerciseResultId",
                sets,
                reps,
                weight
            FROM weight_exercise_result
            WHERE user_id = $1`,
      [userId]
    );

    const { rows: timeExerciseResults } = await client.query(
      `
            SELECT 
                id,
                user_id as "userId",
                workout_result_id as "workoutResultId",
                exercise_result_id as "exerciseResultId",
                duration,
                distance
            FROM time_exercise_result
            WHERE user_id = $1`,
      [userId]
    );

    const result: WorkoutResultsResponse = { userId, workoutResults: [] };

    // Create the workout results response object
    userWorkoutResults.forEach((userWorkoutResult) => {
      userWorkoutResult.exerciseResults = [];

      workoutExerciseResults.forEach((workoutExerciseResult) => {
        if (workoutExerciseResult.type === "weight") {
          workoutExerciseResult.exerciseResult = weightExerciseResults.find(
            (exerciseResult) => {
              if (workoutExerciseResult.id === exerciseResult.exerciseResultId)
                return exerciseResult;
            }
          );
        } else {
          workoutExerciseResult.exerciseResult = timeExerciseResults.find(
            (exerciseResult) => {
              if (workoutExerciseResult.id === exerciseResult.exerciseResultId)
                return exerciseResult;
            }
          );
        }

        if (userWorkoutResult.id === workoutExerciseResult.workoutResultId)
          userWorkoutResult.exerciseResults.push(workoutExerciseResult);
      });
      result.workoutResults.push(userWorkoutResult);
    });

    return result;
  } catch (error) {
    throw new GeneralError(
      `selectWorkoutResults query resulted in database error: ${error.message}`
    );
  } finally {
    client.release();
  }
};

export const insertWorkoutResultService = async (
  userId: number,
  workoutResult: WorkoutResult
): Promise<number> => {
  const client = await pool.connect();
  const {
    workoutId,
    perceivedDifficulty,
    note,
    latestDate,
    exerciseResults,
  } = workoutResult;

  if (
    !userId ||
    !workoutId ||
    !perceivedDifficulty ||
    !note ||
    !latestDate ||
    !exerciseResults
  )
    throw new BadRequest("insertWorkoutResult Query invalid input.");
  try {
    // Insert workout result returning its id
    const res = await client.query(
      `
            INSERT INTO user_workout_result (user_id, workout_id, perceived_difficulty, note, latest_date)
            VALUES ($1, $2, $3, $4, $5)
            RETURNING id`,
      [userId, workoutId, perceivedDifficulty, note, latestDate]
    );

    const workoutResultId: number = parseInt(res.rows[0].id);

    // Insert exercises
    for (let i = 0; i < exerciseResults.length; i++) {
      await insertExerciseResult(userId, workoutResultId, exerciseResults[i]);
    }

    return workoutResultId;
  } catch (error) {
    throw new GeneralError(
      `insertWorkoutResult query resulted in database error: ${error.message}`
    );
  } finally {
    client.release();
  }
};

const insertExerciseResult = async (
  userId: number,
  workoutResultId: number,
  workoutExerciseResult: WorkoutExerciseResult
): Promise<void> => {
  const client = await pool.connect();
  const {
    type,
    perceivedDifficulty,
    note,
    exerciseResult,
  } = workoutExerciseResult;

  if (
    !userId ||
    !workoutResultId ||
    !type ||
    !perceivedDifficulty ||
    !note ||
    !exerciseResult
  )
    throw new BadRequest("insertExerciseResult Query invalid input.");

  try {
    // Insert into workout exercise result
    const res = await client.query(
      `
            INSERT INTO workout_exercise_result (user_id, workout_result_id, perceived_difficulty, note, type)
            VALUES ($1, $2, $3, $4, $5)
            RETURNING id`,
      [userId, workoutResultId, perceivedDifficulty, note, type]
    );
    const exerciseResultId: number = res.rows[0].id;
    // Insert into time or weight exercise result depending on exercise type
    switch (type) {
      case "weight":
        await insertWeightExerciseResult(
          userId,
          workoutResultId,
          exerciseResultId,
          exerciseResult as WeightExerciseResult
        );
        break;
      case "time":
        await insertTimeExerciseResult(
          userId,
          workoutResultId,
          exerciseResultId,
          exerciseResult as TimeExerciseResult
        );
        break;
      default:
        throw new Error("Exercise type does not exist.");
    }
  } catch (error) {
    throw new GeneralError(
      `insertExerciseResult query resulted in database error: ${error.message}`
    );
  }
};

const insertWeightExerciseResult = async (
  userId: number,
  workoutResultId: number,
  exerciseResultId: number,
  exerciseResult: WeightExerciseResult
): Promise<void> => {
  const client = await pool.connect();
  const { sets, reps, weight } = exerciseResult;
  if (
    !userId ||
    !workoutResultId ||
    !exerciseResultId ||
    sets === undefined ||
    reps === undefined ||
    weight === undefined
  )
    throw new BadRequest("insertWeightExerciseResult Query invalid input.");

  try {
    await client.query(
      `
            INSERT INTO weight_exercise_result (user_id, workout_result_id, exercise_result_id, sets, reps, weight)
            VALUES ($1, $2, $3, $4, $5, $6)`,
      [userId, workoutResultId, exerciseResultId, sets, reps, weight]
    );
  } catch (error) {
    throw new GeneralError(
      `insertWeightExerciseResult query resulted in database error: ${error.message}`
    );
  } finally {
    client.release();
  }
};

const insertTimeExerciseResult = async (
  userId: number,
  workoutResultId: number,
  exerciseResultId: number,
  exerciseResult: TimeExerciseResult
): Promise<void> => {
  const client = await pool.connect();
  const { duration, distance } = exerciseResult;
  if (
    !userId ||
    !workoutResultId ||
    !exerciseResultId ||
    duration === undefined ||
    distance === undefined
  )
    throw new BadRequest("insertTimeExerciseResult Query invalid input.");

  try {
    await client.query(
      `
            INSERT INTO time_exercise_result (user_id, workout_result_id, exercise_result_id, duration, distance)
            VALUES ($1, $2, $3, $4, $5)`,
      [userId, workoutResultId, exerciseResultId, duration, distance]
    );
  } catch (error) {
    throw new GeneralError(
      `insertTimeExerciseResult query resulted in database error: ${error.message}`
    );
  } finally {
    client.release();
  }
};

export const updateWorkoutResultService = async (
  userId: number,
  workoutResultId: number,
  workoutResult: WorkoutResult
): Promise<number> => {
  try {
    await deleteWorkoutResultService(workoutResultId);
    const id = await insertWorkoutResultService(userId, workoutResult);

    return id;
  } catch (error) {
    throw new GeneralError(
      `updateWorkoutResultService resulted in error: ${error.message}`
    );
  }
};

export const deleteWorkoutResultService = async (
  workoutResultId: number
): Promise<void> => {
  const client = await pool.connect();

  if (!workoutResultId)
    throw new BadRequest("deleteWorkoutResult Query invalid input");

  try {
    // Delete all exercises which relate to workout
    await client.query(
      `DELETE FROM weight_exercise_result
            WHERE workout_result_id = $1`,
      [workoutResultId]
    );
    await client.query(
      `DELETE FROM time_exercise_result
            WHERE workout_result_id = $1`,
      [workoutResultId]
    );
    await client.query(
      `DELETE FROM workout_exercise_result
            WHERE workout_result_id = $1`,
      [workoutResultId]
    );
    // Delete workout
    await client.query(
      `DELETE FROM user_workout_result
            WHERE id = $1`,
      [workoutResultId]
    );
  } catch (error) {
    throw new GeneralError(
      `deleteWorkoutResult query resulted in database error: ${error.message}`
    );
  } finally {
    client.release();
  }
};
