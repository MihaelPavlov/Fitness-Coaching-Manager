import { Component } from '@angular/core';
import { InputType } from '../../../shared/enums/input-types.enum';
import { FormBuilder, Validators } from '@angular/forms';
import { UserService } from '../../../services/user.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  public InputType = InputType;

  protected passwordType: InputType = InputType.Password;

  protected loginForm = this.fb.group({
    email: ['', Validators.required],
    password: ['', Validators.required]
  });

  protected hasLoginError: boolean = false;
  protected isPasswordShown: boolean = false;

  constructor(private readonly fb: FormBuilder, private readonly userService: UserService, private readonly router: Router) {}

  protected onValueChange(name: string, value: string): void {
    this.loginForm.get(name)?.setValue(value);
  }

  protected togglePasswordShow(): void {
    this.isPasswordShown = !this.isPasswordShown;
    if (this.isPasswordShown === true) {
      this.passwordType = InputType.Text;
      return;
    };
    this.passwordType = InputType.Password
  }

  protected login(): void {
    if (this.loginForm.invalid) {
      this.hasLoginError = true;
      return;
    }

    this.userService
        .login(
          this.loginForm.value.email,
          this.loginForm.value.password
        )
        .subscribe({
          next: () => {
            this.hasLoginError = false;
            this.router.navigate(['/']);
          },
          error: () => {
            this.hasLoginError = true;
          }
        })
  }
}
