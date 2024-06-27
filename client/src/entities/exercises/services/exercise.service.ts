import { Observable } from 'rxjs';
import { RestApiService } from '../../../shared/services/rest-api.service';
import { IQueryParams } from '../../models/query-params.interface';
import { Injectable } from '@angular/core';
import { PATH } from '../../../shared/configs/path.config';
import { EXERCISE_FIELDS } from '../models/exercise-fields.constant';
import { IRequestResult } from '../../models/request-result.interface';
import { IExercise } from '../models/exercise.interface';

@Injectable({
  providedIn: 'root',
})
export class ExerciseService {
  constructor(private api: RestApiService) {}

  public getExercises(
    queryParams: IQueryParams
  ): Observable<IRequestResult<IExercise[]> | null> {
    const payload = this.buildPayload(queryParams);
    return this.api.post(PATH.EXERCISES.GET_LIST, payload);
  }

  private buildPayload(queryParams: IQueryParams): any {
    const payload: any = {};
    if (queryParams.limit !== null) {
      payload.limit = queryParams.limit;
    }
    if (queryParams.offset !== null) {
      payload.offset = queryParams.offset;
    }
    if (queryParams.id !== null) {
      payload.id = queryParams.id;
    }
    payload.what = {};
    for (const key in queryParams.what) {
      if (queryParams.what.hasOwnProperty(key)) {
        const backendField =
          EXERCISE_FIELDS.exercises[
            key as keyof typeof EXERCISE_FIELDS.exercises
          ];
        if (backendField) {
          payload.what[backendField] = queryParams.what[key];
        }
      }
    }
    return payload;
  }
}
