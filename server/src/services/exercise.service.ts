import { QueryParams } from "../query-builders/models/builder.models";
import { ExerciseBuilder } from "../query-builders/exercise.builder";
import db from "../database/database-connector";
import { ExerciseTagBuilder } from "../query-builders/exercise-tag.builder";
import { ExerciseEquipmentBuilder } from "../query-builders/exercise-equipment.builder";
import { TABLE } from "../database/constants/tables.contant";

export const getExercises = async (payload: QueryParams) =>
  await new ExerciseBuilder(payload);

export const addExercise = async (exerciseData: any) => {
  const requiredFields = [
    "title",
    "thumb_uri",
    "difficulty",
    "description",
    "equipment_ids",
    "tag_ids",
  ];

  for (let field of requiredFields) {
    if (!exerciseData[field]) {
      throw new Error(`Missing required field: ${field}`);
    }
  }

  const equipmentIds = exerciseData.equipment_ids
    ? exerciseData.equipment_ids.split(",")
    : [];
  const tagIds = exerciseData.tag_ids ? exerciseData.tag_ids.split(",") : [];

  if (equipmentIds.length > 0) {
    const equipmentCount = await db(TABLE.EXERCISE_EQUIPMENTS)
      .whereIn("id", equipmentIds)
      .count("* as count")
      .first();
    if (equipmentCount.count !== equipmentIds.length) {
      throw new Error("Invalid equipment IDs");
    }
  } else {
    throw new Error("equipment_ids must be selected");
  }

  if (tagIds.length > 0) {
    const tagCount = await db(TABLE.EXERCISE_TAGS)
      .whereIn("id", tagIds)
      .count("* as count")
      .first();
    if (tagCount.count !== tagIds.length) {
      throw new Error("Invalid tag IDs");
    }
  } else {
    throw new Error("tag_ids must be selected");
  }

  const currentDate = new Date().toISOString().split("T")[0];

  const createdExerciseID = (
    await db(TABLE.EXERCISES).insert({
      contributor_id: exerciseData.contributor_id,
      title: exerciseData.title,
      thumb_uri: exerciseData.thumb_uri,
      difficulty: exerciseData.difficulty,
      equipment_ids: exerciseData.equipment_ids,
      description: exerciseData.description,
      tag_ids: exerciseData.tag_ids,
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
