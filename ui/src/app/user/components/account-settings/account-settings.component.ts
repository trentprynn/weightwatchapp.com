import { HttpErrorResponse } from '@angular/common/http'
import { Component, OnInit } from '@angular/core'
import { FormControl, FormGroup, Validators } from '@angular/forms'
import { MatSnackBar } from '@angular/material/snack-bar'
import { first } from 'rxjs'
import { AuthService } from 'src/app/auth/services/auth.service'
import { UserService } from 'src/app/user/services/user.service'
import { RefreshToken } from '../../types/refresh-token.type'

@Component({
  selector: 'app-account-settings',
  templateUrl: './account-settings.component.html',
})
export class AccountSettingsComponent implements OnInit {
  currentUser = this.userService.currentUser
  currentUserLoading = this.userService.currentUserLoading

  refreshTokens: RefreshToken[] | undefined = undefined
  refreshTokensLoading: boolean = false
  refreshTokensFetchError: string | null = null

  revokeAllRefreshTokensLoading: boolean = false

  profileForm = new FormGroup({
    email: new FormControl<string>('', { validators: [Validators.required, Validators.email], nonNullable: true }),
    name: new FormControl<string | null>('', { nonNullable: true }),
  })
  saveProfileLoading: boolean = false

  deleteUserLoading: boolean = false

  constructor(private userService: UserService, private authService: AuthService, private snackBar: MatSnackBar) {}

  ngOnInit(): void {
    this.userService.currentUser.pipe(first()).subscribe((user) => {
      if (user) {
        this.profileForm.controls.email.patchValue(user.email)
        this.profileForm.controls.name.patchValue(user.name)
      }
    })
  }

  saveProfile() {
    if (this.profileForm.valid) {
      this.saveProfileLoading = true
      this.userService
        .updateUser(this.profileForm.controls.email.value, this.profileForm.controls.name.value)
        .subscribe({
          next: () => {
            this.snackBar.open('Successfully updated user information', 'ok', {
              duration: 5000,
            })
          },
          error: (error: HttpErrorResponse) => {
            this.snackBar.open(error.error.message, 'ok', {
              duration: 5000,
            })
          },
        })
        .add(() => {
          this.saveProfileLoading = false
        })
    }
  }

  revokeAllRefreshTokens() {
    if (
      confirm(
        'Are you sure you want to revoke refresh tokens for this account? All browsers, including this one, will be logged out'
      ) === true
    ) {
      this.revokeAllRefreshTokensLoading = true
      this.authService
        .revokeAllRefreshTokens()
        .subscribe({
          next: () => {
            this.authService.logOut(false)
          },
          error: (error: HttpErrorResponse) => {
            this.snackBar.open(error.error.message, 'ok', {
              duration: 5000,
            })
          },
        })
        .add(() => {
          this.revokeAllRefreshTokensLoading = false
        })
    }
  }

  deleteUser() {
    if (confirm('Are you sure you want to delete your account? This cannot be undone') === true) {
      this.deleteUserLoading = true
      this.userService
        .deleteUser()
        .subscribe({
          next: () => {
            this.authService.logOut(false)
          },
          error: (error: HttpErrorResponse) => {
            this.snackBar.open(error.error.message, 'ok', {
              duration: 5000,
            })
          },
        })
        .add(() => {
          this.deleteUserLoading = false
        })
    }
  }
}
