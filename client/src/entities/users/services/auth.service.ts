import { map, Observable } from 'rxjs';
import { PATH } from '../../../shared/configs/path.config';
import { RestApiService } from '../../../shared/services/rest-api.service';
import { UserService } from './user.service';
import { Injectable } from '@angular/core';
import { HttpHeaders } from '@angular/common/http';
import { SocketService } from '../../chat/services/socket.service';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(
    private readonly apiService: RestApiService,
    private readonly userService: UserService,
    private readonly sockerService: SocketService
  ) {}

  public login(email: string, password: string): Observable<any> {
    return this.apiService.post(PATH.USERS.LOGIN, { email, password }).pipe(
      map((response: any) => {
        this.saveCredentials(
          response.data.accessToken,
          response.data.refreshToken
        );
        this.sockerService.connect()
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

        this.userService.fetchUserInfo();

        return response;
      })
    );
  }

  public logout(): Observable<any> {
    this.sockerService.disconnect();
    return this.apiService.post(PATH.USERS.LOGOUT, {}).pipe(
      map((response: any) => {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        return response;
      })
    );
  }

  public createAuthHeaders(): HttpHeaders {
    return new HttpHeaders()
      .set('AccessToken', localStorage.getItem('accessToken') || '')
      .set('RefreshToken', localStorage.getItem('refreshToken') || '');
  }

  private saveCredentials(accessToken: string, refreshToken: string): void {
    localStorage.setItem('accessToken', accessToken);
    localStorage.setItem('refreshToken', refreshToken);
  }
}
