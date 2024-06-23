import { Component } from '@angular/core';
import { InputType } from '../../../../shared/enums/input-types.enum';
import { UserService } from '../../../../entities/services/user.service';
import { UserData } from '../userType';

@Component({
  selector: 'app-profile-form',
  templateUrl: './profile-form.component.html',
  styleUrls: ['./profile-form.component.scss']
})

export class ProfileFormComponent {
  public InputType = InputType;

  public userData!: UserData;

  constructor(private readonly userService: UserService) {}

  ngOnInit() {
    this.userService.getDetails({}).subscribe(userData => {
      this.userData = userData.data.user[0];
      console.log(this.userData);
    })
  }
}