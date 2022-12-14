import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http'
import { NgModule, Optional, SkipSelf } from '@angular/core'
import { BrowserModule } from '@angular/platform-browser'
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'
import { throwError } from 'rxjs'
import { SharedModule } from '../shared/shared.module'
import { HttpAuthInterceptor } from './interceptors/auth.interceptor'
import { HttpDateInterceptor } from './interceptors/date.interceptor'
import { HttpErrorInterceptor } from './interceptors/error.interceptor'

@NgModule({
  declarations: [],
  imports: [SharedModule, HttpClientModule, BrowserModule, BrowserAnimationsModule],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: HttpDateInterceptor,
      multi: true,
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: HttpErrorInterceptor,
      multi: true,
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: HttpAuthInterceptor,
      multi: true,
    },
  ],
  exports: [HttpClientModule, BrowserModule, BrowserAnimationsModule],
})
export class CoreModule {
  constructor(@Optional() @SkipSelf() parentModule: CoreModule) {
    if (parentModule) {
      return throwError(() => 'CoreModule is already loaded. Import it in the AppModule only')
    }
  }
}
