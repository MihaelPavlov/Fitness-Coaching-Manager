import { associationsObj } from "./utils/fields";
import { AssociationItem, Condition, OPERATIONS, OPERATION_TYPES, OrderItem } from "./types/types";
import knex from "./../database/db";

export abstract class AbstractBuilder {
  // Class properties for overriding
  protected abstract fieldsMap: any;
  protected mainTable: string;
  protected defaultLimit: number | null | undefined = 20;
  protected defaultOffset: number | null | undefined = 0;
  protected defaultSelect: Record<string, number> | null | undefined;
  protected defaultCondition: Condition;
  protected defaultOrder: Array<OrderItem> | null | undefined;
  protected entityById: number | null | undefined;
  protected associations: Array<AssociationItem>;

  // Helper functions
  private mapAssociatedField(field: string, table: string) {
    const associationsTables = associationsObj[table];
    for (const associationTable of associationsTables) {
      const fieldsMapObj = this.fieldsMap[associationTable];
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
      OPERATIONS[condition.items[0].operation as keyof typeof OPERATIONS],
      condition.items[0].value
    );
 
    for (let i = 1; i < condition.items.length; i++) {
      const { field, operation, value } = condition.items[i];
      const method = condition.type === OPERATION_TYPES.AND ? "andWhere" : "orWhere";
      query = query[method](
        this.generateFieldString(field, fieldMapObj, table),
        OPERATIONS[operation as keyof typeof OPERATIONS],
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
        `${this.mainTable}.${associationItem.mainField}`,
        `${associationItem.relatedTable}.${associationItem.relatedField}`
      );
    }
    return query;
  }


  // Builder main function
  public executeQuery() {
    let query = knex(this.mainTable);

    // Connect to association tables
    query = this.makeAssociations(query);

    // Make the select statement
    query = this.makeSelectQuery(
      query,
      this.defaultSelect,
      this.fieldsMap[this.mainTable],
      this.mainTable
    );

    // Check for id, if there is id set it and end the function
    if (this.entityById !== null) {
      query = query.where(`${this.mainTable}.id`, this.entityById);
      return query;
    }

    // Make the where clause
    query = this.makeWhereClause(
      query,
      this.defaultCondition,
      this.fieldsMap[this.mainTable],
      this.mainTable
    );

    // Set limit and offset
    if (this.defaultLimit !== null && this.defaultLimit !== undefined) {
      query = query.limit(this.defaultLimit);
    }
    if (this.defaultOffset !== null && this.defaultOffset !== undefined) {
      query = query.offset(this.defaultOffset);
    }

    return query;
  }
}