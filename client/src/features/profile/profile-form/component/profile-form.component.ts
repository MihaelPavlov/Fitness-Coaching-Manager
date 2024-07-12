import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { InputType } from '../../../../shared/enums/input-types.enum';
import { IUserDetails } from '../../../../entities/users/models/user-details.interface';
import { FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-profile-form',
  templateUrl: './profile-form.component.html',
  styleUrls: ['./profile-form.component.scss']
})
export class ProfileFormComponent implements OnChanges {
  @Input() user: IUserDetails | undefined;

  constructor(private readonly fb: FormBuilder) {}

  public InputType = InputType;

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
  }

  private formatDateValue(date: Date): string {
    return `${date.getFullYear()}/${date.getMonth() + 1 > 9 ? date.getMonth() + 1 : '0' + (date.getMonth() + 1)}/${date.getDate() > 9 ? date.getDate() : '0' + date.getDate()}`;
  }
}
