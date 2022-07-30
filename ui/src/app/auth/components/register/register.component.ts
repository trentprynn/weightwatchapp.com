import { HttpErrorResponse } from '@angular/common/http'
import { Component, OnDestroy, OnInit } from '@angular/core'
import { FormBuilder, Validators } from '@angular/forms'
import { MatSnackBar } from '@angular/material/snack-bar'
import { Router } from '@angular/router'
import { Subject, takeUntil } from 'rxjs'
import { SharedValidators } from 'src/app/shared/validators/shared-validators.class'
import { AuthService } from '../../services/auth.service'
import { RegistrationService } from '../../services/registration.service'
import { RegisterRequest } from '../../types/register-request.model'

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
})
export class RegisterComponent implements OnInit, OnDestroy {
  private ngUnsubscribe = new Subject<void>()

  passwordHidden: boolean = true
  confirmPasswordHidden: boolean = true

  registerForm = this.formBuilder.nonNullable.group(
    {
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
      confirmPassword: ['', Validators.required],
    },
    {
      validators: [SharedValidators.matchValidator('password', 'confirmPassword')],
    }
  )
  registerLoading: boolean = false

  constructor(
    private registrationService: RegistrationService,
    private formBuilder: FormBuilder,
    private router: Router,
    private snackBar: MatSnackBar,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.registerForm.controls.password.valueChanges.pipe(takeUntil(this.ngUnsubscribe)).subscribe(() => {
      this.registerForm.controls.confirmPassword.updateValueAndValidity()
    })
  }

  ngOnDestroy(): void {
    this.ngUnsubscribe.next()
    this.ngUnsubscribe.complete()
  }

  register(): void {
    if (this.registerForm.valid) {
      const registrationRequest: RegisterRequest = {
        email: this.registerForm.controls.email.value,
        password: this.registerForm.controls.password.value,
      }

      this.registerLoading = true
      this.registrationService
        .register(registrationRequest)
        .subscribe({
          next: () => {
            // user successfully registered
            this.authService.login(registrationRequest.email, registrationRequest.password).subscribe(() => {
              this.router.navigateByUrl('/')
            })
          },
          error: (error: HttpErrorResponse) => {
            this.snackBar.open(error.error.message, 'ok', {
              duration: 5000,
            })
          },
        })
        .add(() => {
          this.registerLoading = false
        })
    }
  }
}
