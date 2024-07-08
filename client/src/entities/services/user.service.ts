import { Injectable, OnInit } from '@angular/core';
import { RestApiService } from '../../shared/services/rest-api.service';
import { PATH } from '../../shared/configs/path.config';
import { BehaviorSubject, Observable, Subscription, isEmpty, map } from 'rxjs';
import { UserInfo } from '../models/user.interface';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private userInfoSubject$ = new BehaviorSubject<UserInfo | null>(null);
  public userInfo$ = this.userInfoSubject$.asObservable();

  private isAuthSubject$ = new BehaviorSubject<boolean>(false);
  public isAuth$ = this.isAuthSubject$.asObservable();
  
  constructor(private readonly apiService: RestApiService) {}

  public fetchUserInfo(): Subscription {
    return this.fetchCurrentUserInfo(
      localStorage.getItem('accessToken') as string,
      localStorage.getItem('refreshToken') as string
    ).subscribe((res: any) => {
      this.userInfoSubject$.next({
        username: res.data.username,
        role: res.data.role,
      });
      this.isAuthSubject$.next(true);
    });
  }

  public login(email: string, password: string): Observable<any> {
    return this.apiService.post(PATH.USERS.LOGIN, { email, password }).pipe(
      map((response: any) => {
        this.saveCredentials(
          response.data.accessToken,
          response.data.refreshToken
        );

        return response;
      })
    );
  }

  public register(body: Record<string, any>): Observable<any> {
    return this.apiService.post(PATH.USERS.REGISTER, body).pipe(
      map((response: any) => {
        this.saveCredentials(
          response.data.accessToken,
          response.data.refreshToken
        );

        this.fetchUserInfo();

        return response;
      })
    );
  }

  private saveCredentials(accessToken: string, refreshToken: string): void {
    localStorage.setItem('accessToken', accessToken);
    localStorage.setItem('refreshToken', refreshToken);
  }

  private fetchCurrentUserInfo(
    accessToken: string,
    refreshToken: string
  ): Observable<any> {
    return this.apiService.get(PATH.USERS.CURRENT_USER, {
      headers: { accessToken, refreshToken },
    });
  }

  //method to call BE and retrieve private profile details
  public getDetail(options?: object): Observable<any> {
    return this.apiService.get('users/getDetail', options);
  }
}
