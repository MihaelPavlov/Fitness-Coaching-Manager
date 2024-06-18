import { Injectable } from '@angular/core';
import { RestApiService } from '../../shared/services/rest-api.service';
import { PATH } from '../../shared/configs/path.config';
import { BehaviorSubject, Observable, Subscription, map } from 'rxjs';

interface UserInfo {
  username: string
}

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private userInfo$$ = new BehaviorSubject<UserInfo | undefined>(undefined);
  private userInfo$ = this.userInfo$$.asObservable();

  private _username: string = "";

  constructor(private readonly apiService: RestApiService) {
    this.userInfo$.subscribe((userInfo) => {
      this._username = userInfo?.username || "";
    });
  }

  public IsAuth(): boolean {
    const accessToken = localStorage.getItem('accessToken');
    const refreshToken = localStorage.getItem('refreshToken');

    return accessToken !== null && refreshToken !== null;
  }

  public getUsername(): any {
    return this.userInfo$.subscribe((userInfo) => {
      console.log(userInfo)
      return userInfo?.username || "";
    });
  }

  public login(email: string, password: string): Observable<any> {
    return this.apiService.post(PATH.USERS.LOGIN, { email, password }).pipe(
      map((response: any) => {
        console.log(response.data)
        this.saveCredentials(
          response.data.accessToken,
          response.data.refreshToken,
          response.data.session.username,
          response.data.session.sessionId
        );

        return response;
      })
    );
  }

  private saveCredentials(
    accessToken: string,
    refreshToken: string,
    username: string,
    sessionId: string
  ): void {
    localStorage.setItem('accessToken', accessToken);
    localStorage.setItem('refreshToken', refreshToken);
    localStorage.setItem('sessionId', sessionId)
    this.userInfo$$.next({username});
  }
}
