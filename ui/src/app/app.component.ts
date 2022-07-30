import { BreakpointObserver, Breakpoints, BreakpointState } from '@angular/cdk/layout'
import { Component, OnDestroy, OnInit } from '@angular/core'
import { Subject, takeUntil } from 'rxjs'
import { AuthService } from './auth/services/auth.service'

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
})
export class AppComponent implements OnInit, OnDestroy {
  private ngUnsubscribe = new Subject<void>()

  loggedIn = this.authService.loggedIn
  large: boolean = true
  opened: boolean = true

  constructor(private authService: AuthService, private breakpointObserver: BreakpointObserver) {}

  ngOnInit() {
    this.breakpointObserver
      .observe([Breakpoints.XSmall, Breakpoints.Small, Breakpoints.Medium, Breakpoints.Large, Breakpoints.XLarge])
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe((state: BreakpointState) => {
        // listen across viewport widths and open / close the side navigation menu based on how wide the
        // current viewport is
        if (state.breakpoints[Breakpoints.XSmall] || state.breakpoints[Breakpoints.Small]) {
          // small viewport, close side navigation
          this.opened = false
          this.large = false
        } else if (
          state.breakpoints[Breakpoints.Medium] ||
          state.breakpoints[Breakpoints.Large] ||
          state.breakpoints[Breakpoints.XLarge]
        ) {
          // large viewport, open side navigation
          this.opened = true
          this.large = true
        }
      })
  }

  ngOnDestroy() {
    this.ngUnsubscribe.next()
    this.ngUnsubscribe.complete()
  }

  logOut() {
    this.authService.logOut()
  }

  closeSideNavIfNeeded() {
    if (this.large === false) {
      this.opened = false
    }
  }
}
