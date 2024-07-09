import { Injectable, OnInit } from '@angular/core';
import { RestApiService } from '../../../shared/services/rest-api.service';
import { PATH } from '../../../shared/configs/path.config';
import { BehaviorSubject, Observable, Subscription, map } from 'rxjs';
import { UserInfo } from '../../models/user.interface';
import { IQueryParams } from '../../models/query-params.interface';
import { IRequestResult } from '../../models/request-result.interface';
import { IPublicUserDetails } from '../models/user-details.interface';
import { HttpHeaders } from '@angular/common/http';
import { IWorkoutCardsFields } from '../models/workout-cards.interface';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private userInfoSubject$ = new BehaviorSubject<UserInfo | null>(null);
  public userInfo$ = this.userInfoSubject$.asObservable();

  private isAuthSubject$ = new BehaviorSubject<boolean>(false);
  public isAuth$ = this.isAuthSubject$.asObservable();

  constructor(private readonly apiService: RestApiService) {}

  public getDetail(queryParams: IQueryParams): Observable<IRequestResult<IPublicUserDetails> | null> {
    return this.apiService.post(PATH.USERS.GET_DETAIL, queryParams);
  }

  public getContributorWorkouts(queryParams: IQueryParams): Observable<IRequestResult<IWorkoutCardsFields[]> | null> {
    return this.apiService.post(PATH.WORKOUTS.GET_CONTRIBUTOR_WORKOUTS, queryParams);
  }

  public fetchUserInfo$(): Observable<any> {
    return this.fetchCurrentUserInfo(
      localStorage.getItem('accessToken') as string,
      localStorage.getItem('refreshToken') as string
    )
  }

  public fetchUserInfo(): Subscription {
    return this.fetchCurrentUserInfo(
      localStorage.getItem('accessToken') as string,
      localStorage.getItem('refreshToken') as string
    ).subscribe((res: any) => {
      this.userInfoSubject$.next({
        id: res.data.id,
        username: res.data.username,
        role: res.data.role,
      });
      this.isAuthSubject$.next(true);
    });
  }

  public subscribeToContributor(contributorId: number): Observable<any> {
    return this.apiService.post(PATH.USERS.SUBSCRIBE + `/${contributorId}`, {}, { 'headers': this.createAuthHeaders() })
  }

  public unsubscribeToContributor(contributorId: number): Observable<any> {
    return this.apiService.post(PATH.USERS.UNSUBSCRIBE + `/${contributorId}`, {}, { 'headers': this.createAuthHeaders() })
  }

  public hasUserSubscribedToContributor(contributorId: number): Observable<any> {
    return this.apiService.get(PATH.USERS.HAS_SUBSCRIBED + `/${contributorId}`, { 'headers': this.createAuthHeaders() })
  }

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

        this.fetchUserInfo();

        return response;
      })
    );
  }

  private saveCredentials(accessToken: string, refreshToken: string): void {
    localStorage.setItem('accessToken', accessToken);
    localStorage.setItem('refreshToken', refreshToken);
  }

  private fetchCurrentUserInfo(
    accessToken: string,
    refreshToken: string
  ): Observable<any> {
    return this.apiService.get(PATH.USERS.CURRENT_USER, {
      headers: { accessToken, refreshToken },
    });
  }

  private createAuthHeaders(): HttpHeaders {
    return new HttpHeaders()
              .set('AccessToken', localStorage.getItem('accessToken') || '')
              .set('RefreshToken', localStorage.getItem('refreshToken') || '')
  }
}
