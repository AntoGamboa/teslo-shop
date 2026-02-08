import { Component, input, signal } from '@angular/core';
import { AbstractControl, ValidationErrors } from '@angular/forms';
import { FormUtils } from '@utils/forms.utils';

@Component({
  selector: 'form-error-label',
  imports: [],
  templateUrl: './form-error-label.html',
})
export class FormErrorLabel {

  Control = input.required<AbstractControl>()
  get Errormessage()
  {
    const errors:ValidationErrors = this.Control().errors || {};
    return this.Control().touched && Object.keys(errors).length > 0
    ? FormUtils.getTextError(errors)
    : null
  }
}
