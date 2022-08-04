import {
  HttpContextToken,
  HttpErrorResponse,
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
} from '@angular/common/http'
import { Injectable } from '@angular/core'
import { Router } from '@angular/router'
import { BehaviorSubject, Observable, throwError } from 'rxjs'
import { catchError, filter, first, switchMap } from 'rxjs/operators'
import { AuthService } from 'src/app/auth/services/auth.service'
import { TokenService } from 'src/app/auth/services/token.service'
import { Token } from 'src/app/auth/types/token.type'

export const BYPASS_AUTH = new HttpContextToken(() => false)

@Injectable()
export class HttpAuthInterceptor implements HttpInterceptor {
  constructor(private tokenService: TokenService, private authService: AuthService, private router: Router) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<Object>> {
    // allow caller to bypass auth handling if they want to make a request without appending their auth header
    if (req.context.get(BYPASS_AUTH) === true) {
      return next.handle(req)
    }

    return this.tokenService.token.pipe(first()).pipe(
      switchMap((token) => {
        // if we have a cached token add it to the request
        if (token) {
          req = this.addToken(req, token.access_token)
        }

        // handle the request, the token will now be appended as a header if appropriate
        return next.handle(req).pipe(
          catchError((error) => {
            if (error instanceof HttpErrorResponse && error.status === 401) {
              // handle HTTP401 error -> this means our access token is invalid (it's only valid for 1hr)
              // and we need to attempt to refresh it so the user can continue performing actions
              return this.handle401Error(req, next)
            } else {
              return throwError(() => error)
            }
          })
        )
      })
    )
  }

  private isRefreshing = false
  private refreshTokenSubject: BehaviorSubject<any> = new BehaviorSubject<any>(null)

  private handle401Error(request: HttpRequest<any>, next: HttpHandler) {
    if (this.isRefreshing) {
      return this.refreshTokenSubject
        .pipe(filter((token) => token != null))
        .pipe(first())
        .pipe(
          switchMap((token) => {
            return next.handle(this.addToken(request, token))
          })
        )
    }

    this.isRefreshing = true
    this.refreshTokenSubject.next(null)
    return this.authService
      .refreshToken()
      .pipe(first())
      .pipe(
        switchMap((token: Token) => {
          this.isRefreshing = false
          this.refreshTokenSubject.next(token.access_token)
          return next.handle(this.addToken(request, token.access_token))
        }),
        catchError((error: HttpErrorResponse) => {
          this.isRefreshing = false
          this.refreshTokenSubject.next(null)

          // failed to refresh auth token for some reason, log user out
          // so they can fetch a new auth token by logging in.
          if (error.status === 400) {
            this.authService.logOut(false)
          }

          return throwError(() => error)
        })
      )
  }

  private addToken(request: HttpRequest<any>, token: string): HttpRequest<any> {
    return request.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`,
      },
    })
  }
}
