import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { InputType } from '../../../../shared/enums/input-types.enum';
import { IUserDetails } from '../../../../entities/users/models/user-details.interface';
import { AbstractControl, FormBuilder, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { UserService } from '../../../../entities/users/services/user.service';

@Component({
  selector: 'app-profile-form',
  templateUrl: './profile-form.component.html',
  styleUrls: ['./profile-form.component.scss']
})
export class ProfileFormComponent implements OnChanges {
  @Input() user: IUserDetails | undefined;

  constructor(private readonly fb: FormBuilder, private readonly userService: UserService) {}

  public InputType = InputType;

  public hasUpdateError: boolean = false;
  public updateError: string = "";

  public updateUserForm = this.fb.group({
    firstName: ['', [Validators.required]],
    lastName: ['', [Validators.required]],
    birthDate: ['', [Validators.required, this.dateValidator()]],
    email: ['', [Validators.required, Validators.email]],
    weightGoal: ['', [Validators.required]],
    weight: ['', [Validators.required]]
  });

  ngOnChanges(changes: SimpleChanges): void {
      if (changes['user']) {
        for (let [field, value] of Object.entries(this.user as object)) {
          if (field === "birthDate") {
            value = this.formatDateValue(new Date(value));
          }
          this.updateUserForm.get(field)?.setValue(value);
        }
      }
  }

  public onUpdate(): void {
    if (this.updateUserForm.invalid) {
      console.log("Invalid form");
      return;
    }

    this.userService.updateUser(this.updateUserForm.value).subscribe({
      next: (res: any) => {
        this.hasUpdateError = false;
        this.userService.fetchUserInfo();
      },
      error: (err) => {
        this.hasUpdateError = true;
        this.updateError = err.error.data[0].message;
      }
    })
  }

  private formatDateValue(date: Date): string {
    return `${date.getFullYear()}/${date.getMonth() + 1 > 9 ? date.getMonth() + 1 : '0' + (date.getMonth() + 1)}/${date.getDate() > 9 ? date.getDate() : '0' + date.getDate()}`;
  }

  private dateValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const dateRegex = /[1-9][0-9][0-9]{2}\/([0][1-9]|[1][0-2])\/([1-2][0-9]|[0][1-9]|[3][0-1])/gm;

      return dateRegex.test(control?.value) ? null : { invalidDate: true }
    }
  }
}
