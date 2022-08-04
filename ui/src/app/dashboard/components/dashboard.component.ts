import { Component } from '@angular/core'
import { UserService } from 'src/app/user/services/user.service'

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
})
export class DashboardComponent {
  currentUser = this.userService.currentUser
  currentUserLoading = this.userService.currentUserLoading

  constructor(private userService: UserService) {}
}
