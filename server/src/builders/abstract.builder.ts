import { associationsObj, fieldsMap } from "./utils/fields";
import { AssociationItem, Condition } from "./types/types";
import knex from "./../database/db";

const OPERATIONS: any = {
  EQ: "=",
  NE: "!=",
  LT: "<",
  GT: ">",
};

export abstract class AbstractBuilder {
  // Class properties for overriding
  protected table: string;
  protected fieldMapObj: any;
  protected limit: number | null | undefined;
  protected offset: number | null | undefined;
  protected fields: any;
  protected condition: Condition;
  protected id: number | null;
  protected associations: Array<AssociationItem>;

  // Helper functions
  private mapAssociatedField(field: string, table: string) {
    const associationsTables = associationsObj[table];
    for (const associationTable of associationsTables) {
      const fieldsMapObj = fieldsMap[associationTable];
      if (fieldsMapObj.hasOwnProperty(field)) {
        return { [fieldsMapObj[field]]: associationTable };
      }
    }
    return {};
  }

  private generateFieldString(field: string, fieldMapObj: any, table: string) {
    if (!fieldMapObj.hasOwnProperty(field)) {
      const associatedField = this.mapAssociatedField(field, table);
      const [fieldName, tableName] = Object.entries(associatedField)[0];
      return `${tableName}.${fieldName}`;
    }
    return `${table}.${fieldMapObj[field]}`;
  }

  // Statement functions

  // Select query builder
  private makeSelectQuery(
    query: any,
    fields: Record<string, any>,
    fieldMapObj: Record<string, any>,
    table: string
  ): any {
    if (!fields) {
      return query.select("*");
    }
 
    const fieldsInTables = Object.entries(fields)
      .filter(([_, value]) => value === 1)
      .map(([key]) => {
        if (!fieldMapObj.hasOwnProperty(key)) {
          return this.mapAssociatedField(key, table);
        }
        return { [fieldMapObj[key]]: table };
      });
 
    for (const fieldEntry of fieldsInTables) {
      const [fieldName, tableName] = Object.entries(fieldEntry)[0];
      query = query.select(`${tableName}.${fieldName}`);
    }
 
    return query;
  }


  // Where clause builder
  private makeWhereClause(
    query: any,
    condition: Condition,
    fieldMapObj: Record<string, any>,
    table: string
  ): any {
    if (!condition) {
      return query;
    }
 
    query = query.where(
      this.generateFieldString(condition.items[0].field, fieldMapObj, table),
      OPERATIONS[condition.items[0].operation],
      condition.items[0].value
    );
 
    for (let i = 1; i < condition.items.length; i++) {
      const { field, operation, value } = condition.items[i];
      const method = condition.type === "AND" ? "andWhere" : "orWhere";
      query = query[method](
        this.generateFieldString(field, fieldMapObj, table),
        OPERATIONS[operation],
        value
      );
    }
 
    return query;
  }

  // Association (join) query builder
  private makeAssociations(query: any) {
    // If there are not any association tables
    if (this.associations.length === 0) {
      return query;
    }

    for (let associationItem of this.associations) {
      query = query.leftJoin(
        associationItem.relatedTable,
        `${this.table}.${associationItem.mainField}`,
        `${associationItem.relatedTable}.${associationItem.relatedField}`
      );
    }
    return query;
  }


  // Builder main function
  public executeQuery() {
    let query = knex(this.table);

    // Connect to association tables
    query = this.makeAssociations(query);

    // Make the select statement
    query = this.makeSelectQuery(
      query,
      this.fields,
      this.fieldMapObj,
      this.table
    );

    // Check for id, if there is id set it and end the function
    if (this.id !== null) {
      query = query.where("users.id", this.id);
      return query;
    }

    // Make the where clause
    query = this.makeWhereClause(
      query,
      this.condition,
      this.fieldMapObj,
      this.table
    );

    // Set limit and offset
    if (this.limit !== null && this.limit !== undefined) {
      query = query.limit(this.limit);
    }
    if (this.offset !== null && this.offset !== undefined) {
      query = query.offset(this.offset);
    }

    return query;
  }
}