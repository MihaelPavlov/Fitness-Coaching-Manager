import {
  ChangeDetectorRef,
  Component,
  DestroyRef,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { WorkoutService } from '../../../entities/workouts/services/workout.service';
import { BehaviorSubject, Observable, Subscription } from 'rxjs';
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
export class WorkoutLibraryComponent implements OnInit, OnDestroy {
  public pageName: string = 'Workouts';
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
  private subscriptions: Subscription[] = [];
  
  constructor(
    private readonly workoutService: WorkoutService,
    private readonly userService: UserService,
    private readonly cd: ChangeDetectorRef,
    private readonly destroyRef: DestroyRef
  ) {}

  public ngOnDestroy(): void {
    this.clearSubscriptions();
  }
  private clearSubscriptions(): void {
    console.log('clearance');

    this.subscriptions.forEach((sub) => sub.unsubscribe());
    this.subscriptions = [];
    this.workoutsSubject.next([]);
    this.allWorkouts = [];
  }
  public ngOnInit(): void {
    this.selectedTagsSubject.asObservable().subscribe((selectedTags) => {
      console.log("selected Tags", selectedTags);
      
      this.workoutsSubject.asObservable().subscribe((workouts) => {
        console.log('on tag change', workouts);

        this.filteredWorkouts = workouts.filter((workout) => {
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

    this.subscriptions.push(
      this.workoutsSubject.asObservable().subscribe((values) => {
        this.filteredWorkouts = values; // Initialize filteredWorkouts with all workouts
      })
    );

    this.getWorkouts();

    this.getWorkoutTags();

    this.subscriptions.push(
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
        })
    );
  }

  private getWorkouts(): void {
    this.isLoadingSubject.next(true);
    let queryParams: IQueryParams | null = null;
    if (this.userService.getUser?.contributorId) {
      console.log('init contributor workouts');

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
      console.log('init user workouts');

      this.subscriptions.push(
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
          })
      );
    }
  }

  private fetchWorkouts(queryParams: IQueryParams) {
    this.subscriptions.push(
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
        })
    );
  }

  private getWorkoutTags(): void {
    const queryParams: IQueryParams = {
      what: {
        uid: 1,
        name: 1,
      },
    };

    this.subscriptions.push(
      this.workoutService
        .getWorkoutTags(queryParams)
        .pipe(takeUntilDestroyed(this.destroyRef))
        .subscribe({
          next: (res) => {
            this.tags = res?.data;
          },
          error: (err) => console.log(err),
        })
    );
  }
}
