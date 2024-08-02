import { Component, Input, OnInit } from '@angular/core';
import { IQueryParams } from '../../../entities/models/query-params.interface';
import { EXERCISE_FIELDS } from '../../../entities/exercises/models/fields/exercise-fields.constant';
import { BehaviorSubject, Subscription } from 'rxjs';
import { IWorkoutTag } from '../../../entities/workouts/models/workout-tag.interface';
import { WorkoutService } from '../../../entities/workouts/services/workout.service';
import { IWorkout } from '../../../entities/workouts/models/workout.interface';

@Component({
  selector: 'app-workout-search',
  templateUrl: './workout-search.component.html',
  styleUrls: ['./workout-search.component.scss'],
})
export class WorkoutSearchComponent implements OnInit {
  @Input() toggleFilterForm: boolean = false;
  @Input() workoutsSubject?: BehaviorSubject<IWorkout[]>;
  @Input() isLoadingSubject?: BehaviorSubject<boolean>;
  @Input() tags?: IWorkoutTag[];
  @Input() selectedTagsSubject?: BehaviorSubject<IWorkoutTag[]>;

  public selectedTags?: IWorkoutTag[];
  public searchValue: string = "";

  constructor(private readonly workoutService: WorkoutService) {}

  ngOnInit(): void {
      this.selectedTagsSubject?.asObservable().subscribe((values) => {
        this.selectedTags = values;
      })
  }

  public onSearchChange(event: Event) {
    const value = (event.target as HTMLInputElement).value;
    this.searchValue = value;
    this.search();
  }

  public onTagSelectChange(event: Event, tag: any) {
    const isChecked = (event.target as HTMLInputElement).checked;
    if (isChecked) {
      this.selectedTags?.push(tag);
    } else {
      this.selectedTags = this.selectedTags?.filter((selectedTag) => selectedTag.uid !== tag.uid);
    }
    this.selectedTagsSubject?.next(this.selectedTags || [])
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
    console.log("search");
    this.isLoadingSubject?.next(false);

    /* this.exerciseService.searchExercises(queryParams, this.searchValue).subscribe({
      next: (res) => {
        this.exercisesSubject?.next(res?.data || []);
        this.isLoadingSubject?.next(false);
      },
      error: (err) => {
        console.log('search error', err);
        this.isLoadingSubject?.next(false);
      }
    }) */
  }

  public filterHandler(): void {
    this.toggleFilterForm = !this.toggleFilterForm;
  }
}
