import { Injectable } from '@angular/core';
import { RestApiService } from '../../../shared/services/rest-api.service';
import { PATH } from '../../../shared/configs/path.config';
import { BehaviorSubject, Observable, Subscription, map } from 'rxjs';
import { UserInfo } from '../../models/user.interface';
import { IQueryParams } from '../../models/query-params.interface';
import { IRequestResult } from '../../models/request-result.interface';
import { IUserDetails } from '../models/user-details.interface';
import { SocketService } from '../../chat/services/socket.service';

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
    private readonly socketService: SocketService
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
        if (res.data.profilePicture.startsWith("http") || res.data.profilePicture.startsWith("https")) return res;
        const newPictureUrl = "http://localhost:3000/files/" + res.data.profilePicture;
        res.data.profilePicture = newPictureUrl;
        return res;
      })
    );
  }

  public updateUser(data: Record<string, any>): Observable<any> {
    return this.apiService.put(PATH.USERS.UPDATE, data);
  }

  public fetchUserInfo(): Subscription {
    return this.fetchCurrentUserInfo().subscribe((res: any) => {
      this.userInfoSubject$.next({
        id: res.data.id,
        username: res.data.username,
        role: res.data.role,
      });
      this.isAuthSubject$.next(true);
      this.socketService.emitEvent('addNewUser', res.data.id);

      //TODO: ON LOGOUT we need to disconnect from the socket
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

  public hasUserSubscribed(id: number): Observable<any> {
    return this.apiService.get(PATH.USERS.HAS_SUBSCRIBED + `/${id}`);
  }

  public fetchCurrentUserInfo(): Observable<any> {
    return this.apiService.get(PATH.USERS.CURRENT_USER);
  }
}
