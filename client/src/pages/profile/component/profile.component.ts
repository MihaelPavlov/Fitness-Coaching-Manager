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
        lastName: 1
      }
    }

    this.userService.getDetail(queryParams).subscribe((res: IRequestResult<IPublicUserDetails[]> | null) => {
      console.log(res?.data);
    })
  }
}
