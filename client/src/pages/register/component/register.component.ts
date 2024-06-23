import { Component, OnInit } from '@angular/core';
import { InputType } from '../../../shared/enums/input-types.enum';
import { optionArrays } from '../../../shared/option-arrays';
import { ActivatedRoute, Router } from '@angular/router';
import { RegistrationType } from '../../../shared/enums/registration-type.enum';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
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

  protected hasRegisterError: boolean = false;
  protected registerErrorMsg: string = "";

  protected registerForm = this.fb.group({
    user_role: [this.userRole, [Validators.required]],
    username: ['', [Validators.required]],
    email: ['', [Validators.required, Validators.email]],
    passGroup: this.fb.group(
      {
        password: ['', [Validators.required]],
        rePassword: ['', [Validators.required]],
      },
      {
        validators: [passwordsMatch()],
      }
    ),
    fitness_level: ['Sedentary'],
    country: ['Bulgaria', [Validators.required]],
    sex: ['Male', [Validators.required]],
    language: ['Bulgarian', [Validators.required]],
    first_name: [''],
    last_name: [''],
    phone_number: ['']
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

  public handleInputChange(name: string, value: string): void {
    if (name === 'password' || name === 'rePassword') {
      this.registerForm.get('passGroup')?.get(name)?.setValue(value);
    }
    this.registerForm.get(name)?.setValue(value);
  }

  protected register(): void {
    this.registerForm.get("user_role")?.setValue(this.selectedRegistrationType === RegistrationType.User ? -1 : 1);

    if (this.registerForm.value.user_role === 1) {
      this.registerForm.get("fitness_level")?.setValue(null);

      if (this.registerForm.value.first_name === null || this.registerForm.value.first_name === "") return;
      if (this.registerForm.value.last_name === null || this.registerForm.value.last_name === "") return;
      if (this.registerForm.value.phone_number === null || this.registerForm.value.phone_number === "") return;
    };
    if (this.registerForm.value.user_role === -1) {
      this.registerForm.get("first_name")?.setValue(null);
      this.registerForm.get("last_name")?.setValue(null);
      this.registerForm.get("phone_number")?.setValue(null);

      if (this.registerForm.value.fitness_level === null || this.registerForm.value.fitness_level === "") return;
    }

    if (this.registerForm.invalid) {
      const errors = getFormValidationErrors(this.registerForm);
      this.hasRegisterError = true;
      this.registerErrorMsg = this.validationErrors[errors[0].control]
      return;
    }

    const requestBody = {
      ...this.registerForm.value,
      password: this.registerForm.value.passGroup?.password,
    };

    delete requestBody['passGroup'];

    this.userService.register(requestBody).subscribe({
      next: () => {
        this.hasRegisterError = false;
        this.router.navigate(['/']);
      },
      error: (err) => {
        this.registerErrorMsg = err.error.data.error;
        this.hasRegisterError = true;
      },
    });
  }

  private validationErrors: Record<string, string> = {
    username: "Username is required!",
    email: "Email is required!",
    passGroup: "Passwords must match!",
    password: "Password is required!",
    rePassword: "You must confirm the password!"
  }
}
