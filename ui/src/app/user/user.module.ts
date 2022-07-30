import { NgModule } from '@angular/core'
import { RouterModule, Routes } from '@angular/router'
import { AuthGuard } from '../auth/guards/auth.guard'
import { SharedModule } from '../shared/shared.module'
import { AccountSettingsComponent } from './components/account-settings/account-settings.component'

const routes: Routes = [
  {
    path: 'account/settings',
    component: AccountSettingsComponent,
    canActivate: [AuthGuard],
  },
  { path: '**', redirectTo: '/' },
]

@NgModule({
  declarations: [AccountSettingsComponent],
  imports: [SharedModule, RouterModule.forChild(routes)],
  providers: [],
})
export class UserModule {}
