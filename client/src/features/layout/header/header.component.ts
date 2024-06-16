import { Component } from '@angular/core';
import { Input } from '@angular/core';
import { UserService } from '../../../entities/services/user.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
})
export class HeaderComponent {
  constructor(private userService: UserService) {}

  protected isAuth = this.userService.IsAuth();
  protected username = this.userService.getUsername();

  @Input() pageName: string = 'Header';
}
