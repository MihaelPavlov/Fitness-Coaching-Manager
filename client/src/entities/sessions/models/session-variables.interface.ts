import { BehaviorSubject } from "rxjs";

export interface WorkoutInfo {
  workoutId: number;
  workoutName: string;
  numberOfSets: number;
  pauseBetweenSets: number;
  pauseBetweenExercises: number;
}

export interface ExerciseTiming {
  totalWorkoutTime: number;
  totalTimeInterval: any;
  totalExercises: number;
  isLastExercise: boolean;
  isWorkoutDone: boolean;
  exerciseDurationTimes: number[];
}

export interface CurrentExercise {
  title: string;
  staticDuration: number;
  thumb: string | undefined;
  totalDurationSubject: BehaviorSubject<number>;
  totalDuration: number;
  indexSubject: BehaviorSubject<number>;
  previousIndex: number;
  name: string;
  description: string | undefined;
  repetitions: number;
  currentSetSubject: BehaviorSubject<number>;
  currentSet: number;
  secondsLeftSubjcet: BehaviorSubject<number>;
  secondsLeft: number;
  restSecondsLeftSubject: BehaviorSubject<number>;
  restSecondsLeft: number;
  hasTimingSubject: BehaviorSubject<boolean>;
  hasTiming: boolean;
  isRestTimeSubject: BehaviorSubject<boolean>;
  isRestTime: boolean;
}

