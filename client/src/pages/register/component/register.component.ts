import { Component, } from '@angular/core';
import { InputType } from '../../../shared/enums/input-types.enum';
import { optionArrays } from '../../../shared/option-arrays';
import { registeringAsTrainer } from '../../landing/component/landing.component';

@Component({
  selector: 'app-register-user',
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss'
})
export class RegisterUserComponent {
  public InputType = InputType;

  isRegisteringAsTrainer!: boolean

  optionArrays = optionArrays;

  constructor() {
    this.isRegisteringAsTrainer = registeringAsTrainer
  }


  showGeneralDetails = true;

  showAdditionalDetails = false;

  showProofOfRightsDetails = false;

  showDropDownMenu = false;

  attachDocument = false;

  attachLink = false;

  generalDetailsVisibility() {
    this.showGeneralDetails = !this.showGeneralDetails
  }

  additionalDetailsVisibility() {
    this.showAdditionalDetails = !this.showAdditionalDetails
  }

  proofOfRightsDetailsVisibility() {
    this.showProofOfRightsDetails = !this.showProofOfRightsDetails
  }

  toggleDropDownMenu() {
    this.showDropDownMenu = !this.showDropDownMenu
  }


  formData: any = {};

  handleInputChange(name: string, value: string) {
    this.formData[name] = value;
  }

  submitHandler() {
    console.log(this.formData);
  }



}
