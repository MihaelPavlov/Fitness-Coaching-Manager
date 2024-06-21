import { QueryParams } from "../query-builders/models/builder.models";
import { ExerciseBuilder } from "../query-builders/exercise.builder";
import db from "../database/database-connector";

export const getExercises = async (payload: QueryParams) => {
  let builder = new ExerciseBuilder(payload);

  return await builder.buildQuery();
};

export const addExercise = async (exerciseData: any) => {
    
};
