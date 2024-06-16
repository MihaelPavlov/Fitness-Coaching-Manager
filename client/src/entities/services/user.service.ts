import { Injectable } from '@angular/core';
import { RestApiService } from '../../shared/services/rest-api.service';
import { PATH } from '../../shared/configs/path.config';
import { map } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  constructor(private readonly apiService: RestApiService) {}

  public IsAuth(): boolean {
    const accessToken = localStorage.getItem('accessToken');
    const refreshToken = localStorage.getItem('refreshToken');
    const username = localStorage.getItem('username');

    return accessToken !== null && refreshToken !== null && username !== null;
  }

  public getUsername(): string | null | undefined {
    return localStorage.getItem('username');
  }

  login(email: string | null | undefined, password: string | null | undefined) {
    return this.apiService.post(PATH.USERS.LOGIN, { email, password }).pipe(
      map((response: any) => {
        this.saveCredentials(
          response.data.accessToken,
          response.data.refreshToken,
          response.data.session.username
        );

        return response;
      })
    );
  }

  private saveCredentials(
    accessToken: string,
    refreshToken: string,
    username: string
  ): void {
    localStorage.setItem('accessToken', accessToken);
    localStorage.setItem('refreshToken', refreshToken);
    localStorage.setItem('username', username);
  }
}
