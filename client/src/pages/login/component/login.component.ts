import { Component } from '@angular/core';
import { InputType } from '../../../shared/enums/input-types.enum';
import { FormBuilder, Validators } from '@angular/forms';
import { UserService } from '../../../entities/users/services/user.service';
import { Router } from '@angular/router';
import { AuthService } from '../../../entities/users/services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent {
  public InputType = InputType;

  protected passwordType: InputType = InputType.Password;

  protected loginForm = this.fb.group({
    email: ['', [Validators.required]],
    password: ['', [Validators.required]],
  });

  protected isLoading: boolean = false;
  protected hasLoginError: boolean = false;
  protected isPasswordShown: boolean = false;

  constructor(
    private readonly fb: FormBuilder,
    private readonly authService: AuthService,
    private readonly router: Router
  ) {}

  protected togglePasswordShow(): void {
    this.isPasswordShown = !this.isPasswordShown;
    if (this.isPasswordShown === true) {
      this.passwordType = InputType.Text;
      return;
    }
    this.passwordType = InputType.Password;
  }

  public login(): void {
    this.isLoading = true;

    if (this.loginForm.invalid) {
      this.isLoading = false;
      this.hasLoginError = true;
      return;
    }

    this.authService
      .login(
        this.loginForm.value.email as string,
        this.loginForm.value.password as string
      )
      .subscribe({
        next: () => {
          this.isLoading = false;
          this.hasLoginError = false;
          this.router.navigate(['/workout/list']);
        },
        error: () => {
          this.isLoading = false;
          this.hasLoginError = true;
        },
      });
  }
}
