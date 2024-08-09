import { Component, Input, OnInit } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { IWorkoutTag } from '../../../entities/workouts/models/workout-tag.interface';
import { IWorkout } from '../../../entities/workouts/models/workout.interface';
import { UserService } from '../../../entities/users/services/user.service';
import { WorkoutService } from '../../../entities/workouts/services/workout.service';
import { IQueryParams } from '../../../entities/models/query-params.interface';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

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
  public selectedTagsSubject = new BehaviorSubject<IWorkoutTag[]>([]);

  public selectedTags?: IWorkoutTag[];
  public searchValue: string = '';

  public ngOnInit(): void {
    this.selectedTagsSubject?.asObservable().subscribe((values) => {
      this.selectedTags = values;
    });
  }

  constructor(
    private readonly userService: UserService,
    private readonly workoutService: WorkoutService
  ) {}

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
    this.search();
  }

  /* public search(): void {
    const filtered = this.allWorkouts.filter((workout) => {
      return workout.title
        .toLowerCase()
        .includes(this.searchValue.toLowerCase());
    });

    this.workoutsSubject?.next(filtered || []);
  } */

  public search(): void {
    this.isLoadingSubject?.next(true);
    let queryParams: IQueryParams | null = null;
    if (this.userService.getUser?.contributorId) {
      queryParams = {
        what: {
          uid: 1,
          title: 1,
          owner: 1,
          tags: 1,
          rating: 1,
          imageUri: 1,
        },
        condition: {
          type: 'AND',
          items: [
            {
              field: 'owner',
              operation: 'EQ',
              value: this.userService.getUser?.contributorId,
            },
          ],
        },
      };
      this.fetchWorkouts(queryParams);
    } else {
      this.userService
        .getUserWorkoutList({
          what: {
            userId: 1,
            workoutSessionId: 1,
          },
          condition: {
            type: 'AND',
            items: [
              {
                field: 'userId',
                operation: 'EQ',
                value: this.userService.getUser?.id,
              },
            ],
          },
        })
        .subscribe({
          next: (x) => {
            if (x?.data) {
              const coniditionItems = x.data.map((x) => ({
                field: 'uid',
                operation: 'EQ',
                value: x.workoutSessionId,
              }));
              if (coniditionItems.length !== 0) {
                queryParams = {
                  what: {
                    uid: 1,
                    title: 1,
                    owner: 1,
                    tags: 1,
                    rating: 1,
                    imageUri: 1,
                  },
                  condition: {
                    type: 'OR',
                    items: coniditionItems,
                  },
                };
                this.fetchWorkouts(queryParams);
              } else {
                this.allWorkouts = [];
                this.workoutsSubject?.next([]);
              }
            }
            this.isLoadingSubject?.next(true);
          },
          error: (err) => console.log(err),
          complete: () => this.isLoadingSubject?.next(false),
        });
    }
  }

  private fetchWorkouts(queryParams: IQueryParams) {
    this.workoutService
      .getWorkouts(queryParams, this.searchValue, this.mapSelectedTags())
      .subscribe({
        next: (res) => {
          this.workoutsSubject?.next(res?.data || []);
        },
        error: (err) => console.log(err),
        complete: () => this.isLoadingSubject?.next(false),
      });
  }

  private mapSelectedTags() {
    return this.selectedTags?.map((el: any) => el.uid).join(",") || null;
  }

  public filterHandler(): void {
    this.toggleFilterForm = !this.toggleFilterForm;
    this.selectedTagsSubject?.next([]);
  }
}
