import { Injectable } from '@angular/core';
import {
  CurrentExercise,
  ExerciseTiming,
  WorkoutInfo,
} from '../models/session-variables.interface';
import { BehaviorSubject, interval, Subscription } from 'rxjs';
import { ISessionPracticalExercise } from '../models/session-exercise.interface';
import { IQueryParams } from '../../models/query-params.interface';
import { EXERCISE_FIELDS } from '../../exercises/models/fields/exercise-fields.constant';
import { ExerciseService } from '../../exercises/services/exercise.service';

@Injectable({
  providedIn: 'root',
})
export class SessionStateService {
  public workoutInfo: WorkoutInfo = {
    workoutId: 0,
    workoutName: '',
    numberOfSets: 0,
    pauseBetweenSets: 0,
    pauseBetweenExercises: 0,
  };

  public exerciseTiming: ExerciseTiming = {
    totalWorkoutTime: 0,
    totalTimeInterval: null,
    totalExercises: 0,
    isLastExercise: false,
    isWorkoutDone: false,
    exerciseDurationTimes: [],
  };

  public currentExercise: CurrentExercise = {
    title: '',
    staticDuration: 0,
    thumb: undefined,
    totalDurationSubject: new BehaviorSubject<number>(0),
    totalDuration: 0,
    indexSubject: new BehaviorSubject<number>(0),
    previousIndex: 0,
    name: '',
    description: '',
    repetitions: 0,
    currentSetSubject: new BehaviorSubject<number>(0),
    currentSet: 0,
    secondsLeftSubjcet: new BehaviorSubject<number>(0),
    secondsLeft: 0,
    restSecondsLeftSubject: new BehaviorSubject<number>(0),
    restSecondsLeft: 0,
    hasTimingSubject: new BehaviorSubject<boolean>(false),
    hasTiming: false,
    isRestTimeSubject: new BehaviorSubject<boolean>(false),
    isRestTime: false,
  };

  // Subscriptions
  public setSubscription?: Subscription;
  public secondsSubscription?: Subscription;
  public restSecondsSubscription?: Subscription;
  public isRestSubscription?: Subscription;
  public durationInterval?: Subscription;
  public restingInterval?: Subscription;
  public exerciseTotalDurationInterval?: Subscription;
  public durationRestSubscription?: Subscription;

  // Getters
  public get averageExerciseTime(): string {
    const totalTimes = this.exerciseTiming.exerciseDurationTimes.reduce(
      (a, b) => a + b
    );
    const totalTimesLength = this.exerciseTiming.exerciseDurationTimes.length;
    return this.formatTime(Math.floor(totalTimes / totalTimesLength));
  }

  constructor(private readonly exerciseService: ExerciseService) {}

  performWorkout(exercises: ISessionPracticalExercise[]) {
    this.currentExercise.indexSubject
      .asObservable()
      .subscribe((currentIndex) => {
        if (currentIndex >= exercises.length) {
          // Finish workout
          return;
        }

        // Last exercise
        if (currentIndex + 1 == exercises.length) {
          this.exerciseTiming.isLastExercise = true;
        }

        const exercise = exercises[currentIndex];
        this.assignCurrentExercise(exercise);

        if (exercise.repetitions) {
          this.handleRepetitionsExercise(exercise);
        } else {
          this.handleDurationExercise(exercise);
        }

        this.currentExercise.previousIndex = currentIndex;
      });
  }

  public nextExerciseRest(): void {
    this.exerciseTotalDurationInterval?.unsubscribe();
    this.exerciseTiming.exerciseDurationTimes.push(
      this.currentExercise.totalDuration
    );

    if (this.exerciseTiming.isLastExercise) {
      return this.nextExercise();
    }

    this.currentExercise.indexSubject.next(
      this.currentExercise.previousIndex + 1
    );

    this.durationInterval?.unsubscribe();

    this.currentExercise.isRestTimeSubject.next(true);
    this.currentExercise.restSecondsLeftSubject.next(
      this.workoutInfo.pauseBetweenExercises || 0
    );
    let currentSeconds = this.workoutInfo.pauseBetweenExercises || 0;

    this.restingInterval = interval(1000).subscribe(() => {
      currentSeconds = currentSeconds - 1;
      this.currentExercise.restSecondsLeftSubject.next(currentSeconds);
    });

    this.restSecondsSubscription = this.currentExercise.restSecondsLeftSubject
      .asObservable()
      .subscribe((seconds) => {
        this.currentExercise.restSecondsLeft = seconds;

        if (seconds == 0) {
          this.restingInterval?.unsubscribe();
          this.currentExercise.isRestTimeSubject.next(false);
          this.nextExercise();
        }
      });
  }

  public nextExercise(): void {
    !this.currentExercise.hasTiming && this.durationInterval?.unsubscribe();
    this.restSecondsSubscription?.unsubscribe();
  }

  public nextSet() {
    // Unsubscribe to running timers
    this.durationRestSubscription?.unsubscribe();
    this.secondsSubscription?.unsubscribe();
    this.durationInterval?.unsubscribe();
    if (this.currentExercise.currentSet || 0 <= this.workoutInfo.numberOfSets) {
      if (this.currentExercise.isRestTime) this.goWork();
      else this.goRest();
    }
  }

