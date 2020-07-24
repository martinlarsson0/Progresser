import { Request, Response, NextFunction } from "express";
import {
  selectWorkoutResultsService,
  insertWorkoutResultService,
  updateWorkoutResultService,
  deleteWorkoutResultService,
} from "../../services";
import { WorkoutResultInsert, WorkoutResultsResponse } from "../../types";

export const selectWorkoutResults = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const { userId } = req.params;
  try {
    const result: WorkoutResultsResponse = await selectWorkoutResultsService(
      parseInt(userId)
    );

    res.status(200).json(result);
    res.end();
  } catch (error) {
    next(error);
  }
};

export const insertWorkoutResult = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const { userId } = req.params;
  const { workoutResult }: WorkoutResultInsert = req.body;
  try {
    const workoutId = await insertWorkoutResultService(
      parseInt(userId),
      workoutResult
    );

    res.status(200).json({ success: true, id: workoutId });
    res.end();
  } catch (error) {
    next(error);
  }
};

export const updateWorkoutResult = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const { workoutResultId, userId } = req.params;
  const { workoutResult }: WorkoutResultInsert = req.body;
  try {
    const id = await updateWorkoutResultService(
      parseInt(userId),
      parseInt(workoutResultId),
      workoutResult
    );

    res.status(200).json({ success: true, id });
    res.end();
  } catch (error) {
    next(error);
  }
};

export const deleteWorkoutResult = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const { workoutResultId } = req.params;
  try {
    await deleteWorkoutResultService(parseInt(workoutResultId));

    res.status(200).send({ success: true });
    res.end();
  } catch (error) {
    next(error);
  }
};
