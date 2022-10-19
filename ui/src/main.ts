import { enableProdMode } from '@angular/core'
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic'
import { AppModule } from './app/app.module'
import { environment } from './environments/environment'

if (environment.production) {
  enableProdMode()

  // turn off console logging when running in production
  window.console.log = function () {}

  // append simple analytics script only in production
  const saScriptElement = document.createElement('script')
  saScriptElement.setAttribute('async', '')
  saScriptElement.setAttribute('defer', '')
  saScriptElement.setAttribute('data-collect-dnt', 'true')
  saScriptElement.src = 'https://sa.weightwatchapp.com/latest.js'
  document.body.appendChild(saScriptElement)
}

platformBrowserDynamic()
  .bootstrapModule(AppModule)
  .catch((err) => console.error(err))
