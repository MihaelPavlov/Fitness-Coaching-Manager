import { Injectable } from "@angular/core";
import { IQueryParams } from "../../models/query-params.interface";
import { Observable } from "rxjs";
import { IRequestResult } from "../../models/request-result.interface";
import { IWorkoutCardsFields } from "../models/workout-cards.interface";
import { PATH } from "../../../shared/configs/path.config";
import { RestApiService } from "../../../shared/services/rest-api.service";

@Injectable({
  providedIn: 'root',
})

export class WorkoutService {
  constructor(private readonly apiService: RestApiService) {}

  public getWorkouts(
    queryParams: IQueryParams
  ): Observable<IRequestResult<IWorkoutCardsFields[]> | null> {
    return this.apiService.post(
      PATH.WORKOUTS.GET_WORKOUTS,
      queryParams
    );
  }

  public createWorkout(
    data: Record<string, any>
  ): Observable<any> {
    return this.apiService.post(PATH.WORKOUTS.CREATE_WORKOUT, data);
  }

  public getWorkoutTags(
    queryParams: IQueryParams
  ) : Observable<IRequestResult<any> | null> {
    return this.apiService.post(PATH.WORKOUTS.GET_TAG_LIST, queryParams);
  }
}
