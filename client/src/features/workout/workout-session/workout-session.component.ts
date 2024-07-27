import { Component, NgZone, OnDestroy, OnInit } from '@angular/core';
import { SessionService } from '../../../entities/sessions/services/session.service';
import { ActivatedRoute } from '@angular/router';
import { IQueryParams } from '../../../entities/models/query-params.interface';
import { IRequestResult } from '../../../entities/models/request-result.interface';
import { ISessionExercise, ISessionPracticalExercise } from '../../../entities/sessions/models/session-exercise.interface';
import { WorkoutService } from '../../../entities/workouts/services/workout.service';
import { BehaviorSubject, interval, Observable, Subscription } from 'rxjs';

@Component({
  selector: 'app-workout-session',
  templateUrl: './workout-session.component.html',
  styleUrl: './workout-session.component.scss',
})
export class WorkoutSessionComponent implements OnInit, OnDestroy {
  public workoutName?: string;
  public numberOfSets: number = 0;
  public pauseBetweenSets?: number;
  public pauseBetweenExercises?: number;
  public sessionExercisesSubject$ = new BehaviorSubject<ISessionPracticalExercise[]>([]);
  public sessionExercises$ = this.sessionExercisesSubject$.asObservable();
  public totalWorkoutTime: number = 0;
  public totalTimeInterval: any;

  public isLastExercise: boolean = false;
  public isWorkoutDone: boolean = false;

  // Current Exercise Variables
  public currentExerciseIndexSubject$ = new BehaviorSubject<number>(0);
  public currentExerciseIndex$ = this.currentExerciseIndexSubject$.asObservable();
  public previousExerciseIndex: number = 0;

  public currentExerciseName?: string = "";
  public currentExerciseDescription?: string = "";
  public currentExerciseRepetitions?: number = 0;

  public currentExerciseCurrentSetSubject$ = new BehaviorSubject<number>(0);
  public currentExerciseCurrentSet$ = this.currentExerciseCurrentSetSubject$.asObservable();
  public currentExerciseCurrentSet?: number = 0;

  public currentExerciseSecondsLeftSubjcet$ = new BehaviorSubject<number>(0);
  public currentExerciseSecondsLeft$ = this.currentExerciseSecondsLeftSubjcet$.asObservable();
  public currentExerciseSecondsLeft?: number = 0;

  public currentExerciseRestSecondsLeftSubject$ = new BehaviorSubject<number>(0);
  public currentExerciseRestSecondsLeft$ = this.currentExerciseRestSecondsLeftSubject$.asObservable();
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
  public restingInterval?: Subscription

