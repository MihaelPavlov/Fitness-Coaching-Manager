import { Component, Input } from '@angular/core';
import { ExerciseService } from '../../../entities/exercises/services/exercise.service';
import { IQueryParams } from '../../../entities/models/query-params.interface';
import { EXERCISE_FIELDS } from '../../../entities/exercises/models/fields/exercise-fields.constant';
import { BehaviorSubject } from 'rxjs';
import { IExercise } from '../../../entities/exercises/models/exercise.interface';
import { IExerciseTag } from '../../../entities/exercises/models/exercise-tag.interface';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss'],
})
export class SearchComponent {
  @Input() toggleFilterForm: boolean = false;
  @Input() exercisesSubject?: BehaviorSubject<IExercise[]>;
  @Input() isLoadingSubject?: BehaviorSubject<boolean>;
  @Input() tags?: IExerciseTag[];
  public searchValue: string = "";

  constructor(private readonly exerciseService: ExerciseService) {}

  public onSearchChange(event: Event) {
    const value = (event.target as HTMLInputElement).value;
    this.searchValue = value;
  }

  public onTagSelect(event: Event, tagId: any) {
    const isChecked = (event.target as HTMLInputElement).checked;
  }

  public search() {
    this.isLoadingSubject?.next(true);
    const queryParams: IQueryParams = {
      what: {
        [EXERCISE_FIELDS.exercises.uid]: 1,
        [EXERCISE_FIELDS.exercises.title]: 1,
        [EXERCISE_FIELDS.exercises.description]: 1,
        [EXERCISE_FIELDS.exercises.tagIds]: 1,
        [EXERCISE_FIELDS.exercises.equipmentIds]: 1,
        [EXERCISE_FIELDS.exercises.dateCreated]: 1,
        [EXERCISE_FIELDS.exercises.thumbUri]: 1
      },
    }

    this.exerciseService.searchExercises(queryParams, this.searchValue).subscribe({
      next: (res) => {
        this.exercisesSubject?.next(res?.data || []);
        this.isLoadingSubject?.next(false);
      },
      error: (err) => {
        console.log('search error', err);
        this.isLoadingSubject?.next(false);
      }
    })
  }

  public filterHandler(): void {
    this.toggleFilterForm = !this.toggleFilterForm;
  }
}
