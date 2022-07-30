import { NgModule } from '@angular/core'
import { RouterModule, Routes } from '@angular/router'
import { SharedModule } from '../shared/shared.module'
import { LoginComponent } from './components/login/login.component'
import { RegisterComponent } from './components/register/register.component'
import { NoAuthGuard } from './guards/no-auth.guard'

const routes: Routes = [
  {
    path: 'register',
    component: RegisterComponent,
    canActivate: [NoAuthGuard],
  },
  {
    path: '',
    component: LoginComponent,
    canActivate: [NoAuthGuard],
  },
  { path: '**', redirectTo: '' },
]

@NgModule({
  declarations: [LoginComponent, RegisterComponent],
  imports: [SharedModule, RouterModule.forChild(routes)],
})
export class AuthModule {}
