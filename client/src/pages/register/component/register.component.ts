import { Component, OnInit } from '@angular/core';
import { InputType } from '../../../shared/enums/input-types.enum';
import { optionArrays } from '../../../shared/option-arrays';
import { ActivatedRoute } from '@angular/router';
import { RegistrationType } from '../../../shared/enums/registration-type.enum';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss',
})
export class RegisterComponent implements OnInit {
  public RegistrationType = RegistrationType;
  public InputType = InputType;
  public optionArrays = optionArrays;
  public selectedRegistrationType!: RegistrationType;
  public isRegisteringAsTrainer = false;
  public showGeneralDetails = false;
  public showAdditionalDetails = false;
  public showProofOfRightsDetails = false;
  public showDropDownMenu = false;
  public attachDocument = false;
  public attachLink = false;
  public formData: any = {};

  constructor(private route: ActivatedRoute) {}
  
  public ngOnInit(): void {
    this.route.params.subscribe((params) => {
      this.selectedRegistrationType = params['registrationType'];
    });
  }

  public generalDetailsVisibility(): void {
    this.showGeneralDetails = !this.showGeneralDetails;
    this.showAdditionalDetails = false;
    this.showProofOfRightsDetails = false;
  }

  public additionalDetailsVisibility(): void {
    this.showAdditionalDetails = !this.showAdditionalDetails;
    this.showGeneralDetails = false;
    this.showProofOfRightsDetails = false;
  }

  public proofOfRightsDetailsVisibility(): void {
    this.showProofOfRightsDetails = !this.showProofOfRightsDetails;
    this.showGeneralDetails = false;
    this.showAdditionalDetails = false;
  }

  public toggleDropDownMenu(): void {
    this.showDropDownMenu = !this.showDropDownMenu;
  }

  public handleInputChange(name: string, value: string): void {
    this.formData[name] = value;
  }

  public submitHandler(): void {
    console.log(this.formData);
  }
}
