import {
  AssociationItem,
  Condition,
  OrderItem,
  QueryParams,
} from "./models/builder.models";
import { AbstractBuilder } from "./common/abstract.builder";
import { TABLE } from "../database/constants/tables.constant";

export class ContributorBuilder extends AbstractBuilder {
  override fieldsMap: Record<string, Record<string, string>> = {
    [TABLE.CONTRIBUTORS]: {
      contributorId: "id",
      userId: "user_id",
      dateOfApproval: "approval_date",
      summary: "summary",
      rating: "rating",
      trusted: "is_trusted",
    },
  };
  override mainTable: string = TABLE.CONTRIBUTORS;
  override defaultLimit: number | null = 20; // Specify default limit here, otherwise it will not be reflected on the query
  override defaultOffset: number | null = 0; // Specify default offset here, otherwise it will not be reflected on the query
  override defaultSelect: Record<string, number> | null; // Specify Default fields for selection here, Otherwise it will select all
  override defaultCondition: Condition; // Specify Default Condition for where clause here, otherwise there will be no condition
  protected defaultOrder: OrderItem[];
  override entityById: number | null = null;
  override associations: Array<AssociationItem> = [
    // Specify associations here, otherwise there will be no join tables
  ];

  constructor(queryParams: QueryParams | null = null) {
    super(queryParams);
  }
}