  constructor(
    private readonly sessionService: SessionService,
    private readonly workoutService: WorkoutService,
    private readonly route: ActivatedRoute,
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      this.fetchWorkoutSession(params['workoutId']);
    });
    this.sessionExercises$.subscribe((exercises) => {
      // Start workout when everything is fetched and ready
      if (exercises.length > 0) {
        this.beginWorkout(exercises);
      }
    });
    this.isRestTime$.subscribe((isRest) => {
      this.isRestTime = isRest
    });
    this.currentExerciseCurrentSet$.subscribe((currentSet) => this.currentExerciseCurrentSet = currentSet);
    this.hasTiming$.subscribe((has) => {
      this.hasTiming = has
    });
  }

  ngOnDestroy(): void {
      this.isWorkoutDone = true;
  }

  public beginWorkout(exercises: ISessionPracticalExercise[]) {
    this.startGlobalTimeCounter();
    // Do logic here
    this.performWorkout(exercises);
  }

  public finishWorkout(): void {
    this.endGlobalTimeCounter();
    this.isWorkoutDone = true;
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
      this.currentExerciseName = exercise.title;
      this.currentExerciseDescription = exercise.description;
      this.currentExerciseCurrentSetSubject$.next(1);

      this.setSubscription = this.currentExerciseCurrentSet$.subscribe((currentSet) => {
        if (exercise.repetitions) {
          this.currentExerciseRepetitions = exercise.repetitions;
          this.hasTimingSubject$.next(false);
        } else {
          this.hasTimingSubject$.next(true);
          let currentDur = exercise.duration || 0;
          this.currentExerciseSecondsLeftSubjcet$.next(currentDur);

          this.durationInterval = interval(1000).subscribe(() => {
            currentDur -= 1;
            this.currentExerciseSecondsLeftSubjcet$.next(currentDur);
          });

          this.secondsSubscription = this.currentExerciseSecondsLeft$.subscribe((seconds) => {
            this.currentExerciseSecondsLeft = seconds;
            if (seconds == 0) {
              this.durationInterval?.unsubscribe();
              // Go to or wait to trigger new exercise
              if (this.currentExerciseCurrentSet == this.numberOfSets) {
                return;
              } else {
                this.goRest();
              }
            }
          })
        }
      });

      this.previousExerciseIndex = currentIndex;
    })
  }

  public nextExerciseRest(): void {
    if (this.isLastExercise) {
      return this.nextExercise();
    }

    this.isRestTimeSubject$.next(true);
    this.currentExerciseRestSecondsLeftSubject$.next(this.pauseBetweenExercises || 0);
    let currentSeconds = this.pauseBetweenExercises || 0;

    this.restingInterval = interval(1000).subscribe(() => {
      currentSeconds = currentSeconds - 1;
      this.currentExerciseRestSecondsLeftSubject$.next(currentSeconds);
    });

    this.restSecondsSubscription = this.currentExerciseRestSecondsLeft$.subscribe((seconds) => {
      this.currentExerciseRestSecondsLeft = seconds;

      if (seconds == 0) {
        this.restingInterval?.unsubscribe();
        this.isRestTimeSubject$.next(false);
        this.nextExercise();
      };
    });
  }

  public nextExercise(): void {
    this.currentExerciseIndexSubject$.next(this.previousExerciseIndex + 1);
    this.restSecondsSubscription?.unsubscribe();
  }

  public nextSet() {
    this.secondsSubscription?.unsubscribe();
    this.durationInterval?.unsubscribe();
    if (this.currentExerciseCurrentSet || 0 <= this.numberOfSets) {
      if (this.isRestTime) this.goWork();
      else this.goRest();
    } else {
      console.log("stop");
    }
  }

  public goWork(): void {
    console.log('go work')
    this.isRestTimeSubject$.next(false);
    this.currentExerciseCurrentSetSubject$.next((this.currentExerciseCurrentSet || 0) + 1);
    this.restSecondsSubscription?.unsubscribe();
  }

  public goRest(): void {
    this.isRestTimeSubject$.next(true);

    this.currentExerciseRestSecondsLeftSubject$.next(this.pauseBetweenSets || 0);
    let currentSeconds = this.pauseBetweenSets || 0;

    this.restingInterval = interval(1000).subscribe(() => {
      currentSeconds = currentSeconds - 1;
      this.currentExerciseRestSecondsLeftSubject$.next(currentSeconds);
    });

    this.restSecondsSubscription = this.currentExerciseRestSecondsLeft$.subscribe((seconds) => {
      this.currentExerciseRestSecondsLeft = seconds;

      if (seconds == 0) {
        this.restingInterval?.unsubscribe();
        this.goWork();
      };
    });
  }

  public skipRest(): void {
    this.currentExerciseRestSecondsLeftSubject$.next(0);
    this.isRestTimeSubject$.next(false);
    this.restSecondsSubscription?.unsubscribe();
    this.restingInterval?.unsubscribe();
  }

  private startGlobalTimeCounter(): void {
    this.totalTimeInterval = interval(1000).subscribe(
      () => {
        this.totalWorkoutTime = this.totalWorkoutTime + 1;
      }
    )
  }

  private endGlobalTimeCounter(): void {
    this.totalTimeInterval.unsubscribe();
  }

  public formatTime(time: number): string {
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;
    return `${minutes}:${seconds < 10 ? `0${seconds}`: seconds}`;
  }

  private fetchWorkoutSession(workoutId: any) {
    const queryParams: IQueryParams = {
      what: {
        title: 1,
        numberOfSets: 1,
        pauseBetweenSets: 1,
        pauseBetweenExercises: 1
      },
      condition: {
        type: "AND",
        items: [
          {
            field: "uid",
            operation: "EQ",
            value: workoutId
          }
        ]
      }
    }

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
        console.log("Fetch workout error -", err);
      }
    })
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
        this.sessionExercisesSubject$.next(this.mapExercisesArray(exercises))
      },
      error: (err) => {
        console.log("fetch exercises error - ", err);
      }
    })
  }

  private mapExercisesArray(exercises: ISessionExercise[] | undefined): ISessionPracticalExercise[] {
    const practicalExercises = exercises?.map((exercise) => {
      const practicalExercise: ISessionPracticalExercise = {};
      practicalExercise["sets"] = this.numberOfSets;
      practicalExercise["rest"] = this.pauseBetweenSets;
      practicalExercise["description"] = exercise.description;
      practicalExercise["title"] = exercise.title;
      practicalExercise["thumbUri"] = exercise.thumbUri;
      if (exercise.hasTiming === 1) {
        practicalExercise["duration"] = exercise.duration;
      } else {
        practicalExercise["repetitions"] = exercise.repetitions;
      }
      return practicalExercise;
    });

    return practicalExercises || [];
  }
}
