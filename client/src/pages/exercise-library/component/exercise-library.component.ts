import { Component, Input, OnInit } from '@angular/core';
import { ExerciseService } from '../../../entities/exercises/services/exercise.service';
import { IQueryParams } from '../../../entities/models/query-params.interface';
import { IExercise } from '../../../entities/exercises/models/exercise.interface';
import { EXERCISE_FIELDS } from '../../../entities/exercises/models/exercise-fields.constant';
import { IRequestResult } from '../../../entities/models/request-result.interface';

@Component({
  selector: 'app-exercise-library',
  templateUrl: './exercise-library.component.html',
  styleUrl: './exercise-library.component.scss',
})
export class ExerciseLibraryComponent implements OnInit {
  @Input() pageName: string = 'Exercises';
  public exercises: IExercise[] = [];

  constructor(private readonly exerciseService: ExerciseService) {}

  public ngOnInit(): void {
    const queryParams: IQueryParams = {
      what: {
        [EXERCISE_FIELDS.exercises.uid]: 1,
        [EXERCISE_FIELDS.exercises.title]: 1,
        [EXERCISE_FIELDS.exercises.description]: 1,
        [EXERCISE_FIELDS.exercises.tagIds]: 1,
        [EXERCISE_FIELDS.exercises.equipmentIds]: 1,
        [EXERCISE_FIELDS.exercises.dateCreated]: 1,
      },
    };

    this.exerciseService
      .getExercises(queryParams)
      .subscribe((exercises: IRequestResult<IExercise[]> | null) => {
        console.log(exercises?.data);
        this.exercises = exercises?.data ?? [];
      });
  }
}
