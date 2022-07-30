import { NgModule } from '@angular/core'
import { RouterModule, Routes } from '@angular/router'
import { AuthGuard } from './auth/guards/auth.guard'
import { NoAuthGuard } from './auth/guards/no-auth.guard'

const routes: Routes = [
  {
    path: 'login',
    loadChildren: () => import('./auth/auth.module').then((m) => m.AuthModule),
    canLoad: [NoAuthGuard],
  },
  {
    path: 'user',
    loadChildren: () => import('./user/user.module').then((m) => m.UserModule),
    canLoad: [AuthGuard],
  },
  {
    path: '',
    loadChildren: () => import('./dashboard/dashboard.module').then((m) => m.DashboardModule),
    canLoad: [AuthGuard],
  },
  { path: '**', redirectTo: '' },
]

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
