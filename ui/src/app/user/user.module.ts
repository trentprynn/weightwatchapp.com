import { NgModule } from '@angular/core'
import { RouterModule, Routes } from '@angular/router'
import { AuthGuard } from '../auth/guards/auth.guard'
import { SharedModule } from '../shared/shared.module'
import { UserSettingsComponent } from './components/user-settings/user-settings.component'

const routes: Routes = [
  {
    path: 'settings',
    component: UserSettingsComponent,
    canActivate: [AuthGuard],
  },
  { path: '**', redirectTo: '/' },
]

@NgModule({
  declarations: [UserSettingsComponent],
  imports: [SharedModule, RouterModule.forChild(routes)],
  providers: [],
})
export class UserModule {}
