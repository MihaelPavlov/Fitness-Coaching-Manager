import { Component, Input } from '@angular/core';
import { InputType } from '../../../../shared/enums/input-types.enum';
import { IUserDetails } from '../../../../entities/users/models/user-details.interface';
import { FormBuilder, Validators } from '@angular/forms';
@Component({
  selector: 'app-profile-form',
  templateUrl: './profile-form.component.html',
  styleUrls: ['./profile-form.component.scss']
})
export class ProfileFormComponent {
  @Input() user: IUserDetails | undefined;

  constructor(private readonly fb: FormBuilder) {}

  public InputType = InputType;

  public updateUserForm = this.fb.group({
    firstName: ['', [Validators.required]],
    lastName: ['', [Validators.required]],
    birthDate: ['', [Validators.required]],
    email: ['', [Validators.required, Validators.email]],
    weightGoal: ['', [Validators.required]],
    weight: ['', [Validators.required]]
  });
}