  public goWork(): void {
    this.currentExercise.isRestTimeSubject.next(false);
    this.restSecondsSubscription?.unsubscribe();
  }

  public goRest(): void {
    this.durationInterval?.unsubscribe();
    this.currentExercise.isRestTimeSubject.next(true);

    this.currentExercise.currentSetSubject.next(
      (this.currentExercise.currentSet || 0) + 1
    );

    this.currentExercise.restSecondsLeftSubject.next(
      this.workoutInfo.pauseBetweenSets || 0
    );
    let currentSeconds = this.workoutInfo.pauseBetweenSets || 0;

    this.restingInterval = interval(1000).subscribe(() => {
      currentSeconds = currentSeconds - 1;
      this.currentExercise.restSecondsLeftSubject.next(currentSeconds);
    });

    this.restSecondsSubscription =
      this.currentExercise.restSecondsLeftSubject.subscribe((seconds) => {
        this.currentExercise.restSecondsLeft = seconds;

        if (seconds == 0) {
          this.restingInterval?.unsubscribe();
          this.goWork();
        }
      });
  }

  public skipRest(): void {
    this.currentExercise.restSecondsLeftSubject.next(0);
    this.currentExercise.isRestTimeSubject.next(false);
    this.restSecondsSubscription?.unsubscribe();
    this.restingInterval?.unsubscribe();
  }

  public formatTime(time: number): string {
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;
    return `${minutes}:${seconds < 10 ? `0${seconds}` : seconds}`;
  }

  public subscribeForGlobalVariables() {
    this.currentExercise.isRestTimeSubject
      .asObservable()
      .subscribe((isRest) => {
        this.currentExercise.isRestTime = isRest;
      });
    this.currentExercise.currentSetSubject
      .asObservable()
      .subscribe(
        (currentSet) => (this.currentExercise.currentSet = currentSet)
      );
    this.currentExercise.hasTimingSubject.asObservable().subscribe((has) => {
      this.currentExercise.hasTiming = has;
    });
  }

  public unsubscribeToSubscriptions() {
    this.setSubscription?.unsubscribe();
    this.secondsSubscription?.unsubscribe();
    this.restSecondsSubscription?.unsubscribe();
    this.isRestSubscription?.unsubscribe();
    this.durationInterval?.unsubscribe();
    this.restingInterval?.unsubscribe();
    this.exerciseTotalDurationInterval?.unsubscribe();
  }

  private handleRepetitionsExercise(exercise: ISessionPracticalExercise) {
    this.durationRestSubscription?.unsubscribe();
    this.setSubscription = this.currentExercise.currentSetSubject
      .asObservable()
      .subscribe((currentSet) => {
        this.currentExercise.repetitions = exercise.repetitions || 0;
        this.currentExercise.hasTimingSubject.next(false);
      });
  }

  private handleDurationExercise(exercise: ISessionPracticalExercise) {
    this.setSubscription?.unsubscribe();
    this.durationRestSubscription = this.currentExercise.isRestTimeSubject
      .asObservable()
      .subscribe((value) => {
        if (!value && !exercise.repetitions) {
          this.currentExercise.hasTimingSubject.next(true);
          let currentDur = exercise.duration || 0;
          this.currentExercise.secondsLeftSubjcet.next(currentDur);

          this.durationInterval = interval(1000).subscribe(() => {
            currentDur > 0 ? (currentDur -= 1) : currentDur;
            this.currentExercise.secondsLeftSubjcet.next(currentDur);
          });

          this.secondsSubscription = this.currentExercise.secondsLeftSubjcet
            .asObservable()
            .subscribe((seconds) => {
              this.currentExercise.secondsLeft = seconds;
              if (seconds == 0) {
                this.durationInterval?.unsubscribe();
                // Wait for next exercise button
                return;
              }
            });
        } else {
          return;
        }
      });
  }

  private assignCurrentExercise(exercise: ISessionPracticalExercise) {
    console.log(exercise)
    // Assign variables to current exercise for visualization and logic
    this.currentExercise.title = exercise.title || '';

    if (exercise.description && exercise.description !== '') {
      this.currentExercise.description = exercise.description;
    } else {
      this.fetchExerciseDescription(exercise.exerciseId);
    }

    this.currentExercise.thumb = exercise.thumbUri;
    this.currentExercise.currentSetSubject.next(1);
    this.currentExercise.totalDuration = 0;
    this.currentExercise.staticDuration = exercise.duration || 0;

    // Start counting the total exercise duration
    this.exerciseTotalDurationInterval = interval(1000).subscribe(() => {
      this.currentExercise.totalDuration += 1;
    });
  }

  private fetchExerciseDescription(exerciseId: any) {
    const queryParams: IQueryParams = {
      what: {
        [EXERCISE_FIELDS.exercises.description]: 1,
      },
      condition: {
        type: 'OR',
        items: [
          {
            field: 'uid',
            operation: 'EQ',
            value: exerciseId,
          },
        ],
      },
    };

    this.exerciseService.getDetails(queryParams).subscribe({
      next: (res) => {
        this.currentExercise.description = res?.data[0].description;
      },
      error: (err) => {
        console.log(err);
      },
    });
  }
}
