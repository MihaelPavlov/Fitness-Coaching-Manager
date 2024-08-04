import { Injectable } from '@angular/core';
import { IQueryParams } from '../../models/query-params.interface';
import { map, Observable } from 'rxjs';
import { IRequestResult } from '../../models/request-result.interface';
import { IWorkout } from '../models/workout.interface';
import { PATH } from '../../../shared/configs/path.config';
import { RestApiService } from '../../../shared/services/rest-api.service';
import { IWorkoutTag } from '../models/workout-tag.interface';
import { environment } from '../../../shared/environments/environment.development';

@Injectable({
  providedIn: 'root',
})
export class WorkoutService {
  constructor(private readonly apiService: RestApiService) {}

  public getWorkouts(
    queryParams: IQueryParams
  ): Observable<IRequestResult<IWorkout[]> | null> {
    return this.apiService.post(PATH.WORKOUTS.GET_WORKOUTS, queryParams).pipe(
      map((res: any) => {
        if (res.data.length == 1 && res.data[0]?.numberOfSets) return res;
        res.data.map((workout: any) => {
          if (workout.imageUri.startsWith("http") || workout.imageUri.startsWith("https")) return workout;
          const newImageUrl = environment.files + workout.imageUri;
          workout.imageUri = newImageUrl;
          return workout;
        })
        return res;
      })
    )
  }

  public searchWorkouts(
    queryParams: IQueryParams,
    title: string
  ): Observable<IRequestResult<IWorkout[]> | null> {
    return this.apiService.post(PATH.WORKOUTS.SEARCH + title, queryParams).pipe(
      map((res: any) => {
        res.data.map((workout: any) => {
          if (workout.imageUri.startsWith("http") || workout.imageUri.startsWith("https")) return workout;
          const newImageUrl = environment.files + workout.imageUri;
          workout.imageUri = newImageUrl;
          return workout;
        })
        return res;
      })
    )
  }

  public createWorkout(data: Record<string, any>): Observable<any> {
    return this.apiService.post(PATH.WORKOUTS.CREATE_WORKOUT, data);
  }

  public getWorkoutTags(
    queryParams: IQueryParams
  ): Observable<IRequestResult<IWorkoutTag[]> | null> {
    return this.apiService.post(PATH.WORKOUTS.GET_TAG_LIST, queryParams);
  }
}
