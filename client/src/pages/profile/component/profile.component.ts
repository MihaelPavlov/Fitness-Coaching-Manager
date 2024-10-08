import { Component, OnInit } from '@angular/core';
import { IQueryParams } from '../../../entities/models/query-params.interface';
import { UserService } from '../../../entities/users/services/user.service';
import { IRequestResult } from '../../../entities/models/request-result.interface';
import { IUserDetails } from '../../../entities/users/models/user-details.interface';
import { ActivatedRoute, Router } from '@angular/router';
import { USERS_FIELDS } from '../../../entities/users/models/fields/users-fields.constant';
import { IWorkout } from '../../../entities/workouts/models/workout.interface';
import { WorkoutService } from '../../../entities/workouts/services/workout.service';
import { UserInfo } from '../../../entities/models/user.interface';
import { UserRoles } from '../../../shared/enums/user-roles.enum';
import { IUserWorkout } from '../../../entities/users/models/user-workout.interface';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
})
export class ProfileComponent implements OnInit {
  profileState: 'public' | 'private' = 'public';

  public user: IUserDetails | undefined;
  public currentProfilePictureUri?: string;
  public profilePictureFile: any;
  public profileUserId?: number;
  public profileContributorId?: number;
  protected isAuth: boolean = false;
  protected isSubscribed: boolean = false;
  protected visitorRole: number = UserRoles.User;

  public workouts!: IWorkout[];
  public userWorkouts!: IUserWorkout[];

  constructor(
    private readonly userService: UserService,
    private readonly workoutService: WorkoutService,
    private readonly activeRouter: ActivatedRoute,
    private readonly router: Router
  ) {}

