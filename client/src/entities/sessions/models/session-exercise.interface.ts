export interface ISessionExercise {
  exerciseId: number;
  rank: number;
  description: string;
  hasTiming: number;
  duration: number;
  repetitions: number;
  title: string;
  thumbUri: string;
  tags?: Array<any>
}

export interface ISessionPracticalExercise {
  exerciseId?: number;
  sets?: number;
  rest?: number;
  description?: string;
  title?: string;
  thumbUri?: string;
  duration?: number;
  repetitions?: number;
}
