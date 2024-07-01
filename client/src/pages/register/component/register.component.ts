import { Component, OnInit } from '@angular/core';
import { InputType } from '../../../shared/enums/input-types.enum';
import { optionArrays } from '../../../shared/option-arrays';
import { ActivatedRoute, Router } from '@angular/router';
import { RegistrationType } from '../../../shared/enums/registration-type.enum';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { passwordsMatch } from '../../../shared/validators/passwords-match';
import { UserService } from '../../../entities/services/user.service';
import { getFormValidationErrors } from '../../../shared/validators/get-form-validation-errors';

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

  protected isLoading: boolean = false;
  protected hasRegisterError: boolean = false;
  protected registerErrorMsg: string = "";

  protected registerForm = new FormGroup({
    user_role: new FormControl(this.userRole, [Validators.required]),
    username: new FormControl('', [Validators.required]),
    email: new FormControl('', [Validators.required, Validators.email]),
    passGroup: new FormGroup(
      {
        password: new FormControl('', [Validators.required]),
        rePassword: new FormControl('', [Validators.required]),
      },
      {
        validators: [passwordsMatch()],
      }
    ),
    fitness_level: new FormControl('Sedentary', [Validators.required]),
    country: new FormControl('Bulgaria', [Validators.required]),
    sex: new FormControl('Male', [Validators.required]),
    language: new FormControl('Bulgarian', [Validators.required]),
    first_name: new FormControl('', [Validators.required]),
    last_name: new FormControl('', [Validators.required]),
    phone_number: new FormControl('', [Validators.required])
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

  protected register(): void {
    this.isLoading = true;
    this.registerForm.get("user_role")?.setValue(this.selectedRegistrationType === RegistrationType.User ? -1 : 1);

    this.updateFormValidators();

    if (this.registerForm.invalid) {
      this.isLoading = false;
      return;
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
      user: ["fitness_level"],
      coach: ["first_name", "last_name", "phone_number"]
    }

    if (this.registerForm.value.user_role === 1) {
      this.registerForm.get("fitness_level")?.setValue(null);
      this.addValidators(role_controls.coach);
      this.removeValidators(role_controls.user);
    };
    if (this.registerForm.value.user_role === -1) {
      this.addValidators(role_controls.user);
      this.removeValidators(role_controls.coach);
    }
  }

  private addValidators(controls: string[]): void {
    controls.forEach(control => {
      this.registerForm.get(control)?.setValidators([Validators.required]);
      this.registerForm.get(control)?.updateValueAndValidity();
    });
  }

  private removeValidators(controls: string[]): void {
    controls.forEach(control => {
      this.registerForm.get(control)?.clearValidators();
      this.registerForm.get(control)?.updateValueAndValidity();
    });
  }
}
