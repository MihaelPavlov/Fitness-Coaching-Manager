import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { InputType } from '../../../../shared/enums/input-types.enum';
import { IUserDetails } from '../../../../entities/users/models/user-details.interface';
import { AbstractControl, FormBuilder, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { UserService } from '../../../../entities/users/services/user.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-profile-form',
  templateUrl: './profile-form.component.html',
  styleUrls: ['./profile-form.component.scss']
})
export class ProfileFormComponent implements OnChanges {
  @Input() user: IUserDetails | undefined;

  constructor(private readonly fb: FormBuilder, private readonly userService: UserService, private readonly router: Router) {}

  public InputType = InputType;

  public isLoading: boolean = false;
  public hasUpdateError: boolean = false;
  public updateError: string = "";

  public updateUserForm = this.fb.group({
    firstName: ['', [Validators.required]],
    lastName: ['', [Validators.required]],
    birthDate: ['', [Validators.required]],
    email: ['', [Validators.required, Validators.email]],
    weightGoal: ['', [Validators.required]],
    weight: ['', [Validators.required]]
  });

  ngOnChanges(changes: SimpleChanges): void {
      if (changes['user']) {
        for (let [field, value] of Object.entries(this.user as object)) {
          this.updateUserForm.get(field)?.setValue(value);
        }
      }
  }

  public onUpdate(): void {
    if (this.updateUserForm.invalid) {
      return;
    }
    this.isLoading = true;

    this.userService.updateUser(this.updateUserForm.value).subscribe({
      next: () => {
        this.hasUpdateError = false;
        this.userService.fetchUserInfo();
        this.isLoading = false;
      },
      error: (err) => {
        if (err.status === 401) {
          this.isLoading = false;
          this.router.navigate(['/login']);
        }
        this.hasUpdateError = true;
        this.updateError = err.error.data[0].message;
        this.isLoading = false;
      }
    })
  }
}
