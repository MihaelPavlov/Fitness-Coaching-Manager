import { QueryParams } from "../query-builders/models/builder.models";
import { ExerciseBuilder } from "../query-builders/exercise.builder";
import db from "../database/database-connector";
import { ExerciseTagBuilder } from "../query-builders/exercise-tag.builder";
import { ExerciseEquipmentBuilder } from "../query-builders/exercise-equipment.builder";
import { TABLE } from "../database/constants/tables.constant";
import { BadRequestException } from "../models/exceptions/bad-request.exception";

export const executeExerciseBuilder = async (payload: QueryParams) =>
  await new ExerciseBuilder(payload).buildQuery();

export const addExercise = async (
  contributorId: number,
  exerciseData: any,
  file: Express.Multer.File
) => {
  const equipmentIds = exerciseData.equipmentIds
    ? exerciseData.equipmentIds.split(",")
    : [];
  const tagIds = exerciseData.tagIds ? exerciseData.tagIds.split(",") : [];

  if (equipmentIds.length > 0) {
    const equipmentCount = await db(TABLE.EXERCISE_EQUIPMENTS)
      .whereIn("id", equipmentIds)
      .count("* as count")
      .first();
    if (equipmentCount.count !== equipmentIds.length)
      throw new BadRequestException();
  }

  if (tagIds.length > 0) {
    const tagCount = await db(TABLE.EXERCISE_TAGS)
      .whereIn("id", tagIds)
      .count("* as count")
      .first();
    if (tagCount.count !== tagIds.length) throw new BadRequestException();
  }

  const currentDate = new Date().toISOString().split("T")[0];

  if (!file) {
    throw new Error("You must upload a thumb for the exercise");
  }

  const createdExerciseID = (
    await db(TABLE.EXERCISES).insert({
      contributor_id: contributorId,
      title: exerciseData.title,
      thumb_uri: file.filename,
      difficulty: exerciseData.difficulty,
      equipment_ids: exerciseData.equipmentIds,
      description: exerciseData.description,
      tag_ids: exerciseData.tagIds,
      date_created: currentDate,
      date_modified: currentDate,
    })
  ).at(0);

  return createdExerciseID;
};

export const updateExercise = async (
  exerciseId: number,
  exerciseData: any,
  userId: any,
  file?: Express.Multer.File
) => {
  if (!(await isExerciseOwner(exerciseId, userId))) {
    throw new Error("You are unauthorized!");
  }

  const equipmentIds = exerciseData.equipmentIds
    ? exerciseData.equipmentIds.split(",")
    : [];
  const tagIds = exerciseData.tagIds ? exerciseData.tagIds.split(",") : [];

  if (equipmentIds.length > 0) {
    const equipmentCount = await db(TABLE.EXERCISE_EQUIPMENTS)
      .whereIn("id", equipmentIds)
      .count("* as count")
      .first();
    if (equipmentCount.count !== equipmentIds.length)
      throw new BadRequestException();
  }

  if (tagIds.length > 0) {
    const tagCount = await db(TABLE.EXERCISE_TAGS)
      .whereIn("id", tagIds)
      .count("* as count")
      .first();
    if (tagCount.count !== tagIds.length) throw new BadRequestException();
  }

  const currentDate = new Date().toISOString().split("T")[0];

  let savedThumb;

  if (file && !exerciseData?.thumbUri) {
    savedThumb = file.filename;
  }

  if (!file && exerciseData?.thumbUri) {
    savedThumb = exerciseData?.thumbUri;
  }

  if (!file && !exerciseData.thumbUri) {
    throw new Error("A file must be uploaded");
  }

  await db(TABLE.EXERCISES).where("id", "=", exerciseId).update({
    title: exerciseData.title,
    thumb_uri: savedThumb,
    difficulty: exerciseData.difficulty,
    equipment_ids: exerciseData.equipmentIds,
    description: exerciseData.description,
    tag_ids: exerciseData.tagIds,
    date_modified: currentDate,
  });
};
export const searchExercises = async (payload: QueryParams, query: string) => {
  const exercises = await new ExerciseBuilder(payload).buildQuery();

  return exercises.filter((exercise: any) => {
    if (exercise.title.toLowerCase().includes(query.toLowerCase())) return true;
    return false;
  });
};

export const getTags = async (tagData: any) =>
  await new ExerciseTagBuilder(tagData).buildQuery();

export const getEquipments = async (equipmentData: any) =>
  await new ExerciseEquipmentBuilder(equipmentData).buildQuery();

export const getExercise = async (exerciseData: any) =>
  await new ExerciseBuilder(exerciseData).buildQuery();

export const deleteExercise = async (exerciseId: number, userId: any) => {
  if (!(await isExerciseOwner(exerciseId, userId))) {
    throw new Error("You are unauthorized!");
  }

  await db(TABLE.EXERCISES).where("id", exerciseId).del();
};
const isExerciseOwner = async (
  exerciseId: any,
  userId: any
): Promise<boolean> => {
  const exercise = (
    await db(TABLE.EXERCISES).select("*").where("id", "=", exerciseId)
  ).at(0);
  if (exercise.contributor_id == userId) return true;
  return false;
};
