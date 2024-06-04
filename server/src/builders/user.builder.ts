import { fieldsMap } from "./utils/fields";
import { AssociationItem, Condition } from "./types/types";
import { AbstractBuilder } from "./abstract.builder";

export class UserBuilder extends AbstractBuilder {
  override table: string = "users";
  override fieldMapObj: any = fieldsMap[this.table];
  override limit: number | null | undefined = 20; // Specify default limit here, otherwise it will not be reflected on the query
  override offset: number | null | undefined = 0; // Specify default offset here, otherwise it will not be reflected on the query
  override fields: Record<string, number>; // Specify Default fields for selection here, Otherwise it will select all
  override condition: Condition; // Specify Default Condition for where clause here, otherwise there will be no condition
  override id: number | null = null;
  override associations: Array<AssociationItem | undefined> = [ // Specify associations here, otherwise there will be no join tables
    {
      mainField: "id",
      relatedTable: "user_specs",
      relatedField: "user_id"
    }
  ]
}
