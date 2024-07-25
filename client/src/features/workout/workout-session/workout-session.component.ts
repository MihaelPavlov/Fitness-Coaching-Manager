import { Component, OnInit } from '@angular/core';
import { SessionService } from '../../../entities/sessions/services/session.service';
import { ActivatedRoute } from '@angular/router';
import { IQueryParams } from '../../../entities/models/query-params.interface';
import { IRequestResult } from '../../../entities/models/request-result.interface';
import { ISessionExercise } from '../../../entities/sessions/models/session-exercise.interface';
import { WorkoutService } from '../../../entities/workouts/services/workout.service';

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
  public sessionExercises?: Array<any>;

  constructor(
    private readonly sessionService: SessionService,
    private readonly workoutService: WorkoutService,
    private readonly route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      this.fetchWorkoutInfo(params['workoutId']);
      this.fetchExercises(params['workoutId']);
    });
  }

  private fetchWorkoutInfo(workoutId: any) {
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
        console.log("workout", res?.data.at(0));
        this.workoutName = res?.data.at(0)?.title;
        this.numberOfSets = res?.data.at(0)?.numberOfSets;
        this.pauseBetweenExercises = res?.data.at(0)?.pauseBetweenExercises;
        this.pauseBetweenSets = res?.data.at(0)?.pauseBetweenSets;
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
        console.log(res?.data);
      },
      error: (err) => {
        console.log("fetch exercises error - ", err);
      }
    })
  }

  private mapExercisesArray(exercises: ISessionExercise[]): any {

  }
}
