import { TABLE } from "../database/constants/tables.contant";
import { AbstractBuilder } from "./common/abstract.builder";
import {
  AssociationItem,
  Condition,
  QueryParams,
} from "./models/builder.models";

export class ExerciseTagBuilder extends AbstractBuilder {
  override fieldsMap: Record<string, Record<string, string>> = {
    [TABLE.EXERCISE_TAGS]: {
      uid: "id",
      name: "name",
      iconUri: "icon_uri",
      tagColor: "tag_color",
    },
  };
  override mainTable: string = TABLE.EXERCISE_TAGS;
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
