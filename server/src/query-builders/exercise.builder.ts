import { AssociationItem, Condition, QueryParams } from "./models/builder.models";
import { AbstractBuilder } from "./common/abstract.builder";

export class ExerciseBuilder extends AbstractBuilder {
  override fieldsMap: Record<string, Record<string, string>> = {
    exercises: {
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
    exercise_equipment: {
      id: "id",
      title: "title",
      equipmentType: "equipment_type",
      iconUri: "icon_uri",
      tagColor: "tag_color",
    },
    exercise_tags: {
      id: "id",
      name: "name",
      iconUri: "icon_uri",
      tagColor: "tag_color",
    },
  };
  override mainTable: string = "exercises";
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
