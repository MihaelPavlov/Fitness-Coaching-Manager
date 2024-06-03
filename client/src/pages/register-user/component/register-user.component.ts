import { Component } from '@angular/core';
import { InputType } from '../../../shared/enums/input-types.enum';

@Component({
  selector: 'app-register-user',
  templateUrl: './register-user.component.html',
  styleUrl: './register-user.component.scss'
})
export class RegisterUserComponent {
  public InputType = InputType;

  showGeneralDetails = true;

  showAdditionalDetails = false;

  generalDetailsVisibility() {
    this.showGeneralDetails = !this.showGeneralDetails
  }

  additionalDetailsVisibility() {
    this.showAdditionalDetails = !this.showAdditionalDetails
  }

}
