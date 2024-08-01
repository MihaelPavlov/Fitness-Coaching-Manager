import { Component, HostListener, OnDestroy, OnInit } from '@angular/core';
import { SessionService } from '../../../entities/sessions/services/session.service';
import { ActivatedRoute } from '@angular/router';
import { IQueryParams } from '../../../entities/models/query-params.interface';
import { IRequestResult } from '../../../entities/models/request-result.interface';
import {
  ISessionExercise,
  ISessionPracticalExercise,
} from '../../../entities/sessions/models/session-exercise.interface';
import { WorkoutService } from '../../../entities/workouts/services/workout.service';
import { BehaviorSubject, interval, Observable } from 'rxjs';
import { SessionStateService } from '../../../entities/sessions/services/session-state.service';

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
    return false;
  }

  public sessionExercisesSubject$ = new BehaviorSubject<
    ISessionPracticalExercise[]
  >([]);
  public sessionExercises$ = this.sessionExercisesSubject$.asObservable();
  public startTime?: Date;
  public endTime?: Date;

  constructor(
    private readonly sessionService: SessionService,
    private readonly workoutService: WorkoutService,
    public sessionStateService: SessionStateService,
    private readonly route: ActivatedRoute
  ) {}

  public ngOnInit(): void {
    this.route.params.subscribe((params) => {
      this.sessionStateService.workoutInfo.workoutId = params['workoutId'];
      this.fetchWorkoutSession(params['workoutId']);
    });
    this.sessionExercises$.subscribe((exercises) => {
      // Start workout when everything is fetched and ready
      if (exercises.length > 0) {
        this.sessionStateService.exerciseTiming.totalExercises =
          exercises.length;
        this.beginWorkout(exercises);
      }
    });
    this.sessionStateService.subscribeForGlobalVariables();
  }

  public ngOnDestroy(): void {
    this.endGlobalTimeCounter();
    this.sessionStateService.unsubscribeToSubscriptions();
  }

  public beginWorkout(exercises: ISessionPracticalExercise[]): void {
    this.startGlobalTimeCounter();
    this.startTime = new Date();
    this.sessionStateService.performWorkout(exercises);
  }

  public finishWorkout(): void {
    this.sessionStateService.exerciseTiming.exerciseDurationTimes.push(
      this.sessionStateService.currentExercise.totalDuration
    );
    this.endGlobalTimeCounter();
    this.sessionStateService.exerciseTiming.isWorkoutDone = true;
    this.endTime = new Date();
    this.finishWorkoutSession();
  }

  private startGlobalTimeCounter(): void {
    this.sessionStateService.exerciseTiming.totalTimeInterval = interval(
      1000
    ).subscribe(() => {
      this.sessionStateService.exerciseTiming.totalWorkoutTime =
        this.sessionStateService.exerciseTiming.totalWorkoutTime + 1;
    });
  }

  private endGlobalTimeCounter(): void {
    this.sessionStateService.exerciseTiming.totalTimeInterval.unsubscribe();
  }

  private fetchWorkoutSession(workoutId: any): void {
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
        this.sessionStateService.workoutInfo.workoutName =
          res?.data.at(0)?.title || '';
        this.sessionStateService.workoutInfo.numberOfSets =
          res?.data.at(0)?.numberOfSets || 0;
        this.sessionStateService.workoutInfo.pauseBetweenExercises =
          res?.data.at(0)?.pauseBetweenExercises || 0;
        this.sessionStateService.workoutInfo.pauseBetweenSets =
          res?.data.at(0)?.pauseBetweenSets || 0;
        // Fetch exercises here - easier for mapping
        this.fetchExercises(workoutId);
      },
      error: (err) => {
        console.log('Fetch workout error -', err);
      },
    });
  }

  private fetchExercises(workoutId: any): void {
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

  private mapExercisesArray(
    exercises: ISessionExercise[] | undefined
  ): ISessionPracticalExercise[] {
    const practicalExercises = exercises?.map((exercise) => {
      const practicalExercise: ISessionPracticalExercise = {};
      practicalExercise['exerciseId'] = exercise.exerciseId;
      practicalExercise['sets'] =
        this.sessionStateService.workoutInfo.numberOfSets;
      practicalExercise['rest'] =
        this.sessionStateService.workoutInfo.pauseBetweenSets;
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

  private finishWorkoutSession(): void {
    this.sessionService
      .finishSession(this.sessionStateService.workoutInfo.workoutId || 0, {
        timeDuration: this.sessionStateService.exerciseTiming.totalWorkoutTime,
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

  private formatDateForDB(date?: Date): string {
    return date?.toISOString().slice(0, 19).replace('T', ' ') ?? '';
  }
}
