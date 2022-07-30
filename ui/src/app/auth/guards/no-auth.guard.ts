import { Injectable } from '@angular/core'
import {
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

@Injectable({
  providedIn: 'root',
})
export class NoAuthGuard implements CanActivate, CanLoad {
  constructor(private authService: AuthService, private router: Router) {}

  canLoad(route: Route, segments: UrlSegment[]): Observable<boolean | UrlTree> {
    return this.allowed()
  }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean | UrlTree> {
    return this.allowed()
  }

  private allowed(): Observable<boolean | UrlTree> {
    return this.authService.loggedIn.pipe(
      map((loggedIn) => {
        if (loggedIn) {
          // user IS logged in, this page should only be accessibly if user is NOT logged in,
          // send user to dashboard
          return this.router.parseUrl('/')
        } else {
          return true
        }
      })
    )
  }
}
