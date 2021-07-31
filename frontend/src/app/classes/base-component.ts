import { FormGroup } from '@angular/forms';
import { ServerErrors } from './server-errors';

export class BaseComponent {
  displayErrors(errors: ServerErrors, form: FormGroup): void {
    form.markAllAsTouched();
    Object.keys(errors).map(
      (key: string) => form.controls[key].setErrors({ invalid: true })
    );
  }
}
