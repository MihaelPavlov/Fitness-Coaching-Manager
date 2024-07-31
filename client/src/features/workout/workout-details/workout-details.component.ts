import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { WorkoutService } from '../../../entities/workouts/services/workout.service';
import { IRequestResult } from '../../../entities/models/request-result.interface';
import { ISessionExercise } from '../../../entities/sessions/models/session-exercise.interface';
import { IQueryParams } from '../../../entities/models/query-params.interface';
import { SessionService } from '../../../entities/sessions/services/session.service';
import { EXERCISE_FIELDS } from '../../../entities/exercises/models/fields/exercise-fields.constant';
import { ExerciseService } from '../../../entities/exercises/services/exercise.service';

@Component({
  selector: 'app-workout-details',
  templateUrl: './workout-details.component.html',
  styleUrl: './workout-details.component.scss',
})
export class WorkoutDetailsComponent implements OnInit {
  public workoutId?: number;
  public workoutName:string = 'Chest Workout';
  public numberOfSets?: number;
  public exercises?: ISessionExercise[];

  constructor(
    private readonly router: Router,
    private readonly route: ActivatedRoute,
    private readonly workoutService: WorkoutService,
    private readonly exerciseService: ExerciseService,
    private readonly sessionService: SessionService
  ){}

  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      this.workoutId = params['workoutId'];
      this.fetchWorkout(params['workoutId']);
    })
  }

  public navigateToDetails(exerciseId: number){
    this.router.navigateByUrl("exercise/details/" + exerciseId);
  }

  public navigateToSession() {
    this.router.navigate([`/workouts/session/${this.workoutId}`]);
  }

  private fetchWorkout(workoutId: number) {
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
        this.workoutName = res?.data.at(0)?.title || "";
        this.numberOfSets = res?.data.at(0)?.numberOfSets || 0;
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
        exercises?.forEach(exercise => {
          if (exercise.description == '' || !exercise.description) {
            this.fetchExerciseDescription(exercise);
          }
        })
        this.exercises = exercises;
      },
      error: (err) => {
        console.log('fetch exercises error - ', err);
      },
    });
  }

  private fetchExerciseDescription(exercise: ISessionExercise) {
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
            value: exercise.exerciseId,
          },
        ],
      },
    };

    this.exerciseService.getDetails(queryParams).subscribe({
      next: (res) => {
        exercise.description = res?.data[0].description || "";
      },
      error: (err) => {
        console.log(err);
      },
    });
  }
}
