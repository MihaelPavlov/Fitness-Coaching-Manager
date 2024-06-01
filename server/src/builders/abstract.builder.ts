import { associationsObj, fieldsMap } from "./utils/fields";
import { AssociationItem, Condition } from "./types/types";
import knex from "./../database/db";

const OPERATIONS: any = {
  EQ: "=",
  NE: "!=",
  LT: "<",
  GT: ">",
};

abstract class AbstractBuilder {
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
    let associationsTables = associationsObj[table];
    let resultObj: any = {};

    for (let associationTable of associationsTables) {
      let fieldsMapObj = fieldsMap[associationTable];

      for (let [key, value] of Object.entries(fieldsMapObj)) {
        if (field === key) {
          resultObj[fieldsMapObj[key]] = associationTable;
        }
      }
    }

    return resultObj;
  }

  private generateFieldString(field: string, fieldMapObj: any, table: string) {
    let resultObj: any = {};

    if (!fieldMapObj.hasOwnProperty(field)) {
      resultObj = this.mapAssociatedField(field, table);

      let [fieldName, tableName] = Object.entries(resultObj)[0];

      return `${tableName}.${fieldName}`;
    }

    resultObj[fieldMapObj[field]] = table;

    let [fieldName, tableName] = Object.entries(resultObj)[0];

    return `${tableName}.${fieldName}`;
  }

  // Statement functions

  // Select query builder
  private makeSelectQuery(
    query: any,
    fields: any,
    fieldMapObj: any,
    table: string
  ) {
    if (fields === undefined) {
      return query.select("*");
    }

    let fieldsInTables = [];

    // Find fields
    for (let [key, value] of Object.entries(fields)) {
      if (value !== 1) continue;

      let resultObj: any = {};

      if (!fieldMapObj.hasOwnProperty(key)) {
        // Field from another table
        if (this.associations.length === 0) continue
        
        resultObj = this.mapAssociatedField(key, table);
        fieldsInTables.push(resultObj);
        continue;
      }

      resultObj[fieldMapObj[key]] = table;
      fieldsInTables.push(resultObj);
    }

    for (let fieldEntry of fieldsInTables) {
      let [fieldName, tableName] = Object.entries(fieldEntry)[0];
      let fieldString = `${tableName}.${fieldName}`;
      query = query.select(fieldString);
    }

    return query;
  }


  // Where clause builder
  private makeWhereClause(
    query: any,
    condition: Condition,
    fieldMapObj: any,
    table: string
  ) {
    if (condition === undefined) {
      return query;
    }

    const conditionType = condition.type;

    // Make where clause for first field
    query = query.where(
      this.generateFieldString(condition.items[0].field, fieldMapObj, table),
      OPERATIONS[condition.items[0].operation],
      condition.items[0].value
    );

    // Loop through every left item with the correct operation
    for (let i = 1; i < condition.items.length; i++) {
      let conditionItem = condition.items[i];
      let itemField = conditionItem["field"];
      let itemOperation = conditionItem["operation"];
      let itemValue = conditionItem["value"];

      if (conditionType === "AND") {
        query = query.andWhere(
          this.generateFieldString(itemField, fieldMapObj, table),
          OPERATIONS[itemOperation],
          itemValue
        );
      } else if (conditionType === "OR") {
        query = query.orWhere(
          this.generateFieldString(itemField, fieldMapObj, table),
          OPERATIONS[itemOperation],
          itemValue
        );
      }
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

export default AbstractBuilder;