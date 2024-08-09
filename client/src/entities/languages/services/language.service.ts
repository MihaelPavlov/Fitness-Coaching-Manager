import { Injectable } from "@angular/core";
import { RestApiService } from "../../../shared/services/rest-api.service";
import { IQueryParams } from "../../models/query-params.interface";
import { Observable } from "rxjs";
import { IRequestResult } from "../../models/request-result.interface";
import { PATH } from "../../../shared/configs/path.config";
import { ILanguage } from "../models/language.interface";

@Injectable({
  providedIn: "root"
})
export class LanguageService {
  constructor (private readonly apiService: RestApiService) {}

  public getLanguages(
    queryParams: IQueryParams
  ): Observable<IRequestResult<ILanguage[]> | null> {
    return this.apiService.post(
      PATH.LANGUAGES.GET_LANGUAGES, queryParams
    )
  }
}
