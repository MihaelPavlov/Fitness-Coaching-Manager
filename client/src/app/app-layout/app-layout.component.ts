import { Component } from '@angular/core';
import { UserService } from '../../entities/services/user.service';

@Component({
  selector: 'app-layout',
  templateUrl: 'app-layout.component.html',
  styleUrl: 'app-layout.component.scss',
})
export class AppLayoutComponent {
  public isAuth$ = this.userService.isAuth$;

  constructor(private userService: UserService) {}

  public ngOnInit(): void {
    this.userService.fetchUserInfo();
  }
}
