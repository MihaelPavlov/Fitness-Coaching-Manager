import { Injectable } from "@angular/core";
import { RestApiService } from "../../../shared/services/rest-api.service";
import { IQueryParams } from "../../models/query-params.interface";
import { Observable } from "rxjs";
import { IRequestResult } from "../../models/request-result.interface";
import { PATH } from "../../../shared/configs/path.config";
import { ISessionExercise } from "../models/session-exercise.interface";

@Injectable({
  providedIn: "root"
})
export class SessionService {
  constructor (private readonly apiService: RestApiService) {}

  public getSessionExercises(
    queryParams: IQueryParams
  ): Observable<IRequestResult<ISessionExercise[]> | null> {
    return this.apiService.post(
      PATH.SESSIONS.GET_EXERCISES,
      queryParams
    )
  }
}
