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

  loginForm = this.fb.group({
    email: ['', Validators.required],
    password: ['', Validators.required]
  });

  hasLoginError: boolean = false;

  constructor(private fb: FormBuilder, private userService: UserService, private router: Router) {}

  onValueChange(name: string, value: string) {
    this.loginForm.get(name)?.setValue(value);
  }

  login(): void {
    if (this.loginForm.invalid) {
      console.log("Invalid form");
      return;
    }

    console.log("Valid form");
  }
}
