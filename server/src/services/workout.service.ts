import { TABLE } from "./../database/constants/tables.constant";
import db from "../database/database-connector";

export const createWorkoutSession = async (
  contributorId: number,
  data: Record<string, any>
) => {
  const workoutSessionId = (
    await db(TABLE.WORKOUT_SESSION).insert({
      contributor_id: contributorId,
      related_user_id: data?.relatedStudent,
      name: data?.title,
      description: data?.description,
      image_uri: data?.imageUri,
      set_count: data?.numberOfSets,
      set_pause_time: data?.pauseBetweenSets,
      exercise_pause_time: data?.pauseBetweenExercises,
      is_active: data?.active,
      is_private: data?.private,
      tag_ids: data?.tags,
      rating: data?.rating,
    })
  ).at(0);

  // Save each added exercise to the workout
  for (let exercise of data?.exercises) {
    await db(TABLE.SESSION_EXERCISES).insert({
      session_id: workoutSessionId,
      exercise_id: exercise?.exerciseId,
      rank: exercise?.rank,
      description: exercise?.description,
      has_timing: exercise?.hasTiming,
      time_duration: exercise?.duration,
      reps: exercise?.repetitions
    });
  }
};

export const createWorkoutTags = async (data: Record<string, any>) => {
    await db(TABLE.WORKOUT_TAGS).insert({
        name: data?.name,
        icon_uri: data?.tagIcon,
        tag_color: data?.tagColor
    });
}