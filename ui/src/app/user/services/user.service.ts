import { HttpClient } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { BehaviorSubject, first, Observable, ReplaySubject, tap } from 'rxjs'
import { AuthService } from 'src/app/auth/services/auth.service'
import { environment } from 'src/environments/environment'
import { User } from '../types/user.type'

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private currentUserSubject = new ReplaySubject<User | null>(1)
  private currentUser$ = this.currentUserSubject.asObservable()

  private currentUserLoadingSubject = new BehaviorSubject<boolean>(false)
  private currentUserLoading$ = this.currentUserLoadingSubject.asObservable()

  constructor(private http: HttpClient, private authService: AuthService) {
    this.authService.loggedIn.subscribe((isLoggedIn) => {
      if (isLoggedIn) {
        this.fetchUser()
      } else {
        this.currentUserSubject.next(null)
      }
    })
  }

  public get currentUser(): Observable<User | null> {
    return this.currentUser$
  }

  public get currentUserLoading(): Observable<boolean> {
    return this.currentUserLoading$
  }

  private fetchUser(): void {
    this.currentUserLoadingSubject.next(true)
    this.http
      .get<User>(`${environment.apiUrl}/user`)
      .pipe(first())
      .subscribe({
        next: (user) => {
          // successfully retrieved user from API
          this.currentUserSubject.next(user)
        },
      })
      .add(() => {
        // on-complete, regardless of success or error
        this.currentUserLoadingSubject.next(false)
      })
  }

  public updateUser(newEmail: string, newName: string | null) {
    return this.http
      .put<User>(`${environment.apiUrl}/user`, {
        email: newEmail,
        name: newName,
      })
      .pipe(
        tap((updatedUser) => {
          // on a successful user update, update the user for listeners to be
          // the correct updated model from the api
          this.currentUserSubject.next(updatedUser)
        })
      )
  }

  public deleteUser() {
    return this.http.delete<User>(`${environment.apiUrl}/user`)
  }
}
