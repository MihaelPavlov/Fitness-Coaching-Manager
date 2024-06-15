import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { RestApiService } from './rest-api.service';
import { PATH } from './path.config';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  constructor(private readonly apiService: RestApiService) { }

  login(email: string | null | undefined, password: string | null | undefined) {
    return this.apiService.post(PATH.USERS.LOGIN, { email, password }); // Here we will built auth logic
  }
}
