import { HttpClient, HttpContext } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { Observable, ReplaySubject, throwError } from 'rxjs'
import { catchError, first, switchMap } from 'rxjs/operators'
import { BYPASS_AUTH } from 'src/app/core/interceptors/auth.interceptor'
import { environment } from 'src/environments/environment'
import { Token } from '../types/token.type'
import { TokenService } from './token.service'

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  // we don't want a token refresh to trigger a new subject for the isLoggedIn observable so we
  // need to maintain whether the user is logged in and only update the subject if the user's logged in
  // subject actually changes
  private isLoggedInLocal: boolean | undefined = undefined
  private isLoggedInSubject = new ReplaySubject<boolean>(1)
  private isLoggedIn$ = this.isLoggedInSubject.asObservable()

  constructor(private http: HttpClient, private tokenService: TokenService) {
    this.tokenService.token.subscribe((token) => {
      if (token) {
        if (this.isLoggedInLocal === false || this.isLoggedInLocal === undefined) {
          // user has not been marked locally as already logged in, therefore we should update the subject
          this.isLoggedInLocal = true
          this.isLoggedInSubject.next(true)
        }
      } else {
        if (this.isLoggedInLocal || this.isLoggedInLocal === undefined) {
          // user has not been marked locally as logged out, therefore we should update the subject
          this.isLoggedInLocal = false
          this.isLoggedInSubject.next(false)
        }
      }
    })
  }

  public login(email: string, password: string) {
    return this.http
      .post<Token>(
        `${environment.apiUrl}/auth/login`,
        {
          email: email,
          password: password,
        },
        { context: new HttpContext().set(BYPASS_AUTH, true) }
      )
      .pipe(
        switchMap((token) => {
          return this.tokenService.saveToken(token)
        })
      )
  }

  public async logOut(revokeRefreshToken: boolean = true) {
    this.tokenService.token
      .pipe(first())
      .pipe(
        switchMap((token) => {
          // grab the user's access token info from local storage
          if (token && revokeRefreshToken) {
            // attempt to revoke the user's refresh token if it exists and the called didn't ask us not to
            return this.http
              .delete(`${environment.apiUrl}/auth/refresh-token`, {
                body: {
                  refresh_token: token.refresh_token,
                },
              })
              .pipe(
                switchMap((_) => {
                  // successfully revoked refresh token, map API return value to simple true boolean
                  return new Observable((observable) => {
                    observable.next(true)
                    observable.complete()
                  })
                })
              )
              .pipe(
                catchError((_) => {
                  // if we fail to revoke refresh token for any reason, just collapse the result to false and move on
                  return new Observable((observable) => {
                    observable.next(false)
                    observable.complete()
                  })
                })
              )
          } else {
            // no token found or caller asked us to skip revoking the token (skipping token revocation is use
            // when you're doing something like deleting the user's account as all tokens will inherently be revoked
            // by the delete action)
            return new Observable((observable) => {
              observable.next(false)
              observable.complete()
            })
          }
        })
      )
      .pipe(
        switchMap((_) => {
          // no matter the result of the api revocation action, remove the token from the user's
          // local storage
          return this.tokenService.removeToken()
        })
      )
      .subscribe((_) => {
        // the user has now hopefully had their refresh token revoked and removed from local storage so it
        // can't be used any more

        // navigate the user back to the login page, we do this using location.href (hard navigation instead of
        // client side navigation) so any services etc are cleared without them having to specifically for
        // a user log out event
        location.href = '/login'
      })
  }

  public refreshToken(): Observable<Token> {
    return this.tokenService.token.pipe(first()).pipe(
      switchMap((token) => {
        if (token === null) {
          return throwError(() => "Cannot attempt to refresh a token when there's no current token present")
        }

        return this.http
          .post<Token>(
            `${environment.apiUrl}/auth/refresh-token`,
            {
              refresh_token: token.refresh_token,
            },
            { context: new HttpContext().set(BYPASS_AUTH, true) }
          )
          .pipe(
            switchMap((newToken) => {
              return this.tokenService.saveToken(newToken)
            })
          )
      })
    )
  }

  public revokeAllRefreshTokens() {
    return this.http.delete(`${environment.apiUrl}/auth/refresh-tokens`)
  }

  public get loggedIn(): Observable<boolean> {
    return this.isLoggedIn$
  }
}
