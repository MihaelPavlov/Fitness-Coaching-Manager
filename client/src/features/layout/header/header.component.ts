import { Component, OnInit } from '@angular/core';
import { Input } from '@angular/core';
import { UserService } from '../../../entities/users/services/user.service';
import { Observable } from 'rxjs';
import { AuthService } from '../../../entities/users/services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
})
export class HeaderComponent implements OnInit {
  @Input() pageName: string = 'Header';

  public userInfo$: Observable<any> = this.userService.userInfo$;
  public isAuth$ = this.userService.isAuth$;

  public showDropdown: boolean = false;

  constructor(
    private readonly userService: UserService,
    private readonly authService: AuthService,
    private readonly router: Router
  ) {}

  public ngOnInit(): void {
    this.userService.fetchUserInfo();
  }

  public toggleDropdown() {
    this.showDropdown = !this.showDropdown;
  }

  public onLogout() {
    this.authService.logout().subscribe({
      next: () => {
        this.router.navigate(['/login']);
      },
      error: (err) => console.log("logout error", err)
    })
  }
}
