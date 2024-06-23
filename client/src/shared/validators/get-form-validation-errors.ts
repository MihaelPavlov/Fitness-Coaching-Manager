import { FormGroup, ValidationErrors } from '@angular/forms';

export function getFormValidationErrors(form: FormGroup) {

  const result: any = [];
  Object.keys(form.controls).forEach(key => {
    const controlErrors: ValidationErrors | null | undefined = form?.get(key)?.errors;

    if(key === "passGroup") {
      const passGroup = form.get("passGroup") as FormGroup;

      Object.keys(passGroup.controls).forEach(passKey => {
        const passControlErrors: ValidationErrors | null | undefined = passGroup?.get(passKey)?.errors;

        if (passControlErrors) {
          Object.keys(passControlErrors).forEach(keyError => {
            result.push({
              'control': passKey,
              'error': keyError,
              'value': passControlErrors[keyError]
            });
          });
        }
      });
    }

    if (controlErrors) {
      Object.keys(controlErrors).forEach(keyError => {
        result.push({
          'control': key,
          'error': keyError,
          'value': controlErrors[keyError]
        });
      });
    }
  });

  return result;
}
