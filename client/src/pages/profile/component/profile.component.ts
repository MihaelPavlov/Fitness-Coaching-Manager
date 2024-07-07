import { Component, OnInit } from '@angular/core';
import { IQueryParams } from '../../../entities/models/query-params.interface';
import { UserService } from '../../../entities/users/services/user.service';
import { IRequestResult } from '../../../entities/models/request-result.interface';
import { IPublicUserDetails } from '../../../entities/users/models/user-details.interface';
import { ActivatedRoute, Router } from '@angular/router';
import { USERS_FIELDS } from '../../../entities/users/models/fields/users-fields.constant';
import { catchError, map, tap } from 'rxjs';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
})
export class ProfileComponent implements OnInit {
  profileState: 'public' | 'private' = 'public';

  public user: IPublicUserDetails | undefined;
  public profileUserId?: number;
  protected isAuth: boolean = false;
  protected isSubscribed: boolean = false;

  constructor(
    private readonly userService: UserService,
    private readonly route: ActivatedRoute,
    private readonly router: Router
  ) {}

  public ngOnInit(): void {
    this.route.params.subscribe((params) => {
      this.profileUserId = params['userId'];

      this.userService.fetchUserInfo$().subscribe({
        next: (res: any) => {
          this.isAuth = true;
          if (!params['userId'] || res.data.id == params['userId']) {
            // Same user trying to access his public profile - not allowed
            // Do different builder request for private
            this.fetchPrivateProfileUser();
            // Set profile state to private
            this.profileState = 'private';
          }
          // Logged-in user see other profile
          this.fetchPublicProfileUser(params);
        },
        error: (err) => {
          // Display public profile
          this.fetchPublicProfileUser(params);
        },
      });

      this.userService.hasUserSubscribedToContributor(params['userId']).subscribe({
        next: (res: any) => {
          this.isSubscribed = res?.data?.hasSubscribed;
        },
        error: err => {
          console.log(err)
        }
      })
    });
  }

  public onSubscribe(): void {
    if (!this.isAuth) {
      this.router.navigate(['/login']);
    }

    this.userService.subscribeToContributor(this.profileUserId as number).subscribe({
      next: (res: any) => {
        this.isSubscribed = true;
      },
      error: err => {
        console.log(err);
      }
    });
  }

  public onUnsubscribe(): void {
    this.userService.unsubscribeToContributor(this.profileUserId as number).subscribe({
      next: (res: any) => {
        this.isSubscribed = false;
      },
      error: err => {
        console.log(err);
      }
    });
  }

  private fetchPublicProfileUser(params: any): void {
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
      },
      id: params['userId'] || null,
    };

    this.userService.getDetail(queryParams).subscribe({
      next: (res: IRequestResult<IPublicUserDetails> | null) => {
        console.log(res?.data);
        this.user = res?.data;
      },
      error: (err) => {
        console.log('Could not find user');
      },
    });
  }

  private fetchPrivateProfileUser(): void {} // Must be done from other PR
}
