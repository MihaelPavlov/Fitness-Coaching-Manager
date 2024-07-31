import {
  Component,
  HostListener,
  NgZone,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { SessionService } from '../../../entities/sessions/services/session.service';
import { ActivatedRoute } from '@angular/router';
import { IQueryParams } from '../../../entities/models/query-params.interface';
import { IRequestResult } from '../../../entities/models/request-result.interface';
import {
  ISessionExercise,
  ISessionPracticalExercise,
} from '../../../entities/sessions/models/session-exercise.interface';
import { WorkoutService } from '../../../entities/workouts/services/workout.service';
import { BehaviorSubject, interval, Observable, Subscription } from 'rxjs';
import { ExerciseService } from '../../../entities/exercises/services/exercise.service';
import { EXERCISE_FIELDS } from '../../../entities/exercises/models/fields/exercise-fields.constant';
import { CurrentExercise, ExerciseTiming, WorkoutInfo } from '../../../entities/sessions/models/session-variables.interface';

@Component({
  selector: 'app-workout-session',
  templateUrl: './workout-session.component.html',
  styleUrl: './workout-session.component.scss',
})
export class WorkoutSessionComponent implements OnInit, OnDestroy {
  @HostListener('window:beforeunload')
  canDeactivate(): Observable<boolean> | boolean {
    // return false for showing confirm window
    // return true for not showing confirm window and exit
    return true;
  }

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

  public sessionExercisesSubject$ = new BehaviorSubject<
    ISessionPracticalExercise[]
  >([]);
  public sessionExercises$ = this.sessionExercisesSubject$.asObservable();
  public startTime?: Date;
  public endTime?: Date;

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
    const totalTimes = this.exerciseTiming.exerciseDurationTimes.reduce((a, b) => a + b);
    const totalTimesLength = this.exerciseTiming.exerciseDurationTimes.length;
    return this.formatTime(Math.floor(totalTimes / totalTimesLength));
  }

  constructor(
    private readonly sessionService: SessionService,
    private readonly workoutService: WorkoutService,
    private readonly exerciseService: ExerciseService,
    private readonly route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      this.workoutInfo.workoutId = params['workoutId'];
      this.fetchWorkoutSession(params['workoutId']);
    });
    this.sessionExercises$.subscribe((exercises) => {
      // Start workout when everything is fetched and ready
      if (exercises.length > 0) {
        this.exerciseTiming.totalExercises = exercises.length;
        this.beginWorkout(exercises);
      }
    });
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

  ngOnDestroy(): void {
    this.endGlobalTimeCounter();
    this.setSubscription?.unsubscribe();
    this.secondsSubscription?.unsubscribe();
    this.restSecondsSubscription?.unsubscribe();
    this.isRestSubscription?.unsubscribe();
    this.durationInterval?.unsubscribe();
    this.restingInterval?.unsubscribe();
    this.exerciseTotalDurationInterval?.unsubscribe();
  }

  public beginWorkout(exercises: ISessionPracticalExercise[]) {
    this.startGlobalTimeCounter();
    // Do logic here
    this.startTime = new Date();
    this.performWorkout(exercises);
  }

  public finishWorkout(): void {
    this.exerciseTiming.exerciseDurationTimes.push(this.currentExercise.totalDuration);
    //console.log(this.exerciseDurationTimes);
    this.endGlobalTimeCounter();
    this.exerciseTiming.isWorkoutDone = true;
    this.endTime = new Date();
    this.finishWorkoutSession();
  }

  performWorkout(exercises: ISessionPracticalExercise[]) {
    this.currentExercise.indexSubject
      .asObservable()
      .subscribe((currentIndex) => {
        if (currentIndex >= exercises.length) {
          // Finish workout
          this.finishWorkout();
          return;
        }

        // Last exercise
        if (currentIndex + 1 == exercises.length) {
          this.exerciseTiming.isLastExercise = true;
        }

        const exercise = exercises[currentIndex];
        console.log(exercise);
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

        this.exerciseTotalDurationInterval = interval(1000).subscribe(() => {
          this.currentExercise.totalDuration += 1;
        });

        if (exercise.repetitions) {
          this.durationRestSubscription?.unsubscribe();
          this.setSubscription = this.currentExercise.currentSetSubject
            .asObservable()
            .subscribe((currentSet) => {
              this.currentExercise.repetitions = exercise.repetitions || 0;
              this.currentExercise.hasTimingSubject.next(false);
            });
        } else {
          this.setSubscription?.unsubscribe();
          this.durationRestSubscription = this.currentExercise.isRestTimeSubject
            .asObservable()
            .subscribe((value) => {
              if (!value && !exercise.repetitions) {
                console.log('yes go');
                this.currentExercise.hasTimingSubject.next(true);
                let currentDur = exercise.duration || 0;
                this.currentExercise.secondsLeftSubjcet.next(currentDur);

                this.durationInterval = interval(1000).subscribe(() => {
                  currentDur > 0 ? (currentDur -= 1) : currentDur;
                  this.currentExercise.secondsLeftSubjcet.next(currentDur);
                });

                this.secondsSubscription =
                  this.currentExercise.secondsLeftSubjcet
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

        this.currentExercise.previousIndex = currentIndex;
      });
  }

  public nextExerciseRest(): void {
    this.exerciseTotalDurationInterval?.unsubscribe();
    this.exerciseTiming.exerciseDurationTimes.push(this.currentExercise.totalDuration);

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
    this.durationRestSubscription?.unsubscribe();
    this.secondsSubscription?.unsubscribe();
    this.durationInterval?.unsubscribe();
    if (this.currentExercise.currentSet || 0 <= this.workoutInfo.numberOfSets) {
      if (this.currentExercise.isRestTime) this.goWork();
      else this.goRest();
    } else {
      console.log('stop');
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

  private startGlobalTimeCounter(): void {
    this.exerciseTiming.totalTimeInterval = interval(1000).subscribe(() => {
      this.exerciseTiming.totalWorkoutTime = this.exerciseTiming.totalWorkoutTime + 1;
    });
  }

  private endGlobalTimeCounter(): void {
    this.exerciseTiming.totalTimeInterval.unsubscribe();
  }

  public formatTime(time: number): string {
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;
    return `${minutes}:${seconds < 10 ? `0${seconds}` : seconds}`;
  }

  private fetchWorkoutSession(workoutId: any) {
    const queryParams: IQueryParams = {
      what: {
        title: 1,
        numberOfSets: 1,
        pauseBetweenSets: 1,
        pauseBetweenExercises: 1,
      },
      condition: {
        type: 'AND',
        items: [
          {
            field: 'uid',
            operation: 'EQ',
            value: workoutId,
          },
        ],
      },
    };

    this.workoutService.getWorkouts(queryParams).subscribe({
      next: (res) => {
        this.workoutInfo.workoutName = res?.data.at(0)?.title || "";
        this.workoutInfo.numberOfSets = res?.data.at(0)?.numberOfSets || 0;
        this.workoutInfo.pauseBetweenExercises = res?.data.at(0)?.pauseBetweenExercises || 0;
        this.workoutInfo.pauseBetweenSets = res?.data.at(0)?.pauseBetweenSets || 0;
        // Fetch exercises here - easier for mapping
        this.fetchExercises(workoutId);
      },
      error: (err) => {
        console.log('Fetch workout error -', err);
      },
    });
  }

  private fetchExercises(workoutId: any) {
    const queryParams: IQueryParams = {
      what: {
        exerciseId: 1,
        rank: 1,
        description: 1,
        hasTiming: 1,
        duration: 1,
        repetitions: 1,
      },
      condition: {
        type: 'AND',
        items: [
          {
            field: 'sessionId',
            operation: 'EQ',
            value: workoutId,
          },
        ],
      },
    };

    this.sessionService.getSessionExercises(queryParams).subscribe({
      next: (res: IRequestResult<ISessionExercise[]> | null) => {
        const exercises = res?.data;
        this.sessionExercisesSubject$.next(this.mapExercisesArray(exercises));
      },
      error: (err) => {
        console.log('fetch exercises error - ', err);
      },
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

  private mapExercisesArray(
    exercises: ISessionExercise[] | undefined
  ): ISessionPracticalExercise[] {
    const practicalExercises = exercises?.map((exercise) => {
      const practicalExercise: ISessionPracticalExercise = {};
      practicalExercise['exerciseId'] = exercise.exerciseId;
      practicalExercise['sets'] = this.workoutInfo.numberOfSets;
      practicalExercise['rest'] = this.workoutInfo.pauseBetweenSets;
      practicalExercise['description'] = exercise.description;
      practicalExercise['title'] = exercise.title;
      practicalExercise['thumbUri'] = exercise.thumbUri;
      if (exercise.hasTiming === 1) {
        practicalExercise['duration'] = exercise.duration;
      } else {
        practicalExercise['repetitions'] = exercise.repetitions;
      }
      return practicalExercise;
    });

    return practicalExercises || [];
  }

  private finishWorkoutSession() {
    this.sessionService
      .finishSession(this.workoutInfo.workoutId || 0, {
        timeDuration: this.exerciseTiming.totalWorkoutTime,
        startTime: this.formatDateForDB(this.startTime),
        endTime: this.formatDateForDB(this.endTime),
      })
      .subscribe({
        next: () => {
          console.log('finished workout!');
        },
        error: (err) => {
          console.log(err);
        },
      });
  }

  private formatDateForDB(date?: Date) {
    return date?.toISOString().slice(0, 19).replace('T', ' ');
  }
}
