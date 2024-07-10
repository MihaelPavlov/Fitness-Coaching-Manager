import { Component } from '@angular/core';
import { UserService } from '../../entities/users/services/user.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
})
export class AppComponent {
  title = 'client';

  constructor(private readonly userService: UserService) {
    if (!this.userService.getUser) {
      this.userService.fetchUserInfo();
    }
  }
}
