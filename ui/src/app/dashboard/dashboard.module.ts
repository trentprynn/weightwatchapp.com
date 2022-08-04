import { NgModule } from '@angular/core'
import { RouterModule, Routes } from '@angular/router'
import { AuthGuard } from '../auth/guards/auth.guard'
import { SharedModule } from '../shared/shared.module'
import { WeightLogModule } from '../weight-log/weight-log.module'
import { DashboardComponent } from './components/dashboard.component'

const routes: Routes = [
  {
    path: '',
    component: DashboardComponent,
    canActivate: [AuthGuard],
  },
  { path: '**', redirectTo: '' },
]

@NgModule({
  declarations: [DashboardComponent],
  imports: [SharedModule, RouterModule.forChild(routes), WeightLogModule],
  providers: [],
})
export class DashboardModule {}
