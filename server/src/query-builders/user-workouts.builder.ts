import { TABLE } from "./../database/constants/tables.constant";
import { AbstractBuilder } from "./common/abstract.builder";
import {
  AssociationItem,
  Condition,
  QueryParams,
} from "./models/builder.models";

export class UserWorkoutsBuilder extends AbstractBuilder {
  protected override fieldsMap: Record<string, Record<string, string>> = {
    [TABLE.USER_WORKOUT_COLLECTION]: {
      uid: "id",
      userId: "user_id",
      workoutSessionId: "workout_session_id",
    },
  };
  protected override mainTable: string = TABLE.USER_WORKOUT_COLLECTION;
  protected override defaultLimit: number;
  protected override defaultSelect: Record<string, number>;
  protected override defaultCondition: Condition;
  protected override entityById: number;
  protected override associations: AssociationItem[] = [];

  constructor(queryParams: QueryParams | null = null) {
    super(queryParams);
  }
}
