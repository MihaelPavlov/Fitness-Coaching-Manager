import { Component, OnInit } from '@angular/core';
import { InputType } from '../../../shared/enums/input-types.enum';
import { optionArrays } from '../../../shared/option-arrays';
import { ActivatedRoute, Router } from '@angular/router';
import { RegistrationType } from '../../../shared/enums/registration-type.enum';
import {
  AbstractControl,
  FormBuilder,
  ValidationErrors,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { UserService } from '../../../entities/users/services/user.service';
import { UserRoles } from '../../../shared/enums/user-roles.enum';
import { GenderType } from '../../../shared/enums/gender-list.enum';
import { FitnessLevels } from '../../../shared/enums/fitness-levels.enum';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss',
})
export class RegisterComponent implements OnInit {
  public RegistrationType = RegistrationType;
  public InputType = InputType;
  public optionArrays = optionArrays;
  public GenderType = GenderType;
  public FitnessLevels = FitnessLevels;
  public selectedRegistrationType!: RegistrationType;
  public isRegisteringAsTrainer = false;
  public showGeneralDetails = false;
  public showAdditionalDetails = false;
  public showProofOfRightsDetails = false;
  public showDropDownMenu = false;
  public attachDocument = false;
  public attachLink = false;

  private userRole!: number;

  protected isLoading: boolean = false;
  protected hasRegisterError: boolean = false;
  protected registerErrorMsg: string = '';

  protected registerForm = this.fb.group({
    userRole: [this.userRole, [Validators.required]],
    username: ['', [Validators.required]],
    email: ['', [Validators.required, Validators.email]],
    passGroup: this.fb.group(
      {
        password: ['', [Validators.required]],
        rePassword: ['', [Validators.required]],
      },
      {
        validators: [this.passwordsMatch()],
      }
    ),
    fitnessLevel: [optionArrays.fitnessLevel[0], [Validators.required]],
    country: [optionArrays.countryList[0], [Validators.required]],
    sex: [optionArrays.genderList[0], [Validators.required]],
    language: [optionArrays.preferredLanguage[0], [Validators.required]],
    firstName: ['', [Validators.required]],
    lastName: ['', [Validators.required]],
    phoneNumber: ['', [Validators.required]],
  });

  constructor(
    private readonly route: ActivatedRoute,
    private readonly fb: FormBuilder,
    private readonly userService: UserService,
    private readonly router: Router
  ) {}

  public ngOnInit(): void {
    this.route.params.subscribe((params) => {
      this.selectedRegistrationType = params['registrationType'];
      this.registerForm
        .get('userRole')
        ?.setValue(
          this.selectedRegistrationType === RegistrationType.User
            ? UserRoles.User
            : UserRoles.Coach
        );
      this.updateFormValidators();
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

  public isDisabled(): boolean {
    return this.registerForm.invalid;
  }

  public register(): void {
    this.isLoading = true;

    if (this.registerForm.invalid) {
      console.log(this.registerForm.value);
      this.isLoading = false;
      return;
    }

    if (this.registerForm.get('sex')?.value === GenderType.None) {
      this.registerForm.get('sex')?.setValue('None');
    }

    const requestBody = {
      ...this.registerForm.value,
      password: this.registerForm.value.passGroup?.password,
    };

    delete requestBody['passGroup'];

    this.userService.register(requestBody).subscribe({
      next: () => {
        this.isLoading = false;
        this.hasRegisterError = false;
        this.router.navigate(['/']);
      },
      error: (err) => {
        this.isLoading = false;
        this.registerErrorMsg = err.error.data.error;
        this.hasRegisterError = true;
      },
    });
  }

  private updateFormValidators(): void {
    const role_controls = {
      user: ['fitnessLevel'],
      coach: ['firstName', 'lastName', 'phoneNumber'],
    };

    if (this.registerForm.value.userRole === UserRoles.Coach) {
      this.registerForm.get('fitnessLevel')?.setValue(null);
      this.addValidators(role_controls.coach);
      this.removeValidators(role_controls.user);
    }
    if (this.registerForm.value.userRole === UserRoles.User) {
      this.addValidators(role_controls.user);
      this.removeValidators(role_controls.coach);
    }
  }

  private addValidators(controls: string[]): void {
    controls.forEach((control) => {
      this.registerForm.get(control)?.setValidators([Validators.required]);
      this.registerForm.get(control)?.updateValueAndValidity();
    });
  }

  private removeValidators(controls: string[]): void {
    controls.forEach((control) => {
      this.registerForm.get(control)?.clearValidators();
      this.registerForm.get(control)?.updateValueAndValidity();
    });
  }

  private passwordsMatch(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const passwordControl = control.get('password');
      const rePasswordControl = control.get('rePassword');

      return passwordControl?.value === rePasswordControl?.value
        ? null
        : { matchPasswordsValidator: true };
    };
  }
}
