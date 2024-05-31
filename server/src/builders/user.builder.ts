import knex from "./../database/db";
import AbstractBuilder from "./abstract.builder";
import { fieldsMap } from "./utils/fields";
import { Condition } from "./types/types";

class UserBuilder extends AbstractBuilder {
  override table: string = "users";
  override fieldMapObj: any = fieldsMap[this.table];
  override limit: number = 20;
  override offset: number = 0;
  override fields: any; // Specify Default fields for selection here, Otherwise it will select all
  override condition: Condition; // Specify Default Condition for where clause here, otherwise there will be no condition
  override id: any = null; 

  public executeQuery(): any {
    // Create main query object
    // And join all association tables and fields here
    let query = knex("users").leftJoin(
      "user_specs",
      "users.id",
      "user_specs.user_id"
    );
    return this.buildQuery(
      query,
      this.fields,
      this.fieldMapObj,
      this.condition,
      this.table,
      this.id,
      this.limit,
      this.offset
    );
  }
}

export default UserBuilder;