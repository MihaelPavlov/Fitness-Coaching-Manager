import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  constructor(private httpClient: HttpClient) { }

  login(email: string | null | undefined, password: string | null | undefined) {
    return this.httpClient.post("/api/users/login", { email, password }); // Here we will built auth logic
  }
}
