import { Component, Input, OnInit } from '@angular/core';
import { ExerciseService } from '../../../entities/exercises/services/exercise.service';
import { IQueryParams } from '../../../entities/models/query-params.interface';
import { IExercise } from '../../../entities/exercises/models/exercise.interface';
import { EXERCISE_FIELDS } from '../../../entities/exercises/models/fields/exercise-fields.constant';
import { IRequestResult } from '../../../entities/models/request-result.interface';
import { IExerciseTag } from '../../../entities/exercises/models/exercise-tag.interface';

@Component({
  selector: 'app-exercise-library',
  templateUrl: './exercise-library.component.html',
  styleUrl: './exercise-library.component.scss',
})
export class ExerciseLibraryComponent implements OnInit {
  @Input() pageName: string = 'Exercises';
  public exercises: IExercise[] = [];
  public tags: IExerciseTag[] = [];
  constructor(private readonly exerciseService: ExerciseService) {}

  public ngOnInit(): void {
    const queryParamsGetList: IQueryParams = {
      what: {
        [EXERCISE_FIELDS.exercises.uid]: 1,
        [EXERCISE_FIELDS.exercises.title]: 1,
        [EXERCISE_FIELDS.exercises.description]: 1,
        [EXERCISE_FIELDS.exercises.tagIds]: 1,
        [EXERCISE_FIELDS.exercises.equipmentIds]: 1,
        [EXERCISE_FIELDS.exercises.dateCreated]: 1,
        [EXERCISE_FIELDS.exercises.thumbUri]: 1
      },
    };

    this.exerciseService
      .getList(queryParamsGetList)
      .subscribe((exercises: IRequestResult<IExercise[]> | null) => {
        console.log(exercises?.data);
        this.exercises = exercises?.data ?? [];
      });

    const queryParamsGetTagList: IQueryParams = {
      what: {
        [EXERCISE_FIELDS.exercise_tags.uid]: 1,
        [EXERCISE_FIELDS.exercise_tags.name]: 1,
      },
    };

    this.exerciseService
      .getTagList(queryParamsGetTagList)
      .subscribe((tags: IRequestResult<IExerciseTag[]> | null) => {
        console.log(tags?.data);
        this.tags = tags?.data ?? [];
      });
  }

  public getExerciseTags(tagIds: string): IExerciseTag[] {
    if (tagIds) {
      const exerciseTags = tagIds.split(',');
      return this.tags.filter((x) => exerciseTags.includes(x.uid.toString()));
    }
    return [];
  }
}
