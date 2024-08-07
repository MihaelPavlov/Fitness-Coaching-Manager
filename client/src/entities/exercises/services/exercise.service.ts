import { map, Observable } from 'rxjs';
import { RestApiService } from '../../../shared/services/rest-api.service';
import { IQueryParams } from '../../models/query-params.interface';
import { Injectable } from '@angular/core';
import { PATH } from '../../../shared/configs/path.config';
import { EXERCISE_FIELDS } from '../models/fields/exercise-fields.constant';
import { IRequestResult } from '../../models/request-result.interface';
import { IExercise } from '../models/exercise.interface';
import { IExerciseTag } from '../models/exercise-tag.interface';
import { IExerciseEquipment } from '../models/exercise-equipment.interface';
import { environment } from '../../../shared/environments/environment.development';

@Injectable({
  providedIn: 'root',
})
export class ExerciseService {
  constructor(private api: RestApiService) {}

  public getList(
    queryParams: IQueryParams,
    title: string | null = null
  ): Observable<IRequestResult<IExercise[]> | null> {
    const payload = this.buildPayload(queryParams, EXERCISE_FIELDS.exercises);
    return this.api
      .post(
        `${PATH.EXERCISES.GET_LIST}${title ? `?title=${title}` : ''}`,
        payload
      )
      .pipe(
        map((res: any) => {
          res.data.map((exercise: any) => {
            if (
              exercise.thumbUri.startsWith('http') ||
              exercise.thumbUri.startsWith('https')
            )
              return exercise;
            const newPictureUrl = environment.files + exercise.thumbUri;
            exercise.thumbUri = newPictureUrl;
            return exercise;
          });

          return res;
        })
      );
  }

  public getTagList(
    queryParams: IQueryParams
  ): Observable<IRequestResult<IExerciseTag[]> | null> {
    const payload = this.buildPayload(
      queryParams,
      EXERCISE_FIELDS.exercise_tags
    );
    return this.api.post(PATH.EXERCISES.GET_TAG_LIST, payload);
  }

  public getEquipmentList(
    queryParams: IQueryParams
  ): Observable<IRequestResult<IExerciseEquipment[]> | null> {
    const payload = this.buildPayload(
      queryParams,
      EXERCISE_FIELDS.exercise_equipments
    );
    return this.api.post(PATH.EXERCISES.GET_EQUIPMENT_LIST, payload);
  }

  public getDetails(
    queryParams: IQueryParams
  ): Observable<IRequestResult<IExercise[]> | null> {
    //const payload = this.buildPayload(queryParams, EXERCISE_FIELDS.exercises);
    return this.api.post(PATH.EXERCISES.GET_DETAILS, queryParams);
  }

  public create(
    exercise: Record<string, any>
  ): Observable<IRequestResult<number> | null> {
    return this.api.post(PATH.EXERCISES.CREATE, exercise);
  }

  public update(
    exerciseId: string,
    exercise: Record<string, any>
  ): Observable<any> {
    return this.api.put(PATH.EXERCISES.UPDATE + exerciseId, exercise);
  }

  public delete(exerciseId: number): Observable<any> {
    return this.api.delete(PATH.EXERCISES.DELETE + exerciseId);
  }

  public updateUser(exerciseId: Record<string, any>): Observable<any> {
    return this.api.put(PATH.EXERCISES.UPDATE, exerciseId);
  }

  private buildPayload(queryParams: IQueryParams, fields: any): any {
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
    if (queryParams.condition !== null) {
      payload.condition = queryParams.condition;
    }
    payload.what = {};
    for (const key in queryParams.what) {
      if (queryParams.what.hasOwnProperty(key)) {
        const backendField = fields[key as keyof typeof fields];
        if (backendField) {
          payload.what[backendField] = queryParams.what[key];
        }
      }
    }
    return payload;
  }
}
