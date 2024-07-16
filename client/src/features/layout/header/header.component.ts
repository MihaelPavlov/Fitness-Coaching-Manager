import { Component, OnInit } from '@angular/core';
import { Input } from '@angular/core';
import { UserService } from '../../../entities/users/services/user.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
})
export class HeaderComponent implements OnInit {
  @Input() pageName: string = 'Header';

  public userInfo$: Observable<any> = this.userService.userInfo$;
  public isAuth$ = this.userService.isAuth$;

  constructor(private userService: UserService) {}

  public ngOnInit(): void {
    this.userService.fetchUserInfo();
  }
}
