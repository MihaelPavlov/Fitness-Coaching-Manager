import { Component, HostListener, OnDestroy } from '@angular/core';
import { UserService } from '../../entities/users/services/user.service';
import { SocketService } from '../../entities/chat/services/socket.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
})
export class AppComponent {
  title = 'client';

  constructor(
    private readonly userService: UserService,
    private readonly socketService: SocketService
  ) {
    if (!this.userService.getUser) {
      this.userService.fetchUserInfo();
    }
  }
  @HostListener('window:onbeforeunload', ['$event'])
  public cleanup(): void {
    this.socketService.disconnect();
  }
}
