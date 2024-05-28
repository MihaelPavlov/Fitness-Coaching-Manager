import { Component } from '@angular/core';
import { InputType } from '../../../../shared/enums/input-types.enum';

@Component({
  selector: 'app-profile-form',
  templateUrl: './profile-form.component.html',
  styleUrls: ['./profile-form.component.scss']
})
export class ProfileFormComponent {
  public InputType = InputType;
}