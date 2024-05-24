import { Component } from '@angular/core';
import { InputType } from '../../../shared/enums/input-types.enum';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent {
  public InputType = InputType;
}