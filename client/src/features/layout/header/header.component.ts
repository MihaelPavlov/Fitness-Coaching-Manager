import { Component, OnInit } from '@angular/core';
import { Input } from '@angular/core';
import { UserService } from '../../../entities/services/user.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
})
export class HeaderComponent implements OnInit {
  constructor(private userService: UserService) {}

  ngOnInit(): void {
      this.userService.getUserInfo().subscribe((res: any) => this.username = res.data.username)
  }

  protected isAuth = this.userService.isAuth();
  protected username: string = "";

  @Input() pageName: string = 'Header';
}
