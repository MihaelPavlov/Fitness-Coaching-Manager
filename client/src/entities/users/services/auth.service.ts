import { map, Observable } from "rxjs";
import { PATH } from "../../../shared/configs/path.config";
import { RestApiService } from "../../../shared/services/rest-api.service";
import { UserService } from "./user.service";
import { Injectable } from "@angular/core";

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(private readonly apiService: RestApiService, private readonly userService: UserService) {}

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

        this.userService.fetchUserInfo();

        return response;
      })
    );
  }

  private saveCredentials(accessToken: string, refreshToken: string): void {
    localStorage.setItem('accessToken', accessToken);
    localStorage.setItem('refreshToken', refreshToken);
  }
}
