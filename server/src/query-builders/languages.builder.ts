import {
  AssociationItem,
  Condition,
  OrderItem,
  QueryParams,
} from "./models/builder.models";
import { AbstractBuilder } from "./common/abstract.builder";
import { TABLE } from "../database/constants/tables.constant";

export class LanguagesBuilder extends AbstractBuilder {
  override fieldsMap: Record<string, Record<string, string>> = {
    [TABLE.SUPPORTED_LANGUAGES]: {
      uid: "id",
      language: "language",
      code: "code",
      local: "local",
    },
  };

  protected override mainTable: string = TABLE.SUPPORTED_LANGUAGES;
  protected override defaultLimit: number;
  protected override defaultOffset: number;
  protected override defaultSelect: Record<string, number>;
  protected override defaultCondition: Condition;
  protected override defaultOrder: OrderItem[];
  protected override entityById: number;
  protected override associations: Array<AssociationItem> = [];

  constructor(queryParams: QueryParams | null = null) {
    super(queryParams);
  }
}
