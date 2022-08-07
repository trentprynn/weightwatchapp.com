import { NgModule } from '@angular/core'
import { RouterModule, Routes } from '@angular/router'
import { AuthGuard } from '../auth/guards/auth.guard'
import { SharedModule } from '../shared/shared.module'
import { ActivityHomepageComponent } from './activity-homepage/activity-homepage.component'

const routes: Routes = [
  {
    path: '',
    component: ActivityHomepageComponent,
    canActivate: [AuthGuard],
  },
  { path: '**', redirectTo: '/' },
]

@NgModule({
  declarations: [ActivityHomepageComponent],
  imports: [SharedModule, RouterModule.forChild(routes)],
  providers: [],
})
export class ActivityModule {}
