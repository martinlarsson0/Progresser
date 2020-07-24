import express from "express";
import {
  login,
  insertUser,
  updateUser,
  deleteUser,
  selectWorkouts,
  insertWorkout,
  updateWorkout,
  deleteWorkout,
  selectWorkoutResults,
  insertWorkoutResult,
  updateWorkoutResult,
  deleteWorkoutResult,
} from "../controllers";

const router = express.Router();

// User routes
router.post("/login", login);
router.post("/user", insertUser);
router.put("/user/:userId", updateUser);
router.delete("/user/:userId", deleteUser);

// Workout routes
router.get("/workouts/:userId", selectWorkouts);
router.post("/workout/:userId", insertWorkout);
router.put("/workout/:userId/:workoutId", updateWorkout);
router.delete("/workout/:workoutId", deleteWorkout);
router.get("/workoutResults/:userId", selectWorkoutResults);
router.post("/workoutResult/:userId", insertWorkoutResult);
router.put("/workoutResult/:userId/:workoutResultId", updateWorkoutResult);
router.delete("/workoutResult/:workoutResultId", deleteWorkoutResult);

export default router;
