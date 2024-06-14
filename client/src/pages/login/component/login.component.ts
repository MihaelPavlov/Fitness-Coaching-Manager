import { Component, ViewChild } from '@angular/core';
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

  passwordType: InputType = InputType.Password;

  loginForm = this.fb.group({
    email: ['', Validators.required],
    password: ['', Validators.required]
  });

  hasLoginError: boolean = false;
  isPasswordShown: boolean = false;

  constructor(private fb: FormBuilder, private userService: UserService, private router: Router) {}

  onValueChange(name: string, value: string) {
    this.loginForm.get(name)?.setValue(value);
  }

  togglePasswordShow() {
    this.isPasswordShown = !this.isPasswordShown;
    if (this.isPasswordShown === true) {
      this.passwordType = InputType.Text;
      return;
    };
    this.passwordType = InputType.Password
  }

  login(): void {
    if (this.loginForm.invalid) {
      this.hasLoginError = true;
      return;
    }

    this.userService
        .login(
          this.loginForm.value.email || "",
          this.loginForm.value.password || ""
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
