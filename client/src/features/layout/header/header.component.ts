import { Component, OnInit } from '@angular/core';
import { Input } from '@angular/core';
import { UserService } from '../../../entities/services/user.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
})
export class HeaderComponent implements OnInit {
  constructor(private userService: UserService) {}

  protected userInfo$: Observable<any> = this.userService.userInfo$;
  protected isAuth$ = this.userService.isAuth$;

  ngOnInit(): void {
    this.userService.fetchUserInfo();
  }

  @Input() pageName: string = 'Header';
}
