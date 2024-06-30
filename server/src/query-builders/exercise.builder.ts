import {
  AssociationItem,
  Condition,
  QueryParams,
} from "./models/builder.models";
import { AbstractBuilder } from "./common/abstract.builder";
import { TABLE } from "../database/constants/tables.contant";

export class ExerciseBuilder extends AbstractBuilder {
  override fieldsMap: Record<string, Record<string, string>> = {
    [TABLE.EXERCISES]: {
      uid: "id",
      contributorId: "contributor_id",
      title: "title",
      thumbUri: "thumb_uri",
      difficulty: "difficulty",
      equipmentIds: "equipment_ids",
      description: "description",
      tagIds: "tag_ids",
      dateCreated: "date_created",
      dateModified: "date_modified",
    },
  };

  override mainTable: string = TABLE.EXERCISES;
  override defaultLimit: number | null = 20;
  override defaultOffset: number | null = 0;
  override defaultSelect: Record<string, number> | null;
  override defaultCondition: Condition;
  override entityById: number | null = null;
  override associations: Array<AssociationItem> = [
    //Add object for user
  ];

  constructor(queryParams: QueryParams | null = null) {
    super(queryParams);
  }
}
