import { Component, } from '@angular/core';
import { InputType } from '../../../shared/enums/input-types.enum';
import { optionArrays } from '../../../shared/option-arrays';
import { ActivatedRoute } from '@angular/router';
import { RegistrationType } from '../../../shared/enums/registration-type.enum';
// import { registeringAsTrainer } from '../../landing/component/landing.component';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss'
})
export class RegisterComponent {
  public RegistrationType = RegistrationType
  public InputType = InputType;

  optionArrays = optionArrays;
  public selectedRegistrationType!: RegistrationType

  isRegisteringAsTrainer = false

  constructor(private route: ActivatedRoute) {    
    const { registrationType } = route.snapshot.params
    this.selectedRegistrationType = registrationType    
  }


  showGeneralDetails = false;

  showAdditionalDetails = false;

  showProofOfRightsDetails = false;

  showDropDownMenu = false;

  attachDocument = false;

  attachLink = false;

  generalDetailsVisibility() {
    this.showGeneralDetails = !this.showGeneralDetails
    this.showAdditionalDetails = false;
    this.showProofOfRightsDetails = false
  }

  additionalDetailsVisibility() {
    this.showAdditionalDetails = !this.showAdditionalDetails
    this.showGeneralDetails = false
    this.showProofOfRightsDetails = false
  }

  proofOfRightsDetailsVisibility() {
    this.showProofOfRightsDetails = !this.showProofOfRightsDetails
    this.showGeneralDetails = false;
    this.showAdditionalDetails = false;
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
