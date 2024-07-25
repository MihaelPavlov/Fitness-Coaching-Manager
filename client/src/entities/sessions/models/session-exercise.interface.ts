export interface ISessionExercise {
  exerciseId: number;
  rank: number;
  description: string;
  hasTiming: number;
  duration: number;
  repetitions: number;
  title: string;
  thumbUri: string;
}

export interface ISessionPracticalExercise {
  sets?: number;
  rest?: number;
  description?: string;
  title?: string;
  thumbUri?: string;
  duration?: number;
  repetitions?: number;
}
