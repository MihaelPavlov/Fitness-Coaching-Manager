import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { InputType } from '../../../../shared/enums/input-types.enum';
import { IUserDetails } from '../../../../entities/users/models/user-details.interface';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { UserService } from '../../../../entities/users/services/user.service';
import { Router } from '@angular/router';
import { toFormData } from '../../../../shared/utils/formTransformer';

@Component({
  selector: 'app-profile-form',
  templateUrl: './profile-form.component.html',
  styleUrls: ['./profile-form.component.scss'],
})
export class ProfileFormComponent implements OnChanges {
  @Input() user: IUserDetails | undefined;
  @Input() profilePictureFile: File | undefined | null;

  public InputType = InputType;
  public isLoading: boolean = false;
  public hasUpdateError: boolean = false;
  public updateError: string = '';

  constructor(
    private readonly fb: FormBuilder,
    private readonly userService: UserService,
    private readonly router: Router
  ) {}

  public updateUserForm = this.fb.group({
    firstName: ['', [Validators.required]],
    lastName: ['', [Validators.required]],
    birthDate: [null],
    email: ['', [Validators.required, Validators.email]],
    weightGoal: [0],
    weight: [0],
    profilePicture: [null]
  });

  public ngOnChanges(changes: SimpleChanges): void {
    if (changes['user']) {
      this.updateFormValues(this.user);
    }
    if (changes['profilePictureFile']) {
      this.updateProfilePictureFile(this.profilePictureFile);
    }
  }

  public onUpdate(): void {
    if (this.updateUserForm.invalid) {
      return;
    }
    this.isLoading = true;

    this.userService.updateUser(toFormData(this.updateUserForm.value)).subscribe({
      next: () => {
        this.hasUpdateError = false;
        this.userService.fetchUserInfo();
        this.isLoading = false;
      },
      error: (err) => {
        this.isLoading = false;
        if (err.status === 401) {
          this.router.navigate(['/login']);
        }
        this.hasUpdateError = true;
        this.updateError = err.error.data.message;
      },
    });
  }

  private updateFormValues(user: any): void {
    Object.entries(user).forEach(([field, value]) => {
      if (this.updateUserForm.get(field)) {
        this.updateUserForm.get(field)?.setValue(value);
      }
    });
  }

  private updateProfilePictureFile(profilePicture: File | undefined | null) {
    const selectedFile = this.updateUserForm.get('profilePicture') as FormControl;
    selectedFile.setValue(profilePicture);
  }
}
