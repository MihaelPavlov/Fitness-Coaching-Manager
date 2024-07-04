import { TABLE } from "../database/constants/tables.contant";
import { AbstractBuilder } from "./common/abstract.builder";
import {
  AssociationItem,
  Condition,
  QueryParams,
} from "./models/builder.models";

export class ExerciseEquipmentBuilder extends AbstractBuilder {
  override fieldsMap: Record<string, Record<string, string>> = {
    [TABLE.EXERCISE_EQUIPMENTS]: {
      uid: "id",
      title: "title",
      equipmentType: "equipment_type",
      iconUri: "icon_uri",
      tagColor: "tag_color",
    },
  };
  override mainTable: string = TABLE.EXERCISE_EQUIPMENTS;
  override defaultLimit: number | null = 20;
  override defaultOffset: number | null = 0;
  override defaultSelect: Record<string, number> | null;
  override defaultCondition: Condition;
  override entityById: number | null = null;
  override associations: Array<AssociationItem> = [];

  constructor(queryParams: QueryParams | null = null) {
    super(queryParams);
  }
}
