import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  Router,
  RouterStateSnapshot,
} from '@angular/router';
import { UserService } from '../../entities/users/services/user.service';
import { catchError, map, Observable, of } from 'rxjs';
import { UserRoles } from '../enums/user-roles.enum';

@Injectable({
  providedIn: 'root',
})
export class CoachOnlyGuard implements CanActivate {
  constructor(private router: Router, private userService: UserService) {}

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> | Promise<boolean> | boolean {
    if (
      this.userService.getUser &&
      this.userService.getUser.role === UserRoles.Coach
    ) {
      return true;
    }

    return this.userService.fetchCurrentUserInfo().pipe(
      map((response: any) => {
        console.log(response);

        if (response.data.role === UserRoles.Coach) {
          return true;
        }
        this.router.navigateByUrl('/workout/list');
        return false;
      }),
      catchError((err) => {
        console.log('error coach guard');

        this.router.navigateByUrl('/workout/list');
        return of(false);
      })
    );
  }
}
