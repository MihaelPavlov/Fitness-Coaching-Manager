import { Component, OnInit } from '@angular/core';
import { IQueryParams } from '../../../entities/models/query-params.interface';
import { UserService } from '../../../entities/users/services/user.service';
import { IRequestResult } from '../../../entities/models/request-result.interface';
import { IPublicUserDetails } from '../../../entities/users/models/user-details.interface';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
})
export class ProfileComponent implements OnInit {
  profileState: 'public' | 'private' = 'public';

  public user: any;

  public userInfo$: Observable<any> = this.userService.userInfo$;
  public isAuth$ = this.userService.isAuth$;

  constructor(private readonly userService: UserService, private readonly route: ActivatedRoute) {}

  public ngOnInit(): void {
    this.route.params.subscribe((params) => {
      this.userService.fetchUserForProfile().subscribe(
        res => {
          if (!params["userId"] || res.data.id == params["userId"]) { // Same user trying to access his public profile
            // Do different builder request for private
            this.fetchPrivateProfileUser();
            // Set profile state to private
            this.profileState = 'private';
          }
          // Logged-in user see other profile
        },
        err => {
          console.log("Unauthenticated.");
          // Display public profile
        }
      );
    })
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
        preferences: 1
      },
      id: params['userId'] || null
    }

    this.userService.getDetail(queryParams).subscribe((res: IRequestResult<IPublicUserDetails[]> | null) => {
      console.log(res?.data);
    });
  }

  private fetchPrivateProfileUser(): void {}
}


/*
const queryParams: IQueryParams = {
            what: {
              firstName: 1,
              lastName: 1,
              BMI: 1,
              workoutCount: 1,
              fitnessLevel: 1,
              weight: 1,
              weightGoal: 1,
              preferences: 1
            },
            id: params['userId'] || null
          }

          this.userService.getDetail(queryParams).subscribe((res: IRequestResult<IPublicUserDetails[]> | null) => {
            console.log(res?.data);
          })
*/
