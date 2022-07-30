import { HttpErrorResponse } from '@angular/common/http'
import { Component } from '@angular/core'
import { FormBuilder, Validators } from '@angular/forms'
import { Router } from '@angular/router'
import { first } from 'rxjs'
import { AuthService } from 'src/app/auth/services/auth.service'

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
})
export class LoginComponent {
  passwordHidden: boolean = true

  loginForm = this.formBuilder.nonNullable.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', Validators.required],
  })
  loginLoading: boolean = false
  loginError: string | null = null

  constructor(private authService: AuthService, private formBuilder: FormBuilder, private router: Router) {}

  logIn(): void {
    if (this.loginForm.valid) {
      this.loginLoading = true
      this.loginError = null
      this.authService
        .login(this.loginForm.controls.email.value, this.loginForm.controls.password.value)
        .pipe(first())
        .subscribe({
          next: () => {
            // user was successfully sent a 2FA code, navigate them to the page where they can input it and
            // finish logging in
            this.router.navigateByUrl('/dashboard')
          },
          error: (error: HttpErrorResponse) => {
            // failed to retrieve an auth token from the backend
            this.loginError = error.error.message
          },
        })
        .add(() => {
          this.loginLoading = false
        })
    }
  }
}
