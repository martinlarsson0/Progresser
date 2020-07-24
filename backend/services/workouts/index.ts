import pool from "../../db";
import { BadRequest, GeneralError } from "../../utils";
import {
  WorkoutsResponse,
  Workout,
  WorkoutExercise,
  WeightExercise,
  TimeExercise,
} from "../../types";

export const selectWorkoutsService = async (
  userId: number
): Promise<WorkoutsResponse> => {
  const client = await pool.connect();
  if (!userId) throw new BadRequest("selectWorkouts Query invalid input.");

  try {
    // Select all info relating to users workouts
    const { rows: userWorkouts } = await client.query(
      `
            SELECT 
                 id,
                 user_id as "userId",
                 name,
                 description,
                 rating,
                 latest_perceived_difficulty as "latestPerceivedDifficulty",
                 latest_date as "latestDate",
                 times_completed as "timesCompleted"
            FROM user_workout
            WHERE user_id = $1`,
      [userId]
    );

    const { rows: workoutExercises } = await client.query(
      `
            SELECT 
                id,
                user_id as "userId",
                workout_id as "workoutId",
                name,
                description,
                type,
                latest_perceived_difficulty as "latestPerceivedDifficulty"
            FROM workout_exercise
            WHERE user_id = $1`,
      [userId]
    );

    const { rows: weightExercises } = await client.query(
      `
            SELECT 
                id,
                user_id as "userId",
                workout_id as "workoutId",
                exercise_id as "exerciseId",
                sets,
                reps,
                weight
            FROM weight_exercise
            WHERE user_id = $1`,
      [userId]
    );

    const { rows: timeExercises } = await client.query(
      `
            SELECT 
                id,
                user_id as "userId",
                workout_id as "workoutId",
                exercise_id as "exerciseId",
                duration,
                distance
            FROM time_exercise
            WHERE user_id = $1`,
      [userId]
    );

    const result: WorkoutsResponse = { userId, workouts: [] };

    // Create the workouts response object
    userWorkouts.forEach((userWorkout) => {
      userWorkout.exercises = [];
      workoutExercises.forEach((workoutExercise) => {
        if (workoutExercise.type === "weight") {
          workoutExercise.exercise = weightExercises.find((exercise) => {
            if (workoutExercise.id === exercise.exerciseId) return exercise;
          });
        } else {
          workoutExercise.exercise = timeExercises.find((exercise) => {
            if (workoutExercise.id === exercise.exerciseId) return exercise;
          });
        }

        if (userWorkout.id === workoutExercise.workoutId)
          userWorkout.exercises.push(workoutExercise);
      });
      result.workouts.push(userWorkout);
    });

    return result;
  } catch (error) {
    throw new GeneralError(
      `selectWorkouts query resulted in database error: ${error.message}`
    );
  } finally {
    client.release();
  }
};

export const insertWorkoutService = async (
  userId: number,
  workout: Workout
): Promise<number> => {
  const client = await pool.connect();
  const {
    name,
    description,
    rating,
    latestPerceivedDifficulty,
    latestDate,
    timesCompleted,
    exercises,
  } = workout;

  if (
    !userId ||
    !name ||
    !description ||
    rating === undefined ||
    !latestPerceivedDifficulty ||
    !latestDate ||
    timesCompleted === undefined
  )
    throw new BadRequest("insertWorkout Query invalid input.");
  try {
    // Insert workout returning its id
    const res = await client.query(
      `
            INSERT INTO user_workout (user_id, name, description, rating, latest_perceived_difficulty, latest_date, times_completed)
            VALUES ($1, $2, $3, $4, $5, $6, $7)
            RETURNING id`,
      [
        userId,
        name,
        description,
        rating,
        latestPerceivedDifficulty,
        latestDate,
        timesCompleted,
      ]
    );

    const workoutId: number = parseInt(res.rows[0].id);

    // Insert exercises
    for (let i = 0; i < exercises.length; i++) {
      await insertExercise(userId, workoutId, exercises[i]);
    }

    return workoutId;
  } catch (error) {
    throw new GeneralError(
      `insertWorkout query resulted in database error: ${error.message}`
    );
  } finally {
    client.release();
  }
};

