import { SessionExercisesBuilder } from "./../query-builders/session-exercises.builder"
import { QueryParams } from "./../query-builders/models/builder.models"
import { mapSessionExercises } from "./../helpers/session.helper";

export const getSessionExercises = async (queryParams: QueryParams) => {
    const builder = new SessionExercisesBuilder(queryParams);
    const results = await builder.buildQuery();
    
    return await mapSessionExercises(results);
}