import { AbstractControl, FormControl, ValidationErrors, ValidatorFn, Validators } from '@angular/forms'

export class SharedValidators {
  public static get isMultiLineEmails(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      if (control.value === null || control.value === '') {
        return null
      }

      const emails = control.value.split('\n')

      for (var i = 0; i < emails.length; i++) {
        const control = new FormControl(emails[i])
        if (Validators.email(control) !== null) {
          return { emails: { value: control.value } }
        }
      }

      return null
    }
  }

  public static requiredIfValidator(predicateFunc: () => boolean): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      if (predicateFunc()) {
        // here if the control we're looking at **should** have a value
        if (!control.value) {
          // here if the control **doesn't** have a value

          // if we're here this control should have a value so we should return a validation error
          return { required: { value: control.value } }
        }
      }

      return null
    }
  }

  public static requiredTrueIfValidator(predicateFunc: () => boolean): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      if (predicateFunc()) {
        // here if the control we're looking at **should** be true
        if (!control.value || control.value !== true) {
          // here if the control doesn't have a value of it's value isn't true, if we're here this control should
          // be set to true so we should return a validation error
          return { required: { value: control.value } }
        }
      }

      return null
    }
  }

  public static matchValidator(controlName: string, checkControlName: string): ValidatorFn {
    return (controls: AbstractControl): ValidationErrors | null => {
      const control = controls.get(controlName)
      const checkControl = controls.get(checkControlName)

      if (control == null || checkControl == null) {
        return null
      }

      if (checkControl.errors && !checkControl.errors.matching) {
        return null
      }

      if (control.value !== checkControl.value) {
        controls.get(checkControlName)?.setErrors({ match: true })
        return { matching: true }
      } else {
        return null
      }
    }
  }

  /*
   * This is a validator to be used in an angular reactive form
   * builder to check if the current value of a given control is
   * inside of a dynamic array. We have to use this method for dynamic
   * lists as angular forms don't pass the array by reference, they pass a
   * copy of the array which at initialization time will be empty
   *
   * One example of why this is useful is to check that a user has input
   * a valid autocomplete option where the autocomplete options are loaded
   * on component init through an api call. You can see us doing this on
   * the new payment page where we want to ensure a user has selected a
   * valid contributor from the available contributors that were pulled
   * from the api
   */
  public static isInReferencedArrayValidator(accessArray: () => string[] | number[]): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      if (control.value === null || control.value === '') {
        return null
      }

      const array = accessArray()
      for (let i = 0; i < array.length; i++) {
        if (array[i] === control.value) {
          return null
        }
      }

      return { inArray: { value: control.value } }
    }
  }

  /*
   * This is a validator to be used in an angular reactive form builder
   * to check if the current value of a given control is inside of a static
   * array (an array which we know the complete values of at component
   * initialization)
   */
  public static isInStaticArrayValidator(array: string[] | number[]): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      if (control.value === null || control.value === '') {
        return null
      }

      for (let i = 0; i < array.length; i++) {
        if (array[i] === control.value) {
          return null
        }
      }

      return { inArray: { value: control.value } }
    }
  }
}
