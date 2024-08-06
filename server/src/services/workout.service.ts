import { TABLE } from "./../database/constants/tables.constant";
import db from "../database/database-connector";
import { QueryParams } from "./../query-builders/models/builder.models";
import { WorkoutBuilder } from "./../query-builders/workout.builder";
import { mapWorkouts } from "./../helpers/workout.helper";
import { WorkoutTagsBuilder } from "./../query-builders/workout-tags.builder";
import { KnexValidationException } from "../models/exceptions/knex-validation.exception";

export const executeWorkoutBuilder = async (payload: QueryParams) =>
  await new WorkoutBuilder(payload).buildQuery();

export const getWorkouts = async (payload: QueryParams) => {
  let workouts = await executeWorkoutBuilder(payload);
  workouts = await mapWorkouts(workouts);

  return workouts;
};

export const createWorkoutSession = async (
  contributorId: number,
  data: Record<string, any>,
  file?: Express.Multer.File
) => {
  if (
    data?.private == 1 &&
    (data?.relatedStudent == "null" || data?.relatedStudent == null)
  ) {
    throw new KnexValidationException("You must provide related student for private workouts");
  }

  const workoutSessionId = (
    await db(TABLE.WORKOUT_SESSION).insert({
      contributor_id: contributorId,
      related_user_id:
        data?.relatedStudent == "null" || data?.relatedStudent == null
          ? null
          : data?.relatedStudent,
      name: data?.title,
      description: data?.description || null,
      image_uri: file.filename,
      set_count: data?.numberOfSets > 0 ? data?.numberOfSets : 1,
      set_pause_time: data?.pauseBetweenSets || 0,
      exercise_pause_time: data?.pauseBetweenExercises,
      is_active: data?.active,
      is_private: data?.private,
      tag_ids: data?.tags,
    })
  ).at(0);

  if (data?.private == 1) {
    await db(TABLE.USER_WORKOUT_COLLECTION).insert({
      user_id: data?.relatedStudent,
      workout_session_id: workoutSessionId,
    });
  }

  // Save each added exercise to the workout
  for (let exercise of JSON.parse(data?.exercises)) {
    // Check if exercise exsists
    await db(TABLE.SESSION_EXERCISES).insert({
      session_id: workoutSessionId,
      exercise_id: exercise?.exerciseId,
      rank: exercise?.rank,
      description: exercise?.description,
      has_timing: exercise?.hasTiming,
      time_duration: exercise?.duration,
      reps: exercise?.repetitions,
    });
  }
};

export const createWorkoutTags = async (data: Record<string, any>) => {
  await db(TABLE.WORKOUT_TAGS).insert({
    name: data?.name,
    icon_uri: data?.tagIcon,
    tag_color: data?.tagColor,
  });
};

export const getWorkoutTags = async (tagData: any) =>
  await new WorkoutTagsBuilder(tagData).buildQuery();

export const searchWorkouts = async (payload: QueryParams, query: string) => {
  let workouts = await new WorkoutBuilder(payload).buildQuery();

  workouts = workouts.filter((workout: any) => {
    if (workout.title.toLowerCase().includes(query.toLowerCase())) return true;
    return false;
  });

  workouts = await mapWorkouts(workouts);

  return workouts;
};
