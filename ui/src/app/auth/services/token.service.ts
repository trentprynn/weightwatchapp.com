import { Injectable } from '@angular/core'
import { Observable, ReplaySubject } from 'rxjs'
import { Token } from '../types/token.type'

@Injectable({
  providedIn: 'root',
})
export class TokenService {
  private tokenSubject = new ReplaySubject<Token | null>(1)
  private token$ = this.tokenSubject.asObservable()

  constructor() {
    const token = localStorage.getItem('token-weight-watch')

    if (token) {
      const parsedToken: Token = JSON.parse(token)
      this.tokenSubject.next(parsedToken)
    } else {
      this.tokenSubject.next(null)
    }
  }

  saveToken(token: Token): Observable<Token> {
    return new Observable((observable) => {
      this.tokenSubject.next(token)

      const tokenToSave = JSON.stringify(token)
      localStorage.setItem('token-weight-watch', tokenToSave)
      observable.next(token)
      observable.complete()
    })
  }

  removeToken(): Observable<boolean> {
    return new Observable((observable) => {
      this.tokenSubject.next(null)

      localStorage.removeItem('token-weight-watch')
      observable.next(true)
      observable.complete()
    })
  }

  get token(): Observable<Token | null> {
    return this.token$
  }
}
