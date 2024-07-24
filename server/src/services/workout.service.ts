import { TABLE } from "./../database/constants/tables.constant";
import db from "../database/database-connector";
import { QueryParams } from "./../query-builders/models/builder.models";
import { WorkoutBuilder } from "./../query-builders/workout.builder";
import { mapWorkouts } from "./../helpers/workout.helper";
import { WorkoutTagsBuilder } from "./../query-builders/workout-tags.builder";

export const executeWorkoutBuilder = async (payload: QueryParams) =>
  await new WorkoutBuilder(payload).buildQuery();

export const getWorkouts = async (payload: QueryParams) => {
  const workouts = await executeWorkoutBuilder(payload);
  await mapWorkouts(workouts);

  return workouts;
};

export const createWorkoutSession = async (
  contributorId: number,
  data: Record<string, any>,
  file?: Express.Multer.File
) => {
  console.log("exercises", data.exercises);
  if (data?.private && !data?.relatedStudent) {
    throw new Error("You must provide related student for private workouts");
  }

  const workoutSessionId = (
    await db(TABLE.WORKOUT_SESSION).insert({
      contributor_id: contributorId,
      related_user_id: data?.relatedStudent == "null" || data?.relatedStudent == null ? null : data?.relatedStudent,
      name: data?.title,
      description: data?.description,
      image_uri: file.filename,
      set_count: data?.numberOfSets,
      set_pause_time: data?.pauseBetweenSets,
      exercise_pause_time: data?.pauseBetweenExercises,
      is_active: data?.active,
      is_private: data?.private,
      tag_ids: data?.tags,
    })
  ).at(0);

  
  // Save each added exercise to the workout
  for (let exercise of JSON.parse(data?.exercises)) {
    // Check if exercise exsists
    console.log("ELJSK;DJFLK;DSJFL;SDK", exercise);
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
