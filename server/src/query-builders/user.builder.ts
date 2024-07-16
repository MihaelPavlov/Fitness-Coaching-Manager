import {
  AssociationItem,
  Condition,
  OrderItem,
  QueryParams,
} from "./models/builder.models";
import { AbstractBuilder } from "./common/abstract.builder";
import { TABLE } from "../database/constants/tables.constant";

export class UserBuilder extends AbstractBuilder {
  override fieldsMap: Record<string, Record<string, string>> = {
    [TABLE.USERS]: {
      uid: "id",
      firstName: "first_name",
      lastName: "last_name",
      userName: "username",
      email: "email",
      password: "password",
      profilePicture: "profile_picture_url",
      country: "country",
      language: "language",
      phoneNumber: "phone_number",
      userRole: "user_role",
      visible: "visible",
      dateCreated: "date_created",
    },
    [TABLE.USER_SPECS]: {
      userSpecId: "id",
      userId: "user_id",
      weight: "weight",
      weightGoal: "weight_goal",
      height: "height",
      BMI: "bmi",
      burnedCalories: "total_calorie_burned",
      workoutCount: "total_workouts",
      preferences: "workout_preferences",
      sex: "sex",
      fitnessLevel: "fitness_level",
      birthDate: "date_of_birth",
    },
    [TABLE.CONTRIBUTORS]: {
      contributorId: "id",
      userId: "user_id",
      dateOfApproval: "approval_date",
      summary: "summary",
      rating: "rating",
      trusted: "is_trusted",
    },
    [TABLE.CONTRIBUTORS_SUBSCRIBERS]: {
      contributor: "contributor_id",
      subscriber: "user_id",
    },
    [TABLE.CONTRIBUTORS]:{
      
    }
  };
  override mainTable: string = TABLE.USERS;
  override defaultLimit: number | null = 20; // Specify default limit here, otherwise it will not be reflected on the query
  override defaultOffset: number | null = 0; // Specify default offset here, otherwise it will not be reflected on the query
  override defaultSelect: Record<string, number> | null; // Specify Default fields for selection here, Otherwise it will select all
  override defaultCondition: Condition; // Specify Default Condition for where clause here, otherwise there will be no condition
  protected defaultOrder: OrderItem[];
  override entityById: number | null = null;
  override associations: Array<AssociationItem> = [
    // Specify associations here, otherwise there will be no join tables
    {
      mainField: "id",
      relatedTable: TABLE.USER_SPECS,
      relatedField: "user_id",
    },
    {
      mainField: "id",
      relatedTable: TABLE.CONTRIBUTORS,
      relatedField: "user_id"
    }
  ];

  constructor(queryParams: QueryParams | null = null) {
    super(queryParams);
  }
}
