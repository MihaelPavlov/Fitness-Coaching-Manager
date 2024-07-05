import { QueryParams } from "../query-builders/models/builder.models";
import { ExerciseBuilder } from "../query-builders/exercise.builder";
import db from "../database/database-connector";
import { ExerciseTagBuilder } from "../query-builders/exercise-tag.builder";
import { ExerciseEquipmentBuilder } from "../query-builders/exercise-equipment.builder";
import { TABLE } from "../database/constants/tables.constant";
import { BadRequestException } from "../models/exceptions/bad-request.exception";

export const executeExerciseBuilder = async (payload: QueryParams) =>
  await new ExerciseBuilder(payload).buildQuery();

export const addExercise = async (exerciseData: any) => {
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

  const createdExerciseID = (
    await db(TABLE.EXERCISES).insert({
      contributor_id: exerciseData.contributorId,
      title: exerciseData.title,
      thumb_uri: exerciseData.thumbUri,
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

export const getTags = async (tagData: any) =>
  await new ExerciseTagBuilder(tagData).buildQuery();

export const getEquipments = async (equipmentData: any) =>
  await new ExerciseEquipmentBuilder(equipmentData).buildQuery();
