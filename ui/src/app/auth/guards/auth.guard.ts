import { Injectable } from '@angular/core'
import {
  ActivatedRoute,
  ActivatedRouteSnapshot,
  CanActivate,
  CanLoad,
  Route,
  Router,
  RouterStateSnapshot,
  UrlSegment,
  UrlTree,
} from '@angular/router'
import { Observable } from 'rxjs'
import { map } from 'rxjs/operators'
import { AuthService } from '../services/auth.service'

type Passthrough = {
  loggedIn: Observable<boolean>
  url: Observable<UrlSegment[]>
}

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate, CanLoad {
  constructor(private authService: AuthService, private router: Router, private route: ActivatedRoute) {}

  canLoad(route: Route, segments: UrlSegment[]): Observable<boolean | UrlTree> {
    if (segments && segments.length > 0) {
      const urlString = segments.join('/')
      return this.allowed(urlString)
    }

    return this.allowed()
  }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean | UrlTree> {
    if (state.url) {
      return this.allowed(state.url)
    }

    return this.allowed()
  }

  private allowed(redirectUrl?: string | undefined): Observable<boolean | UrlTree> {
    return this.authService.loggedIn.pipe(
      map((loggedIn) => {
        if (loggedIn) {
          return true
        } else {
          // logged OUT user trying to access page that requires auth, send them
          // back to login
          if (redirectUrl) {
            return this.router.parseUrl(`/login?redirectUrl=${redirectUrl}`)
          }

          return this.router.parseUrl('/login')
        }
      })
    )
  }
}
