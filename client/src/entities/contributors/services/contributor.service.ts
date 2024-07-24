import { Injectable } from "@angular/core";
import { IQueryParams } from "../../models/query-params.interface";
import { Observable } from "rxjs";
import { IRequestResult } from "../../models/request-result.interface";
import { RestApiService } from "../../../shared/services/rest-api.service";
import { PATH } from "../../../shared/configs/path.config";
import { IContributorSubscriber } from "../models/contributor-subscriber.interface";

@Injectable({
  providedIn: "root"
})
export class ContributorService {
  constructor(
    private readonly apiService: RestApiService
  ) {}

  public getSubscribers(
    queryParams: IQueryParams
  ): Observable<IRequestResult<IContributorSubscriber[]> | null> {
    return this.apiService.post(PATH.CONTRIBUTORS.GET_SUBSCRIBERS, queryParams);
  }
}
