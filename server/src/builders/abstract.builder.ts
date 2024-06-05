import { AssociationItem, Condition, Operations, OperationTypes, OrderItem, QueryParams } from "./types/types";
import knex from "./../database/db";
import { Knex } from "knex";

export abstract class AbstractBuilder {
  // Class properties for overriding
  protected abstract fieldsMap: Record<string, Record<string, string>>;
  protected mainTable: string;
  protected defaultLimit: number | null = 20;
  protected defaultOffset: number | null = 0;
  protected defaultSelect: Record<string, number> | null;
  protected defaultCondition: Condition;
  protected defaultOrder: Array<OrderItem> | null;
  protected entityById: number | null;
  protected associations: Array<AssociationItem>;

  constructor(queryParams: QueryParams | null = null) {
    this.defaultLimit = queryParams.limit ?? this.defaultLimit;
    this.defaultOffset = queryParams.offset ?? this.defaultOffset;
    this.defaultSelect = queryParams.what ?? this.defaultSelect;
    this.defaultCondition = queryParams.condition ?? this.defaultCondition;
  }

  // Helper functions

  private getAssociationTables(): Array<string> {
    return this.associations.map(x => x.relatedTable);
  }

  private getRelatedTableField(field: string): Record<string, string> {
    const associationsTables = this.getAssociationTables();
    for (const associationTable of associationsTables) {
      const fieldsMapObj = this.fieldsMap[associationTable];
      if (field in fieldsMapObj) {
        return { [fieldsMapObj[field]]: associationTable };
      }
    }
    return {};
  }

  private resolveFieldReference(field: string, table: string): string {
    if (!(field in this.fieldsMap[table])) {
      const associatedField = this.getRelatedTableField(field);
      const [fieldName, tableName] = Object.entries(associatedField)[0];
      return `${tableName}.${fieldName}`;
    }
    return `${table}.${this.fieldsMap[table][field]}`;
  }

  private reverseFieldsMap(): Record<string, Record<string, string>> {
    let reversedFieldsMap: Record<string, Record<string, string>> = {}

    for (let table of Object.keys(this.fieldsMap)) {
      reversedFieldsMap[table] = {}

      for (let [key, value] of Object.entries(this.fieldsMap[table])) {
        reversedFieldsMap[table][value as string] = key;
      }
    }

    return reversedFieldsMap;
  }

  // Statement functions

  // Select query builder
  private buildSelectClause(
    query: Knex.QueryBuilder,
    fields: Record<string, any>,
    fieldsMap: Record<string, any>,
    table: string
  ): Knex.QueryBuilder {
    if (!fields) {
      return query.select("*");
    }
 
    const fieldsInTables = Object.entries(fields)
      .filter(([_, value]) => value === 1)
      .map(([key]) => {
        if (!(key in fieldsMap)) {
          return this.getRelatedTableField(key);
        }
        return { [fieldsMap[key]]: table };
      });
 
    for (const fieldEntry of fieldsInTables) {
      const [fieldName, tableName] = Object.entries(fieldEntry)[0];
      query = query.select(`${tableName}.${fieldName}`);
    }
 
    return query;
  }


  // Where clause builder
  private buildWhereClause(
    query: Knex.QueryBuilder,
    condition: Condition,
    table: string
  ): Knex.QueryBuilder {
    if (!condition) {
      return query;
    }
 
    query = query.where(
      this.resolveFieldReference(condition.items[0].field, table),
      Operations[condition.items[0].operation as keyof typeof Operations],
      condition.items[0].value
    );
 
    for (let i = 1; i < condition.items.length; i++) {
      const { field, operation, value } = condition.items[i];
      const method = condition.type === OperationTypes.AND ? "andWhere" : "orWhere";
      query = query[method](
        this.resolveFieldReference(field, table),
        Operations[operation as keyof typeof Operations],
        value
      );
    }
 
    return query;
  }

  // Association (join) query builder
  private buildAssociations(query: Knex.QueryBuilder): Knex.QueryBuilder {
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

  private buildLimitClause(query: Knex.QueryBuilder): Knex.QueryBuilder {
    return this.defaultLimit ? query.limit(this.defaultLimit) : query;
  }

  private buildOffsetClause(query: Knex.QueryBuilder): Knex.QueryBuilder {
    return this.defaultOffset ? query.offset(this.defaultOffset) : query;
  }

  private getEntityById(query: Knex.QueryBuilder): Knex.QueryBuilder {
    return query.where(`${this.mainTable}.id`, this.entityById);
  }


  // Preparing query
  private prepareQuery(): Knex.QueryBuilder {
    let query = knex(this.mainTable);
    
    // Connect to association tables
    query = this.buildAssociations(query);

    // Make the select statement
    query = this.buildSelectClause(
      query,
      this.defaultSelect,
      this.fieldsMap[this.mainTable],
      this.mainTable
    );

    // Check for id, if there is id set it and end the function
    if (this.entityById) {
      return this.getEntityById(query);
    }

    // Make the where clause
    query = this.buildWhereClause(
      query,
      this.defaultCondition,
      this.mainTable
    );

    // Set limit and offset
    query = this.buildLimitClause(query);
    query = this.buildOffsetClause(query);

    return query;
  }

  private mapResponseFields(response: Array<Record<string, string>>) {
    const reversedFieldsMap = this.reverseFieldsMap();
    const mappedResponse = response.map(row => {
      const resultRow: Record<string, string> = {};

      for (const [fieldName, fieldValue] of Object.entries(row)) {

        for (const table in reversedFieldsMap) {
          if (reversedFieldsMap[table][fieldName]) {
            resultRow[reversedFieldsMap[table][fieldName]] = fieldValue;
          }
        }
      }

      return resultRow;
    });

    return mappedResponse;
  }

  // Builder main function
  public async buildQuery() {
    return this.mapResponseFields(await this.prepareQuery());
  }
}