const insertExercise = async (
  userId: number,
  workoutId: number,
  workoutExercise: WorkoutExercise
): Promise<void> => {
  const client = await pool.connect();
  const {
    name,
    description,
    type,
    latestPerceivedDifficulty,
    exercise,
  } = workoutExercise;
  if (
    !userId ||
    !workoutId ||
    !name ||
    !description ||
    !type ||
    !latestPerceivedDifficulty ||
    !exercise
  )
    throw new BadRequest("insertExercise Query invalid input.");

  try {
    // Insert into workoutExercise
    const res = await client.query(
      `
            INSERT INTO workout_exercise (user_id, workout_id, name, description, type, latest_perceived_difficulty)
            VALUES ($1, $2, $3, $4, $5, $6)
            RETURNING id`,
      [userId, workoutId, name, description, type, latestPerceivedDifficulty]
    );
    const exerciseId: number = res.rows[0].id;

    // Insert into time or weight exercise depending on exercise type
    switch (type) {
      case "weight":
        await insertWeightExercise(
          userId,
          workoutId,
          exerciseId,
          exercise as WeightExercise
        );
        break;
      case "time":
        await insertTimeExercise(
          userId,
          workoutId,
          exerciseId,
          exercise as TimeExercise
        );
        break;
      default:
        throw new Error("Exercise type does not exist.");
    }
  } catch (error) {
    throw new GeneralError(
      `insertExercise query resulted in database error: ${error.message}`
    );
  }
};

const insertWeightExercise = async (
  userId: number,
  workoutId: number,
  exerciseId: number,
  exercise: WeightExercise
): Promise<void> => {
  const client = await pool.connect();
  const { sets, reps, weight } = exercise;
  if (
    !userId ||
    !workoutId ||
    !exerciseId ||
    sets === undefined ||
    reps === undefined ||
    weight === undefined
  )
    throw new BadRequest("insertWeightExercise Query invalid input.");

  try {
    await client.query(
      `
            INSERT INTO weight_exercise (user_id, workout_id, exercise_id, sets, reps, weight)
            VALUES ($1, $2, $3, $4, $5, $6)`,
      [userId, workoutId, exerciseId, sets, reps, weight]
    );
  } catch (error) {
    throw new GeneralError(
      `insertWeightExercise query resulted in database error: ${error.message}`
    );
  } finally {
    client.release();
  }
};

const insertTimeExercise = async (
  userId: number,
  workoutId: number,
  exerciseId: number,
  exercise: TimeExercise
): Promise<void> => {
  const client = await pool.connect();
  const { duration, distance } = exercise;
  if (
    !userId ||
    !workoutId ||
    !exerciseId ||
    duration === undefined ||
    distance === undefined
  )
    throw new BadRequest("insertTimeExercise Query invalid input.");

  try {
    await client.query(
      `
            INSERT INTO time_exercise (user_id, workout_id, exercise_id, duration, distance)
            VALUES ($1, $2, $3, $4, $5)`,
      [userId, workoutId, exerciseId, duration, distance]
    );
  } catch (error) {
    throw new GeneralError(
      `insertTimeExercise query resulted in database error: ${error.message}`
    );
  } finally {
    client.release();
  }
};

export const updateWorkoutService = async (
  userId: number,
  workoutId: number,
  workout: Workout
): Promise<number> => {
  try {
    await deleteWorkoutService(workoutId);
    const id = await insertWorkoutService(userId, workout);

    return id;
  } catch (error) {
    throw new GeneralError(
      `updateWorkoutService resulted in error: ${error.message}`
    );
  }
};

export const deleteWorkoutService = async (
  workoutId: number
): Promise<void> => {
  const client = await pool.connect();

  if (!workoutId) throw new BadRequest("deleteWorkout Query invalid input");

  try {
    // Delete all exercises which relate to workout
    await client.query(
      `DELETE FROM weight_exercise
            WHERE workout_id = $1`,
      [workoutId]
    );
    await client.query(
      `DELETE FROM time_exercise
            WHERE workout_id = $1`,
      [workoutId]
    );
    await client.query(
      `DELETE FROM workout_exercise
            WHERE workout_id = $1`,
      [workoutId]
    );
    // Delete workout
    await client.query(
      `DELETE FROM user_workout
            WHERE id = $1`,
      [workoutId]
    );
  } catch (error) {
    throw new GeneralError(
      `deleteWorkout query resulted in database error: ${error.message}`
    );
  } finally {
    client.release();
  }
};
