import { HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http'
import { Observable, throwError } from 'rxjs'
import { catchError } from 'rxjs/operators'

export class HttpErrorInterceptor implements HttpInterceptor {
  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(request).pipe(
      catchError((error: HttpErrorResponse) => {
        // intercept API error responses and make sure they always have some sort of error
        // string that the UI can use to inform a user of something wrong happening

        // set a base error message that, if all else goes wrong, will be shown
        let modifiedErrorMessage = 'An unknown error occurred'

        // if API returns an error message use that directly
        if (error.error.message && typeof error.error.message === 'string') {
          modifiedErrorMessage = error.error.message
        }

        // if the API returns an array of error messages, use the first one
        // if it's a string
        if (error.error.message && Array.isArray(error.error.message)) {
          if (typeof error.error.message[0] === 'string') {
            modifiedErrorMessage = error.error.message[0]
          }
        }

        // you can't modify a HttpErrorResponse object's message (it's readonly property), instead we
        // have to create a new one and re-throw that
        const newHttpErrorResponse = new HttpErrorResponse({
          error: { ...error.error, message: modifiedErrorMessage },
          headers: error.headers,
          status: error.status,
          statusText: error.statusText,
          url: error.url ? error.url : undefined,
        })

        // throw the new HttpErrorResponse which will always have an error.error.message property
        return throwError(() => newHttpErrorResponse)
      })
    )
  }
}
