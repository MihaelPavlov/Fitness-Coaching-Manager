import { Injectable } from '@angular/core';
import { RestApiService } from '../../../shared/services/rest-api.service';
import { PATH } from '../../../shared/configs/path.config';
import { BehaviorSubject, Observable, Subscription, map } from 'rxjs';
import { UserInfo } from '../../models/user.interface';
import { IQueryParams } from '../../models/query-params.interface';
import { IRequestResult } from '../../models/request-result.interface';
import { IUserDetails } from '../models/user-details.interface';
import { SocketService } from '../../chat/services/socket.service';
import { IUserWorkout } from '../models/user-workout.interface';
import { Router } from '@angular/router';
import { environment } from '../../../shared/environments/environment.development';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private userInfoSubject$ = new BehaviorSubject<UserInfo | null>(null);
  public userInfo$ = this.userInfoSubject$.asObservable();

  private isAuthSubject$ = new BehaviorSubject<boolean>(false);
  public isAuth$ = this.isAuthSubject$.asObservable();

  constructor(
    private readonly apiService: RestApiService,
    private readonly socketService: SocketService,
    private readonly router: Router
  ) {}

  public get getUser(): UserInfo | null {
    return this.userInfoSubject$.value;
  }

  public getList(
    queryParams: IQueryParams
  ): Observable<IRequestResult<IUserDetails[]> | null> {
    return this.apiService.post<IRequestResult<IUserDetails[]> | null>(
      PATH.USERS.GET_LIST,
      queryParams
    );
  }

  public getDetail(
    queryParams: IQueryParams
  ): Observable<IRequestResult<IUserDetails> | null> {
    return this.apiService.post(PATH.USERS.GET_DETAIL, queryParams).pipe(
      map((res: any) => {
        if (
          res.data.profilePicture.startsWith('http') ||
          res.data.profilePicture.startsWith('https')
        )
          return res;
        const newPictureUrl = environment.files + res.data.profilePicture;
        res.data.profilePicture = newPictureUrl;
        return res;
      })
    );
  }

  public updateUser(data: Record<string, any>): Observable<any> {
    return this.apiService.put(PATH.USERS.UPDATE, data);
  }

  public fetchUserInfo(firstInit: boolean = false): Subscription {
    return this.fetchCurrentUserInfo().subscribe((res: any) => {
      this.userInfoSubject$.next({
        id: res.data.id,
        username: res.data.username,
        contributorId: res.data.contributorId,
        role: res.data.role,
      });
      this.isAuthSubject$.next(true);10
      this.socketService.emitEvent('addNewUser', res.data.id);
      console.log('ADD NEW USER TO CHAT ID ->', res.data.id);
      if (firstInit) {
        this.router.navigate(['/home']);
      }
    });
  }

  public subscribeToContributor(contributorId: number): Observable<any> {
    return this.apiService.post(PATH.USERS.SUBSCRIBE + `/${contributorId}`, {});
  }

  public unsubscribeToContributor(contributorId: number): Observable<any> {
    return this.apiService.post(
      PATH.USERS.UNSUBSCRIBE + `/${contributorId}`,
      {}
    );
  }

  public updateUserInfoSubject(user: UserInfo | null): void {
    this.userInfoSubject$.next(user);
  }

  public addToCollection(workoutId: number): Observable<any> {
    return this.apiService.post(
      PATH.USERS.ADD_TO_COLLECTION + `/${workoutId}`,
      {}
    );
  }

  public removeFromCollection(workoutId: number): Observable<any> {
    return this.apiService.post(
      PATH.USERS.REMOVE_FROM_COLLECTION + `/${workoutId}`,
      {}
    );
  }

  public getUserWorkoutList(
    queryParams: IQueryParams,
  ): Observable<IRequestResult<IUserWorkout[]> | null> {
    return this.apiService.post<IRequestResult<IUserWorkout[]> | null>(
      PATH.USERS.GET_USER_COLLECTION,
      queryParams
    );
  }

  public hasUserSubscribed(id: number): Observable<any> {
    return this.apiService.get(PATH.USERS.HAS_SUBSCRIBED + `/${id}`);
  }

  public fetchCurrentUserInfo(): Observable<any> {
    return this.apiService.get(PATH.USERS.CURRENT_USER);
  }
}
