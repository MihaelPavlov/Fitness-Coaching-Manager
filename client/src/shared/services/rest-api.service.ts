import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { environment } from '../environments/environment.development';

export const URL: string = `${environment.apiUrl}`;

@Injectable({
  providedIn: 'root',
})
export class RestApiService {
  private readonly baseUrl;

  constructor(private readonly httpClient: HttpClient) {
    this.baseUrl = URL;
  }

  public get<T>(path: string, options?: object): Observable<T> {
    return this.httpClient
      .get<T>(`${this.baseUrl}${path}`, options)
      .pipe(map((res: any) => res as T));
  }

  public post<T>(
    path: string,
    body: object | string,
    options?: object
  ): Observable<T | null> {
    return this.httpClient
      .post<T>(`${this.baseUrl}${path}`, body, options)
      .pipe(map((res: any) => res as T));
  }

  public put<T>(
    path: string,
    body: object | string,
    options?: object
  ): Observable<T | null> {
    return this.httpClient
      .put<T>(`${this.baseUrl}${path}`, body, options)
      .pipe(map((res: any) => res as T));
  }

  public delete<T>(path: string, options?: object): Observable<T> {
    return this.httpClient
      .delete<T>(`${this.baseUrl}${path}`, options)
      .pipe(map((res: any) => res as T));
  }
}
