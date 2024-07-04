import { Component } from '@angular/core';
import { InputType } from '../../../../shared/enums/input-types.enum';
import { UserService } from '../../../../entities/services/user.service';
import { IUserData } from '../user-type/userType';
import { FormBuilder } from '@angular/forms';

@Component({
  selector: 'app-profile-form',
  templateUrl: './profile-form.component.html',
  styleUrls: ['./profile-form.component.scss'],
})

export class ProfileFormComponent {
  public InputType = InputType;
  public userData!: IUserData;

  constructor(
    private readonly userService: UserService,
    private fb: FormBuilder) {}

    editForm = this.fb.group({
      firstName: ['', []],
      lastName: [''],
      email: [''],
      dateOfBirth: [''],
      weightGoal: [''],
      weight: ['']
    })

  ngOnInit() {
    this.userService.getDetail().subscribe(userData => {
      this.userData = userData.data.user[0];
    })
  }


  handleEdit(): void {
    console.log(this.editForm.value)
  }

  
}