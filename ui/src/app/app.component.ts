import { BreakpointObserver, Breakpoints, BreakpointState } from '@angular/cdk/layout'
import { Component, HostListener, OnDestroy, OnInit } from '@angular/core'
import { NavigationStart, Router } from '@angular/router'
import { debounceTime, filter, fromEvent, startWith, Subject, takeUntil } from 'rxjs'
import { AuthService } from './auth/services/auth.service'

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit, OnDestroy {
  private ngUnsubscribe = new Subject<void>()

  loggedIn = this.authService.loggedIn
  large: boolean = true
  opened: boolean = true

  height: number = 0

  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    event.target.innerWidth
  }

  constructor(
    private authService: AuthService,
    private breakpointObserver: BreakpointObserver,
    private router: Router
  ) {}

  ngOnInit() {
    // unfortunately ios 100vh css doesn't respect scrolling height changes such as when the user is scrolling
    // and their url bar hides (thus changing page height) -- this causes an effect where the page gets stuck when
    // using 100vh sizing to make our background full height. To get around this we must manually track the height
    // of the page and then use that to set the height of our background
    fromEvent(window, 'resize')
      .pipe(startWith(0))
      .pipe(takeUntil(this.ngUnsubscribe))
      .pipe(debounceTime(25))
      .subscribe((event) => {
        console.log(`height: ${window.innerHeight}px`)
        this.height = window.innerHeight
      })

    // listen across viewport widths and open / close the side navigation menu based on how wide the
    // current viewport is
    this.breakpointObserver
      .observe([Breakpoints.XSmall, Breakpoints.Small, Breakpoints.Medium, Breakpoints.Large, Breakpoints.XLarge])
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe((state: BreakpointState) => {
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

    // listen to router events and close the side navigation menu (if needed) when one occurs. We do this so when a
    // mobile user clicks on the side navigation menu the menu closes after a navigation link is clicked
    this.router.events
      .pipe(takeUntil(this.ngUnsubscribe))
      .pipe(filter((event) => event instanceof NavigationStart))
      .subscribe((_) => {
        if (this.large === false) {
          this.opened = false
        }
      })
  }

  ngOnDestroy() {
    this.ngUnsubscribe.next()
    this.ngUnsubscribe.complete()
  }

  logOut() {
    // close side nav (if needed) after log out click
    if (this.large === false) {
      this.opened = false
    }

    // actually log out
    this.authService.logOut()
  }

  closeSideNavIfNeeded() {
    if (this.large === false) {
      this.opened = false
    }
  }
}
