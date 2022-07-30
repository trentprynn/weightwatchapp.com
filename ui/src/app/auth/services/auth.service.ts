import { HttpClient, HttpContext } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { Observable, ReplaySubject, throwError } from 'rxjs'
import { first, switchMap } from 'rxjs/operators'
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

  public logOut(): void {
    this.tokenService.removeToken().subscribe(() => {
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
