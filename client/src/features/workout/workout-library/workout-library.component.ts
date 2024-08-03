import { Component, DestroyRef, OnDestroy, OnInit } from '@angular/core';
import { WorkoutService } from '../../../entities/workouts/services/workout.service';
import { BehaviorSubject, Subscription } from 'rxjs';
import { IWorkout } from '../../../entities/workouts/models/workout.interface';
import { IWorkoutTag } from '../../../entities/workouts/models/workout-tag.interface';
import { IQueryParams } from '../../../entities/models/query-params.interface';
import { UserService } from '../../../entities/users/services/user.service';
import { IUserWorkout } from '../../../entities/users/models/user-workout.interface';
import { UserRoles } from '../../../shared/enums/user-roles.enum';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-workout-library',
  templateUrl: './workout-library.component.html',
  styleUrl: './workout-library.component.scss',
})
export class WorkoutLibraryComponent implements OnInit {
  public pageName: string = 'Workouts';
  public workoutsSubject: BehaviorSubject<IWorkout[]> = new BehaviorSubject<
    IWorkout[]
  >([]);
  public workouts: IWorkout[] = this.workoutsSubject.value;
  public tags?: IWorkoutTag[];
  public userRoles = UserRoles;
  public currentRole = this.userService.getUser?.role;
  public selectedTagsSubject = new BehaviorSubject<IWorkoutTag[]>([]);

  public isLoadingSubject = new BehaviorSubject<boolean>(false);
  public isLoading: boolean = false;
  public userWorkouts!: IUserWorkout[];

  constructor(
    private readonly workoutService: WorkoutService,
    private readonly userService: UserService,
    private readonly destroyRef: DestroyRef
  ) {}

  public ngOnInit(): void {
    this.selectedTagsSubject.asObservable().subscribe((selectedTags) => {
      this.workoutsSubject.asObservable().subscribe((workouts) => {
        this.workouts = workouts.filter((workout) => {
          let result = false;
          if (selectedTags.length == 0) return true;
          selectedTags.forEach((selectedTag) => {
            workout.tags.forEach((tag) => {
              if (tag.name == selectedTag.name) result = true;
            });
          });
          return result;
        });
      });
    });

    this.isLoadingSubject
      .asObservable()
      .subscribe((value) => (this.isLoading = value));

    this.workoutsSubject.asObservable().subscribe((values) => {
      this.workouts = values;
    });

    this.getWorkouts();

    this.getWorkoutTags();

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
      .subscribe((result) => {
        if (result) {
          this.userWorkouts = result.data;
        }
      });
  }

  private getWorkouts(): void {
    this.isLoadingSubject.next(true);

    const queryParams = {
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
            field: 'private',
            operation: 'EQ',
            value: 0,
          },
        ],
      },
    };
    this.fetchWorkouts(queryParams);
  }

  private fetchWorkouts(queryParams: IQueryParams) {
    this.workoutService
      .getWorkouts(queryParams)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (res) => {
          this.workouts = res?.data ?? [];
          this.workoutsSubject.next(this.workouts || []);
        },
        error: (err) => console.log(err),
        complete: () => this.isLoadingSubject.next(false),
      });
  }

  private getWorkoutTags(): void {
    const queryParams: IQueryParams = {
      what: {
        uid: 1,
        name: 1,
      },
    };

    this.workoutService
      .getWorkoutTags(queryParams)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (res) => {
          this.tags = res?.data;
        },
        error: (err) => console.log(err),
      });
  }
}
