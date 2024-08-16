import { QueryParams } from "../query-builders/models/builder.models";
import db from "../database/database-connector";
import { LanguagesBuilder } from "../query-builders/languages.builder";

export const getLanguages = async (queryParams: QueryParams) => {
    const builder = new LanguagesBuilder(queryParams);

    return builder.buildQuery();
}