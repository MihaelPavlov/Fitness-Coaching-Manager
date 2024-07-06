import { Component, OnInit } from '@angular/core';
import { IQueryParams } from '../../../entities/models/query-params.interface';
import { UserService } from '../../../entities/users/services/user.service';
import { IRequestResult } from '../../../entities/models/request-result.interface';
import { IPublicUserDetails } from '../../../entities/users/models/user-details.interface';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
})
export class ProfileComponent implements OnInit {
  profileState: 'public' | 'private' = 'public';

  public user: any;

  constructor(private userService: UserService) {}

  public ngOnInit(): void {
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
      id: 1
    }

    this.userService.getDetail(queryParams).subscribe((res: IRequestResult<IPublicUserDetails[]> | null) => {
      console.log(res?.data);
    })
  }
}
