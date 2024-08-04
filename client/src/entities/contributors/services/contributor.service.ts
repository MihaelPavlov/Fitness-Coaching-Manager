import { Injectable } from '@angular/core';
import { IQueryParams } from '../../models/query-params.interface';
import { map, Observable } from 'rxjs';
import { IRequestResult } from '../../models/request-result.interface';
import { RestApiService } from '../../../shared/services/rest-api.service';
import { PATH } from '../../../shared/configs/path.config';
import { IContributorSubscriber } from '../models/contributor-subscriber.interface';
import { IContributor } from '../models/contributors.interface';
import { environment } from '../../../shared/environments/environment.development';

@Injectable({
  providedIn: 'root',
})
export class ContributorService {
  constructor(private readonly apiService: RestApiService) {}

  public getSubscribers(
    queryParams: IQueryParams
  ): Observable<IRequestResult<IContributorSubscriber[]> | null> {
    return this.apiService.post(PATH.CONTRIBUTORS.GET_SUBSCRIBERS, queryParams);
  }

  public getContributors(
    queryParams: IQueryParams
  ): Observable<IRequestResult<IContributor[]> | null> {
    return this.apiService.post(PATH.CONTRIBUTORS.GET_LIST, queryParams).pipe(
      map((res: any) => {
        res.data.map((contributor: any) => {
          if (
            contributor.profilePicture.startsWith('http') ||
            contributor.profilePicture.startsWith('https')
          )
            return contributor;
          const newPictureUrl = environment.files + contributor.profilePicture;
          contributor.profilePicture = newPictureUrl;
          return contributor;
        });

        return res;
      })
    );
  }
}
