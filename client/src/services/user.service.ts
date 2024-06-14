import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private httpClient: HttpClient) { }

  login(email: string, password: string) {
    return this.httpClient.post("/api/users/login", { email, password });
  }
}
