import { Component, OnInit } from '@angular/core';
import { InputType } from '../../../shared/enums/input-types.enum';
import { optionArrays } from '../../../shared/option-arrays';
import { ActivatedRoute } from '@angular/router';
import { RegistrationType } from '../../../shared/enums/registration-type.enum';
import { FormBuilder, Validators } from '@angular/forms';
import { passwordsMatch } from '../../../shared/validators/passwords-match';
import { UserService } from '../../../entities/services/user.service';

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

  private userRole: number = -1;

  protected registerForm = this.fb.group({
    user_role: [this.userRole, [Validators.required]],
    username: ['', [Validators.required]],
    email: ['', [Validators.required, Validators.email]],
    passGroup: this.fb.group({
      password: ['', [Validators.required]],
      rePassword: ['', [Validators.required]],
    }, {
      validators: [passwordsMatch()]
    }),
    fitness_level: ['Sedentary', [Validators.required]],
    country: ['Bulgaria', [Validators.required]],
    sex: ['Male', [Validators.required]],
    languages: ['Bulgarian', [Validators.required]]
  });

  constructor(private readonly route: ActivatedRoute, private readonly fb: FormBuilder, private readonly userService: UserService) {}

  public ngOnInit(): void {
    this.route.params.subscribe((params) => {
      this.selectedRegistrationType = params['registrationType'];
    });
  }

  public generalDetailsVisibility(): void {
    this.showGeneralDetails = !this.showGeneralDetails;
  }

  public additionalDetailsVisibility(): void {
    this.showAdditionalDetails = !this.showAdditionalDetails;
  }

  public proofOfRightsDetailsVisibility(): void {
    this.showProofOfRightsDetails = !this.showProofOfRightsDetails;
  }

  public toggleDropDownMenu(): void {
    this.showDropDownMenu = !this.showDropDownMenu;
  }

  public handleInputChange(name: string, value: string): void {
    if (name === "password" || name === "rePassword") {
      this.registerForm.get("passGroup")?.get(name)?.setValue(value);
    }
    this.registerForm.get(name)?.setValue(value);
  }

  public register(): void {
    this.registerForm.value.user_role = this.selectedRegistrationType === RegistrationType.User ? -1 : 1;

    if (this.registerForm.invalid) {
      return;
    }

    const requestBody = {
      ...this.registerForm.value,
      password: this.registerForm.value.passGroup?.password
    }

    delete requestBody["passGroup"];

    console.log(requestBody);
  }
}