  public ngOnInit(): void {
    this.activeRouter.params.subscribe((params) => {
      this.profileUserId = params['userId'];

      // Check for authentication for private profile
      this.checkAuthentication();

      this.fetchUserProfile();

      this.checkSubscription();
    });

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

  public onProfilePictureChange(event: Event) {
    const files = (event.target as HTMLInputElement)?.files;
    const file = files?.item(files.length - 1);
    const allowedFiles = ['image/png', 'image/jpeg', 'image/jpg', 'image/webp'];
    if (!allowedFiles.includes(file?.type as string)) {
      return alert('Images only allowed');
    }
    const reader = new FileReader();
    reader.readAsDataURL(file as Blob);

    reader.onload = (readerEvent) => {
      this.currentProfilePictureUri = readerEvent.target?.result as string;
    };
    this.profilePictureFile = file;
  }

  public onSubscribe(): void {
    if (!this.isAuth) {
      this.router.navigate(['/login']);
    }

    this.userService
      .subscribeToContributor(this.profileContributorId as number)
      .subscribe({
        next: (res: any) => {
          this.isSubscribed = true;
        },
        error: (err) => {
          console.log(err);
        },
      });
  }

  public onUnsubscribe(): void {
    this.userService
      .unsubscribeToContributor(this.profileContributorId as number)
      .subscribe({
        next: (res: any) => {
          this.isSubscribed = false;
        },
        error: (err) => {
          console.log(err);
        },
      });
  }

  public navigateToChat() {
    if (this.isSubscribed) {
      this.router.navigate([`chat/${this.profileUserId}`]);
    }
  }

  private checkAuthentication(): void {
    this.userService.isAuth$.subscribe((isAuth) => {
      if (!this.profileUserId) {
        if (!isAuth) {
          this.router.navigate(['/login']);
        }
      }
    });
  }

  private fetchUserProfile(): void {
    this.userService.userInfo$.subscribe((userInfo: UserInfo | null) => {
      if (userInfo) {
        this.isAuth = true;
        this.visitorRole = userInfo.role;
        if (!this.profileUserId || userInfo.id == this.profileUserId) {
          // Same user trying to access his public profile - not allowed
          // Do different builder request for private
          this.fetchPrivateProfileUser(userInfo.id);
          // Set profile state to private
          this.profileState = 'private';
        } else {
          // Logged-in user see other profile
          this.fetchPublicProfileUser();
        }
      } else {
        this.fetchPublicProfileUser();
      }
    });
  }

  private checkSubscription(): void {
    console.log('params -> ', this.profileUserId);

    if (this.profileState === 'public' && this.profileUserId) {
      this.userService.hasUserSubscribed(this.profileUserId).subscribe({
        next: (res: any) => {
          if (
            this.visitorRole === UserRoles.Coach &&
            !res?.data?.hasSubscribed &&
            !this.profileContributorId
          ) {
            this.router.navigate(['/']); //TODO: Show not found page.
          }
          this.isSubscribed = res?.data?.hasSubscribed;
        },
        error: (err) => {
          console.log(err);
        },
      });
    }
  }

  private fetchPublicProfileUser(): void {
    const queryParams: IQueryParams = {
      what: {
        [USERS_FIELDS.users.firstName]: 1,
        [USERS_FIELDS.users.lastName]: 1,
        [USERS_FIELDS.user_specs.BMI]: 1,
        [USERS_FIELDS.user_specs.workoutCount]: 1,
        [USERS_FIELDS.user_specs.fitnessLevel]: 1,
        [USERS_FIELDS.user_specs.weight]: 1,
        [USERS_FIELDS.user_specs.weightGoal]: 1,
        [USERS_FIELDS.user_specs.preferences]: 1,
        [USERS_FIELDS.users.profilePicture]: 1,
        [USERS_FIELDS.users.userRole]: 1,
        [USERS_FIELDS.contributors.contributorId]: 1,
      },
      id: this.profileUserId || null,
    };

    this.userService.getDetail(queryParams).subscribe({
      next: (res: IRequestResult<IUserDetails> | null) => {
        if (!res?.data) {
          this.router.navigate(['/']); //TODO: Show not found page.
        }
        if (
          this.visitorRole === UserRoles.User &&
          res?.data.userRole === UserRoles.User
        ) {
          this.router.navigate(['/']); //TODO: Show not found page.
        }
        if (res?.data.userRole === UserRoles.Coach) {
          this.fetchContributorWorkouts(res?.data.contributorId as number);
        } else if (res?.data.userRole === UserRoles.User) {
          this.fetchUserRelatedWorkouts(this.profileUserId as number);
        }
        this.profileContributorId = res?.data.contributorId;
        this.user = res?.data;
      },
      error: (err) => {
        console.log('Could not find user');
      },
    });
  }

  private fetchPrivateProfileUser(userId: number): void {
    const queryParams: IQueryParams = {
      what: {
        [USERS_FIELDS.users.firstName]: 1,
        [USERS_FIELDS.users.lastName]: 1,
        [USERS_FIELDS.user_specs.BMI]: 1,
        [USERS_FIELDS.user_specs.workoutCount]: 1,
        [USERS_FIELDS.user_specs.fitnessLevel]: 1,
        [USERS_FIELDS.user_specs.weight]: 1,
        [USERS_FIELDS.user_specs.weightGoal]: 1,
        [USERS_FIELDS.user_specs.preferences]: 1,
        [USERS_FIELDS.users.profilePicture]: 1,
        [USERS_FIELDS.user_specs.birthDate]: 1,
        [USERS_FIELDS.users.email]: 1,
      },
      id: userId,
    };

    this.userService.getDetail(queryParams).subscribe({
      next: (res: IRequestResult<IUserDetails> | null) => {
        if (!res?.data) {
          this.router.navigate(['/']);
        }
        this.user = res?.data;
        console.log(this.user);
      },
      error: (err) => {
        console.log('Could not find user');
      },
    });
  }

  private fetchContributorWorkouts(contributorId: number): void {
    const queryParams: IQueryParams = {
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
            value: contributorId,
          },
          {
            field: 'private',
            operation: 'EQ',
            value: 0,
          },
        ],
      },
      order: [
        {
          field: 'rating',
          direction: 'DESC',
        },
      ],
    };

    this.workoutService.getWorkouts(queryParams).subscribe({
      next: (res: IRequestResult<IWorkout[]> | null) => {
        console.log(res?.data);
        this.workouts = res?.data ?? [];
      },
      error: (err) => {
        console.log(err);
      },
    });
  }

  private fetchUserRelatedWorkouts(userId: number) {
    const queryParams: IQueryParams = {
      what: {
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
            field: 'relatedStudent',
            operation: 'EQ',
            value: userId,
          },
        ],
      },
      order: [
        {
          field: 'rating',
          direction: 'DESC',
        },
      ],
    };

    this.workoutService.getWorkouts(queryParams).subscribe({
      next: (res: IRequestResult<IWorkout[]> | null) => {
        console.log(res?.data);
        this.workouts = res?.data ?? [];
      },
      error: (err) => {
        console.log(err);
      },
    });
  }
}
