import { Injectable } from '@angular/core';
import { RestApiService } from './rest-api.service';
import { PATH } from './path.config';
import { tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  constructor(private readonly apiService: RestApiService) { }

  public IsAuth(): boolean {
    const accessToken = localStorage.getItem("accessToken");
    const refreshToken = localStorage.getItem("refreshToken");
    const username = localStorage.getItem("username");

    return accessToken !== null && refreshToken !== null && username !== null;
  }

  public getUsername(): string | null | undefined {
    return localStorage.getItem("username");
  }

  private saveCredentials(accessToken: string, refreshToken: string, username: string): void {
    localStorage.setItem("accessToken", accessToken);
    localStorage.setItem("refreshToken", refreshToken);
    localStorage.setItem("username", username);
  }

  login(email: string | null | undefined, password: string | null | undefined) {
    return this.apiService.post(PATH.USERS.LOGIN, { email, password }).pipe(
      tap((response: any) => {
        this.saveCredentials(response.data.accessToken, response.data.refreshToken, response.data.session.username);
      })
    );
  }
}
