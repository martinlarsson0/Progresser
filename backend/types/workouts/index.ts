export interface WorkoutsResponse {
  userId: number;
  workouts: Workout[];
}

export interface WorkoutInsert {
  workout: Workout;
}

export interface Workout {
  id?: number;
  userId: number;
  name: string;
  description: string;
  rating: number;
  latestPerceivedDifficulty: string;
  latestDate: Date;
  timesCompleted: number;
  exercises: WorkoutExercise[];
}

export interface WorkoutExercise {
  id?: number;
  userId: number;
  workoutId?: number;
  name: string;
  description: string;
  type: string;
  latestPerceivedDifficulty: string;
  exercise: TimeExercise | WeightExercise;
}

export interface TimeExercise {
  id?: number;
  userId: number;
  workoutId?: number;
  exerciseId?: number;
  duration: number;
  distance: number;
}

export interface WeightExercise {
  id?: number;
  userId: number;
  workoutId?: number;
  exerciseId?: number;
  sets: number;
  reps: number;
  weight: number;
}
