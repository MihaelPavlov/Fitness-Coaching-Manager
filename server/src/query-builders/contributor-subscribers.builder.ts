import {
  AssociationItem,
  Condition,
  OrderItem,
  QueryParams,
} from "./models/builder.models";
import { AbstractBuilder } from "./common/abstract.builder";
import { TABLE } from "../database/constants/tables.constant";

export class ContributorSubscribersBuilder extends AbstractBuilder {
  override fieldsMap: Record<string, Record<string, string>> = {
    [TABLE.CONTRIBUTORS_SUBSCRIBERS]: {
      contributor: "contributor_id",
      subscriber: "user_id",
    },
  };
  override mainTable: string = TABLE.CONTRIBUTORS_SUBSCRIBERS;
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
