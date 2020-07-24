export interface WorkoutResultsResponse {
  userId: number;
  workoutResults: WorkoutResult[];
}

export interface WorkoutResultInsert {
  workoutResult: WorkoutResult;
}

export interface WorkoutResult {
  id?: number;
  userId: number;
  workoutId: number;
  perceivedDifficulty: string;
  note: string;
  latestDate: Date;
  exerciseResults: WorkoutExerciseResult[];
}

export interface WorkoutExerciseResult {
  id?: number;
  userId: number;
  workoutId?: number;
  perceivedDifficulty: string;
  note: string;
  type: string;
  exerciseResult: TimeExerciseResult | WeightExerciseResult;
}

export interface TimeExerciseResult {
  id?: number;
  userId: number;
  workoutResultId?: number;
  exerciseResultId?: number;
  duration: number;
  distance: number;
}

export interface WeightExerciseResult {
  id?: number;
  userId: number;
  workoutResultId?: number;
  exerciseResultId?: number;
  sets: number;
  reps: number;
  weight: number;
}
