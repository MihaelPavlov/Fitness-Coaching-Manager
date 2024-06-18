import { Injectable, OnInit } from '@angular/core';
import { RestApiService } from '../../shared/services/rest-api.service';
import { PATH } from '../../shared/configs/path.config';
import { BehaviorSubject, Observable, Subscription, map } from 'rxjs';

interface UserInfo {
  username: string,
  role: number
}

@Injectable({
  providedIn: 'root',
})
export class UserService {
  constructor(private readonly apiService: RestApiService) { }

  public isAuth(): boolean {
    const accessToken = localStorage.getItem('accessToken');
    const refreshToken = localStorage.getItem('refreshToken');

    return accessToken !== null && refreshToken !== null;
  }

  public getUserInfo(): Observable<any> {
      return this.fetchCurrentUserInfo(localStorage.getItem('accessToken') as string, localStorage.getItem('refreshToken') as string);
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

  private saveCredentials(
    accessToken: string,
    refreshToken: string,
  ): void {
    localStorage.setItem('accessToken', accessToken);
    localStorage.setItem('refreshToken', refreshToken);
  }

  private fetchCurrentUserInfo(accessToken: string, refreshToken: string): Observable<any> {
    return this.apiService.get(PATH.USERS.CURRENT_USER, { headers: { accessToken, refreshToken } })
  }
}
