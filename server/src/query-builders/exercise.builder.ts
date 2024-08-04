import {
  AssociationItem,
  Condition,
  OrderItem,
  QueryParams,
} from "./models/builder.models";
import { AbstractBuilder } from "./common/abstract.builder";
import { TABLE } from "../database/constants/tables.constant";

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

  protected override mainTable: string = TABLE.EXERCISES;
  protected override defaultLimit: number;
  protected override defaultOffset: number;
  protected override defaultSelect: Record<string, number>;
  protected override defaultCondition: Condition;
  protected override defaultOrder: OrderItem[];
  protected override entityById: number;
  protected override associations: Array<AssociationItem> = [
    //Add object for user
    {
      mainField: "contributor_id",
      relatedTable: TABLE.CONTRIBUTORS,
      relatedField: "id",
    },
  ];

  constructor(queryParams: QueryParams | null = null) {
    super(queryParams);
  }
}
