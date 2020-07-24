import {
  selectWorkoutsService,
  insertWorkoutService,
  updateWorkoutService,
  deleteWorkoutService,
} from "../../services";
import { Request, Response, NextFunction } from "express";
import { WorkoutsResponse, WorkoutInsert } from "../../types";

export const selectWorkouts = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const { userId } = req.params;
  try {
    const result: WorkoutsResponse = await selectWorkoutsService(
      parseInt(userId)
    );

    res.status(200).json(result);
    res.end();
  } catch (error) {
    next(error);
  }
};

export const insertWorkout = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const { userId } = req.params;
  const { workout }: WorkoutInsert = req.body;
  try {
    const workoutId = await insertWorkoutService(parseInt(userId), workout);
    res.status(200).json({ success: true, id: workoutId });
    res.end();
  } catch (error) {
    next(error);
  }
};

export const updateWorkout = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const { workoutId, userId } = req.params;
  const { workout }: WorkoutInsert = req.body;
  try {
    const id = await updateWorkoutService(
      parseInt(userId),
      parseInt(workoutId),
      workout
    );

    res.status(200).send({ success: true, id });
    res.end();
  } catch (error) {
    next(error);
  }
};

export const deleteWorkout = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const { workoutId } = req.params;
  try {
    await deleteWorkoutService(parseInt(workoutId));

    res.status(200).send({ success: true });
    res.end();
  } catch (error) {
    next(error);
  }
};
