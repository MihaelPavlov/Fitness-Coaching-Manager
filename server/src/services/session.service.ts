import { SessionExercisesBuilder } from "./../query-builders/session-exercises.builder";
import { QueryParams } from "./../query-builders/models/builder.models";
import { mapSessionExercises } from "./../helpers/session.helper";
import db from "../database/database-connector";
import { TABLE } from "./../database/constants/tables.constant";

export const getSessionExercises = async (queryParams: QueryParams) => {
  const builder = new SessionExercisesBuilder(queryParams);
  const results = await builder.buildQuery();

  return await mapSessionExercises(results);
};

export const getSessionExercise = async (queryParams: QueryParams) => {
  const builder = new SessionExercisesBuilder(queryParams);
  const result = await builder.buildQuery();

  return result;
}

export const finishSession = async (userId: number, workoutId: number, data: Record<string, any>) => {
    await db(TABLE.USER_SESSION).insert({
        "workout_id": workoutId,
        "user_id": userId,
        "time_duration": data?.timeDuration,
        "start_time": data?.startTime,
        "end_time": data?.endTime
    })
    await db(TABLE.USER_SPECS).increment("total_workouts").where("user_id", "=", userId);
};
