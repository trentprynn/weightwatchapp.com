import {
  HttpErrorResponse,
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
  HttpResponse,
} from '@angular/common/http'
import { Observable } from 'rxjs'
import { tap } from 'rxjs/operators'

/* The Angular HTTP client by default doesn't parse ISO dates returned from an API call as JS Dates objects, instead
 * it parses them as strings. This interceptor changes this behavior so if a ISO date obejct is returned from an HTTP
 * call it's parsed into a Date object as expected
 */
export class HttpDateInterceptor implements HttpInterceptor {
  iso8601 = /^\d{4}-\d\d-\d\dT\d\d:\d\d:\d\d(\.\d+)?(([+-]\d\d:\d\d)|Z)?$/

  public intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(req).pipe(
      tap(
        (event: HttpEvent<any>) => {
          if (event instanceof HttpResponse) {
            const body = event.body
            this.convertToDate(body)
          }
        },
        (err: any) => {
          if (err instanceof HttpErrorResponse) {
            if (err.status === 401) {
            }
          }
        }
      )
    )
  }

  convertToDate(body: any) {
    if (body === null || body === undefined) {
      return body
    }

    if (typeof body !== 'object') {
      return body
    }

    for (const key of Object.keys(body)) {
      const value = body[key]
      if (this.isIso8601(value)) {
        body[key] = new Date(value)
      } else if (typeof value === 'object') {
        this.convertToDate(value)
      }
    }
  }

  isIso8601(value: any) {
    if (value === null || value === undefined) {
      return false
    }

    return this.iso8601.test(value)
  }
}
