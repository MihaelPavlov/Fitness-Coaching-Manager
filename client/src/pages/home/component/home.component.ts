import { Component, DestroyRef, OnInit } from '@angular/core';
import { IQueryParams } from '../../../entities/models/query-params.interface';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { IWorkout } from '../../../entities/workouts/models/workout.interface';
import { BehaviorSubject } from 'rxjs';
import { IUserWorkout } from '../../../entities/users/models/user-workout.interface';
import { UserService } from '../../../entities/users/services/user.service';
import { IWorkoutTag } from '../../../entities/workouts/models/workout-tag.interface';
import { WorkoutService } from '../../../entities/workouts/services/workout.service';
import { UserRoles } from '../../../shared/enums/user-roles.enum';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent implements OnInit {
  public pageName: string = 'Home';
  public workoutsSubject: BehaviorSubject<IWorkout[]> = new BehaviorSubject<
    IWorkout[]
  >([]);
  public allWorkouts: IWorkout[] = this.workoutsSubject.value;
  public filteredWorkouts: IWorkout[] = [];
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
    this.isLoadingSubject
      .asObservable()
      .subscribe((value) => (this.isLoading = value));

    this.workoutsSubject.asObservable().subscribe((values) => {
      this.filteredWorkouts = values;
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
        .pipe(takeUntilDestroyed(this.destroyRef))
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
                this.workoutsSubject.next([]);
              }
            }
            this.isLoadingSubject.next(true);
          },
          error: (err) => console.log(err),
          complete: () => this.isLoadingSubject.next(false),
        });
    }
  }

  private fetchWorkouts(queryParams: IQueryParams) {
    this.workoutService
      .getWorkouts(queryParams)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (res) => {
          this.allWorkouts = res?.data ?? [];
          this.workoutsSubject.next(this.allWorkouts || []);
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
