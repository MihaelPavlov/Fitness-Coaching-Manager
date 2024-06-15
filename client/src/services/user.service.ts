import { Injectable } from '@angular/core';
import { RestApiService } from './rest-api.service';
import { PATH } from './path.config';
import { tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  constructor(private readonly apiService: RestApiService) { }

  login(email: string | null | undefined, password: string | null | undefined) {
    return this.apiService.post(PATH.USERS.LOGIN, { email, password }).pipe(
      tap((response: any) => {
        localStorage.setItem("accessToken", response.data.accessToken);
        localStorage.setItem("refreshToken", response.data.refreshToken);
      })
    );
  }
}
