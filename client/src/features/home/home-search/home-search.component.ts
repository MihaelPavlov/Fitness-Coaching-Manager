import { Component, Input, OnInit } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { IWorkoutTag } from '../../../entities/workouts/models/workout-tag.interface';
import { WorkoutService } from '../../../entities/workouts/services/workout.service';
import { IWorkout } from '../../../entities/workouts/models/workout.interface';

@Component({
  selector: 'app-home-search',
  templateUrl: './home-search.component.html',
  styleUrls: ['./home-search.component.scss'],
})
export class HomeSearchComponent implements OnInit {
  @Input() toggleFilterForm: boolean = false;
  @Input() workoutsSubject?: BehaviorSubject<IWorkout[]>;
  @Input() allWorkouts: IWorkout[] = [];
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
    const filtered = this.allWorkouts.filter((workout) => {
      return workout.title
        .toLowerCase()
        .includes(this.searchValue.toLowerCase());
    });

    this.workoutsSubject?.next(filtered || []);
  }

  public filterHandler(): void {
    this.toggleFilterForm = !this.toggleFilterForm;
    this.selectedTagsSubject?.next([]);
  }
}
