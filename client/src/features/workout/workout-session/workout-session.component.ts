import { Component, OnInit } from '@angular/core';
import { SessionService } from '../../../entities/sessions/services/session.service';
import { ActivatedRoute } from '@angular/router';
import { IQueryParams } from '../../../entities/models/query-params.interface';
import { IRequestResult } from '../../../entities/models/request-result.interface';
import { ISessionExercise, ISessionPracticalExercise } from '../../../entities/sessions/models/session-exercise.interface';
import { WorkoutService } from '../../../entities/workouts/services/workout.service';
import { BehaviorSubject } from 'rxjs';

@Component({
  selector: 'app-workout-session',
  templateUrl: './workout-session.component.html',
  styleUrl: './workout-session.component.scss',
})
export class WorkoutSessionComponent implements OnInit {
  public workoutName?: string;
  public numberOfSets?: number;
  public pauseBetweenSets?: number;
  public pauseBetweenExercises?: number;
  private sessionExercisesSubject$ = new BehaviorSubject<ISessionPracticalExercise[]>([]);
  public sessionExercises$ = this.sessionExercisesSubject$.asObservable();

  constructor(
    private readonly sessionService: SessionService,
    private readonly workoutService: WorkoutService,
    private readonly route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      this.fetchWorkoutSession(params['workoutId']);
    });
    this.sessionExercises$.subscribe((exercises) => {
      if (exercises.length > 0) {
        this.beginWorkout(exercises);
      }
    })
  }

  public beginWorkout(exercises: ISessionPracticalExercise[]) {
    console.log("begin workout!")
    console.log(exercises);
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
        this.numberOfSets = res?.data.at(0)?.numberOfSets;
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
