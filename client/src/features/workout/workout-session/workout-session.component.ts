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

  public workoutId?: number;
  public workoutName?: string;
  public numberOfSets: number = 0;
  public pauseBetweenSets?: number;
  public pauseBetweenExercises?: number;
  public sessionExercisesSubject$ = new BehaviorSubject<
    ISessionPracticalExercise[]
  >([]);
  public sessionExercises$ = this.sessionExercisesSubject$.asObservable();
  public startTime?: Date;
  public endTime?: Date;
  public totalWorkoutTime: number = 0;
  public totalTimeInterval: any;
  public totalExercises: number = 0;

  public isLastExercise: boolean = false;
  public isWorkoutDone: boolean = false;

  // Exercise statistics variables
  public exerciseDurationTimes: Array<number> = [];

  // Current Exercise Variables
  public currentExerciseStaticDuration: number = 0;
  public currentExerciseThumb?: string;

  public currentExerciseTotalDurationSubject$ = new BehaviorSubject<number>(0);
  public currentExerciseTotalDuration$ =
    this.currentExerciseTotalDurationSubject$.asObservable();
  public currentExerciseTotalDuration: number = 0;

  public currentExerciseIndexSubject$ = new BehaviorSubject<number>(0);
  public currentExerciseIndex$ =
    this.currentExerciseIndexSubject$.asObservable();
  public previousExerciseIndex: number = 0;

  public currentExerciseName?: string = '';
  public currentExerciseDescription?: string = '';
  public currentExerciseRepetitions?: number = 0;

  public currentExerciseCurrentSetSubject$ = new BehaviorSubject<number>(0);
  public currentExerciseCurrentSet$ =
    this.currentExerciseCurrentSetSubject$.asObservable();
  public currentExerciseCurrentSet?: number = 0;

  public currentExerciseSecondsLeftSubjcet$ = new BehaviorSubject<number>(0);
  public currentExerciseSecondsLeft$ =
    this.currentExerciseSecondsLeftSubjcet$.asObservable();
  public currentExerciseSecondsLeft?: number = 0;

  public currentExerciseRestSecondsLeftSubject$ = new BehaviorSubject<number>(
    0
  );
  public currentExerciseRestSecondsLeft$ =
    this.currentExerciseRestSecondsLeftSubject$.asObservable();
  public currentExerciseRestSecondsLeft?: number = 0;

  public hasTimingSubject$ = new BehaviorSubject<boolean>(false);
  public hasTiming$ = this.hasTimingSubject$.asObservable();
  public hasTiming?: boolean = false;

  public isRestTimeSubject$ = new BehaviorSubject<boolean>(false);
  public isRestTime$ = this.isRestTimeSubject$.asObservable();
  public isRestTime?: boolean = false;

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
    const totalTimes = this.exerciseDurationTimes.reduce((a, b) => a + b);
    const totalTimesLength = this.exerciseDurationTimes.length;
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
      this.workoutId = params['workoutId'];
      this.fetchWorkoutSession(params['workoutId']);
    });
    this.sessionExercises$.subscribe((exercises) => {
      // Start workout when everything is fetched and ready
      if (exercises.length > 0) {
        this.totalExercises = exercises.length;
        this.beginWorkout(exercises);
      }
    });
    this.isRestTime$.subscribe((isRest) => {
      this.isRestTime = isRest;
    });
    this.currentExerciseCurrentSet$.subscribe(
      (currentSet) => (this.currentExerciseCurrentSet = currentSet)
    );
    this.hasTiming$.subscribe((has) => {
      this.hasTiming = has;
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
    this.exerciseDurationTimes.push(this.currentExerciseTotalDuration);
    //console.log(this.exerciseDurationTimes);
    this.endGlobalTimeCounter();
    this.isWorkoutDone = true;
    this.endTime = new Date();
    this.finishWorkoutSession();
  }

  performWorkout(exercises: ISessionPracticalExercise[]) {
    this.currentExerciseIndex$.subscribe((currentIndex) => {
      if (currentIndex >= exercises.length) {
        // Finish workout
        this.finishWorkout();
        return;
      }

      // Last exercise
      if (currentIndex + 1 == exercises.length) {
        this.isLastExercise = true;
      }

      const exercise = exercises[currentIndex];
      console.log(exercise)
      this.currentExerciseName = exercise.title;

      if (exercise.description && exercise.description !== '') {
        this.currentExerciseDescription = exercise.description;
      } else {
        this.fetchExerciseDescription(exercise.exerciseId);
      }

      this.currentExerciseThumb = exercise.thumbUri;
      this.currentExerciseCurrentSetSubject$.next(1);
      this.currentExerciseTotalDuration = 0;
      this.currentExerciseStaticDuration = exercise.duration || 0;

      this.exerciseTotalDurationInterval = interval(1000).subscribe(() => {
        this.currentExerciseTotalDuration += 1;
      });

      if (exercise.repetitions) {
        this.durationRestSubscription?.unsubscribe();
        this.setSubscription = this.currentExerciseCurrentSet$.subscribe(
          (currentSet) => {
            this.currentExerciseRepetitions = exercise.repetitions;
            this.hasTimingSubject$.next(false);
          }
        );
      } else {
        this.setSubscription?.unsubscribe();
        this.durationRestSubscription = this.isRestTime$.subscribe((value) => {
          if (!value && !exercise.repetitions) {
            console.log('yes go');
            this.hasTimingSubject$.next(true);
            let currentDur = exercise.duration || 0;
            this.currentExerciseSecondsLeftSubjcet$.next(currentDur);

            this.durationInterval = interval(1000).subscribe(() => {
              currentDur > 0 ? currentDur -= 1 : currentDur;
              this.currentExerciseSecondsLeftSubjcet$.next(currentDur);
            });

            this.secondsSubscription =
              this.currentExerciseSecondsLeft$.subscribe((seconds) => {
                this.currentExerciseSecondsLeft = seconds;
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

      this.previousExerciseIndex = currentIndex;
    });
  }

  public nextExerciseRest(): void {
    this.exerciseTotalDurationInterval?.unsubscribe();
    this.exerciseDurationTimes.push(this.currentExerciseTotalDuration);

    if (this.isLastExercise) {
      return this.nextExercise();
    }

    this.currentExerciseIndexSubject$.next(this.previousExerciseIndex + 1);

    this.durationInterval?.unsubscribe();

    this.isRestTimeSubject$.next(true);
    this.currentExerciseRestSecondsLeftSubject$.next(
      this.pauseBetweenExercises || 0
    );
    let currentSeconds = this.pauseBetweenExercises || 0;

    this.restingInterval = interval(1000).subscribe(() => {
      currentSeconds = currentSeconds - 1;
      this.currentExerciseRestSecondsLeftSubject$.next(currentSeconds);
    });

    this.restSecondsSubscription =
      this.currentExerciseRestSecondsLeft$.subscribe((seconds) => {
        this.currentExerciseRestSecondsLeft = seconds;

        if (seconds == 0) {
          this.restingInterval?.unsubscribe();
          this.isRestTimeSubject$.next(false);
          this.nextExercise();
        }
      });
  }

  public nextExercise(): void {
    !this.hasTiming && this.durationInterval?.unsubscribe();
    this.restSecondsSubscription?.unsubscribe();
  }

  public nextSet() {
    this.durationRestSubscription?.unsubscribe();
    this.secondsSubscription?.unsubscribe();
    this.durationInterval?.unsubscribe();
    if (this.currentExerciseCurrentSet || 0 <= this.numberOfSets) {
      if (this.isRestTime) this.goWork();
      else this.goRest();
    } else {
      console.log('stop');
    }
  }

  public goWork(): void {
    this.isRestTimeSubject$.next(false);
    this.restSecondsSubscription?.unsubscribe();
  }

  public goRest(): void {
    this.durationInterval?.unsubscribe();
    this.isRestTimeSubject$.next(true);

    this.currentExerciseCurrentSetSubject$.next(
      (this.currentExerciseCurrentSet || 0) + 1
    );

    this.currentExerciseRestSecondsLeftSubject$.next(
      this.pauseBetweenSets || 0
    );
    let currentSeconds = this.pauseBetweenSets || 0;

    this.restingInterval = interval(1000).subscribe(() => {
      currentSeconds = currentSeconds - 1;
      this.currentExerciseRestSecondsLeftSubject$.next(currentSeconds);
    });

    this.restSecondsSubscription =
      this.currentExerciseRestSecondsLeft$.subscribe((seconds) => {
        this.currentExerciseRestSecondsLeft = seconds;

        if (seconds == 0) {
          this.restingInterval?.unsubscribe();
          this.goWork();
        }
      });
  }

  public skipRest(): void {
    this.currentExerciseRestSecondsLeftSubject$.next(0);
    this.isRestTimeSubject$.next(false);
    this.restSecondsSubscription?.unsubscribe();
    this.restingInterval?.unsubscribe();
  }

  private startGlobalTimeCounter(): void {
    this.totalTimeInterval = interval(1000).subscribe(() => {
      this.totalWorkoutTime = this.totalWorkoutTime + 1;
    });
  }

  private endGlobalTimeCounter(): void {
    this.totalTimeInterval.unsubscribe();
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
        this.workoutName = res?.data.at(0)?.title;
        this.numberOfSets = res?.data.at(0)?.numberOfSets || 0;
        this.pauseBetweenExercises = res?.data.at(0)?.pauseBetweenExercises;
        this.pauseBetweenSets = res?.data.at(0)?.pauseBetweenSets;
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
        [EXERCISE_FIELDS.exercises.description]: 1
      },
      condition: {
        type: "OR",
        items: [
          {
            field: "uid",
            operation: "EQ",
            value: exerciseId
          }
        ]
      },
    }

    this.exerciseService.getDetails(queryParams).subscribe({
      next: (res) => {
        this.currentExerciseDescription = res?.data[0].description;
      },
      error: (err) => {
        console.log(err)
      }
    })
  }

  private mapExercisesArray(
    exercises: ISessionExercise[] | undefined
  ): ISessionPracticalExercise[] {
    const practicalExercises = exercises?.map((exercise) => {
      const practicalExercise: ISessionPracticalExercise = {};
      practicalExercise['exerciseId'] = exercise.exerciseId;
      practicalExercise['sets'] = this.numberOfSets;
      practicalExercise['rest'] = this.pauseBetweenSets;
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
      .finishSession(this.workoutId || 0, {
        timeDuration: this.totalWorkoutTime,
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
