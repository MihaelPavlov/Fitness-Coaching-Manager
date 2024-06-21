import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export function passwordsMatch(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const passwordControl = control.get('password');
    const rePasswordControl = control.get('rePassword');

    return passwordControl?.value === rePasswordControl?.value
      ? null
      : { matchPasswordsValidator: true };
  };
}
