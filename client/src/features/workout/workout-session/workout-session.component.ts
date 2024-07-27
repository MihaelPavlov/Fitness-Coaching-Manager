import { Component, NgZone, OnDestroy, OnInit } from '@angular/core';
import { SessionService } from '../../../entities/sessions/services/session.service';
import { ActivatedRoute } from '@angular/router';
import { IQueryParams } from '../../../entities/models/query-params.interface';
import { IRequestResult } from '../../../entities/models/request-result.interface';
import { ISessionExercise, ISessionPracticalExercise } from '../../../entities/sessions/models/session-exercise.interface';
import { WorkoutService } from '../../../entities/workouts/services/workout.service';
import { BehaviorSubject, interval, Observable } from 'rxjs';

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

  public hasTiming?: boolean = false;

  public isRestTimeSubject$ = new BehaviorSubject<boolean>(false);
  public isRestTime$ = this.isRestTimeSubject$.asObservable();
  public isRestTime?: boolean = false;

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
      console.log("change", isRest)
      this.isRestTime = isRest
    });
    this.currentExerciseCurrentSet$.subscribe((currentSet) => this.currentExerciseCurrentSet = currentSet)
  }

  ngOnDestroy(): void {
      this.isWorkoutDone = true;
  }

  public beginWorkout(exercises: ISessionPracticalExercise[]) {
    this.startGlobalTimeCounter();
    // Do logic here
    this.performWorkout(exercises);
  }

  performWorkout(exercises: ISessionPracticalExercise[]) {
    this.currentExerciseIndex$.subscribe((currentIndex) => {
      const exercise = exercises[currentIndex];
      this.currentExerciseName = exercise.title;
      this.currentExerciseDescription = exercise.description;
      this.currentExerciseCurrentSetSubject$.next(1);

      this.currentExerciseCurrentSet$.subscribe((currentSet) => {
        this.currentExerciseCurrentSet = currentSet;

        if (exercise.repetitions) {
          this.currentExerciseRepetitions = exercise.repetitions;
          this.hasTiming = false;
        } else {
          this.currentExerciseSecondsLeftSubjcet$.next(exercise.duration || 0);
          let currentDur = exercise.duration || 0;
          this.hasTiming = true;

          const currentInterval = interval(1000).subscribe(() => {
            currentDur -= 1;
            this.currentExerciseSecondsLeftSubjcet$.next(currentDur);
          });

          this.currentExerciseSecondsLeft$.subscribe((seconds) => {
            this.currentExerciseSecondsLeft = seconds;
            if (seconds == 0) {
              currentInterval.unsubscribe();
              // Go to rest

            }
          })
        }
      });

      this.previousExerciseIndex = currentIndex;
    })
  }

  public nextExercise(): void {
    this.currentExerciseIndexSubject$.next(this.previousExerciseIndex + 1);
  }

  public nextSet() {
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
  }

  public goRest(): void {
    this.isRestTimeSubject$.next(true);

    this.currentExerciseRestSecondsLeftSubject$.next(this.pauseBetweenSets || 0);
    let currentSeconds = this.pauseBetweenSets || 0;

    const restInterval = interval(1000).subscribe(() => {
      currentSeconds = currentSeconds - 1;
      this.currentExerciseRestSecondsLeftSubject$.next(currentSeconds);
    });

    this.currentExerciseRestSecondsLeft$.subscribe((seconds) => {
      this.currentExerciseRestSecondsLeft = seconds;

      if (seconds == 0) {
        restInterval.unsubscribe();
        this.nextSet();
      };
    });
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
