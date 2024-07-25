import { Component, OnInit } from '@angular/core';
import { SessionService } from '../../../entities/sessions/services/session.service';
import { ActivatedRoute } from '@angular/router';
import { IQueryParams } from '../../../entities/models/query-params.interface';
import { IRequestResult } from '../../../entities/models/request-result.interface';
import { ISessionExercise } from '../../../entities/sessions/models/session-exercise.interface';

@Component({
  selector: 'app-workout-session',
  templateUrl: './workout-session.component.html',
  styleUrl: './workout-session.component.scss',
})
export class WorkoutSessionComponent implements OnInit {
  public workoutName?: string;
  public sessionExercises?: Array<any>;

  constructor(
    private readonly sessionService: SessionService,
    private readonly route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      this.fetchExercises(params['workoutId']);
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
