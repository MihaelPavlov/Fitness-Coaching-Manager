import { Component, Input, OnInit } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { IWorkoutTag } from '../../../entities/workouts/models/workout-tag.interface';
import { WorkoutService } from '../../../entities/workouts/services/workout.service';
import { IWorkout } from '../../../entities/workouts/models/workout.interface';
import { IQueryParams } from '../../../entities/models/query-params.interface';

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
  public searchValue: string = '';

  constructor(private readonly workoutService: WorkoutService) {}

  public ngOnInit(): void {
    this.selectedTagsSubject?.asObservable().subscribe((values) => {
      this.selectedTags = values;
    });
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
      this.selectedTags = this.selectedTags?.filter(
        (selectedTag) => selectedTag.uid !== tag.uid
      );
    }
    this.selectedTagsSubject?.next(this.selectedTags || []);
  }

  public search(): void {
    this.isLoadingSubject?.next(true);
    const queryParams: IQueryParams = {
      what: {
        uid: 1,
        title: 1,
        owner: 1,
        tags: 1,
        rating: 1,
        imageUri: 1,
      },
    };

    this.workoutService
      .searchWorkouts(queryParams, this.searchValue)
      .subscribe({
        next: (res) => {
          this.workoutsSubject?.next(res?.data || []);
          this.isLoadingSubject?.next(false);
        },
        error: (err) => {
          this.isLoadingSubject?.next(false);
        },
      });
  }

  public filterHandler(): void {
    this.toggleFilterForm = !this.toggleFilterForm;
    this.selectedTagsSubject?.next([]);
  }
}
