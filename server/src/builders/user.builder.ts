import { AssociationItem, Condition, QueryParams } from "./types/types";
import { AbstractBuilder } from "./abstract.builder";

export class UserBuilder extends AbstractBuilder {
  protected fieldsMap: any = {
    users: {
      uid: "id",
      firstName: "first_name",
      lastName: "last_name",
      userName: "username",
      email: "email",
      password: "password",
      profilePicture: "profile_picture_url",
      country: "country",
      userLanguages: "languages",
      phoneNumber: "phone_number",
      userRole: "user_role",
      visible: "visible",
      dateCreated: "date_created",
    },
    user_specs: {
      userId: "user_id",
      sex: "sex",
    }
  };
  override mainTable: string = "users";
  override defaultLimit: number | null = 20; // Specify default limit here, otherwise it will not be reflected on the query
  override defaultOffset: number | null = 0; // Specify default offset here, otherwise it will not be reflected on the query
  override defaultSelect: Record<string, number> | null; // Specify Default fields for selection here, Otherwise it will select all
  override defaultCondition: Condition; // Specify Default Condition for where clause here, otherwise there will be no condition
  override entityById: number | null = null;
  override associations: Array<AssociationItem> = [ // Specify associations here, otherwise there will be no join tables
    {
      mainField: "id",
      relatedTable: "user_specs",
      relatedField: "user_id"
    }
  ]

  constructor(queryParams: QueryParams | null = null) {
    super(queryParams);
  }
}
