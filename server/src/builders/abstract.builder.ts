import { associationsObj, fieldsMap } from "./utils/fields";
import { Condition } from "./types/types";

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
  protected limit: number;
  protected offset: number;
  protected fields: any;
  protected condition: Condition;
  protected id: number | null;

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

  // Builder main function
  protected buildQuery(
    query: any,
    fields: any,
    fieldMapObj: any,
    condition: Condition,
    table: string,
    id: any | null,
    limit: number | null | undefined,
    offset: number | null | undefined
  ) {
    query = this.makeSelectQuery(query, fields, fieldMapObj, table);

    if (id !== null) {
      query = query.where("users.id", id);
      return query;
    }

    query = this.makeWhereClause(query, condition, fieldMapObj, table);
    query = query.limit(limit);
    query = query.offset(offset);

    return query;
  }
}

export default AbstractBuilder;