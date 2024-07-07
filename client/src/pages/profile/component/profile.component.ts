import { Component, OnInit } from '@angular/core';
import { IQueryParams } from '../../../entities/models/query-params.interface';
import { UserService } from '../../../entities/users/services/user.service';
import { IRequestResult } from '../../../entities/models/request-result.interface';
import { IPublicUserDetails } from '../../../entities/users/models/user-details.interface';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
})
export class ProfileComponent implements OnInit {
  profileState: 'public' | 'private' = 'public';

  public user: IPublicUserDetails | undefined;
  protected isAuth: boolean = false;
  protected isSubscribed: boolean = false;

  constructor(private readonly userService: UserService, private readonly route: ActivatedRoute, private readonly router: Router) {}

  public ngOnInit(): void {
    this.route.params.subscribe((params) => {
      this.userService.fetchUserForProfile().subscribe({
        next: (res: any) => {
          this.isAuth = true;
          if (!params["userId"] || res.data.id == params["userId"]) { // Same user trying to access his public profile - not allowed
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
        }
      });
    })
  }

  public onSubscribe(): void {
    if(!this.isAuth) {
      this.router.navigate(['/login']);
    }
  }

  public onUnsubscribe(): void {

  }

  private fetchPublicProfileUser(params: any): void {
    const queryParams: IQueryParams = {
      what: {
        firstName: 1,
        lastName: 1,
        BMI: 1,
        workoutCount: 1,
        fitnessLevel: 1,
        weight: 1,
        weightGoal: 1,
        preferences: 1,
        profilePicture: 1
      },
      id: params['userId'] || null
    }

    this.userService.getDetail(queryParams).subscribe({
      next: (res: IRequestResult<IPublicUserDetails> | null) => {
        console.log(res?.data);
        this.user = res?.data;
      },
      error: (err) => {
        console.log("Could not find user");
      }
    });
  }

  private fetchPrivateProfileUser(): void {} // Must be done from other PR
}

