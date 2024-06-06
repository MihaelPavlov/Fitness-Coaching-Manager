import {
  AssociationItem,
  Condition,
  Operations,
  OperationTypes,
  OrderItem,
  QueryParams,
} from "../models/builder.models";
import knex from "../../database/db";
import { Knex } from "knex";

/**
 * The `AbstractBuilder` class serves as a blueprint for creating dynamic SQL queries using the `knex` query builder.
 * This class includes various functionalities such as selecting fields, applying conditions, joining related tables,
 * and setting limits and offsets for queries. Additionally, it provides mechanisms for mapping response fields to
 * their original names. The class is designed to be extended by subclasses which will define specific implementations
 * for the abstract properties and methods.
 *
 * Key Functionalities:
 * - Building SELECT, WHERE, JOIN, LIMIT, and OFFSET clauses.
 * - Handling associations between tables.
 * - Mapping query results to original field names.
 * - Dynamically adjusting query parameters based on input.
 */
export abstract class AbstractBuilder {
  // Abstract class properties to be overridden by subclasses

  /**
   * Maps fields in tables to their respective names.
   * This is an abstract property that must be defined by subclasses.
   */
  protected abstract fieldsMap: Record<string, Record<string, string>>;
  protected mainTable: string;
  protected defaultLimit: number | null = 20;
  protected defaultOffset: number | null = 0;
  protected defaultSelect: Record<string, number> | null;
  protected defaultCondition: Condition;
  protected defaultOrder: Array<OrderItem> | null;

  /**
   * ID of a specific entity to fetch.
   */
  protected entityById: number | null;

  /**
   * List of associations (related tables) to include in the query.
   */
  protected associations: Array<AssociationItem>;

  /**
   * Constructor to initialize the builder with optional query parameters.
   *
   * @param queryParams - Optional query parameters for initializing default values.
   */
  constructor(queryParams: QueryParams | null = null) {
    this.defaultLimit = queryParams.limit ?? this.defaultLimit;
    this.defaultOffset = queryParams.offset ?? this.defaultOffset;
    this.defaultSelect = queryParams.what ?? this.defaultSelect;
    this.defaultCondition = queryParams.condition ?? this.defaultCondition;
  }

  /**
   * Main function to build and execute the SQL query, then map the response fields.
   *
   * @returns A promise that resolves to the array of records with mapped field names.
   */
  public async buildQuery(): Promise<Array<Record<string, any>>> {
    return this.mapResponseFields(await this.prepareQuery());
  }

  /**
   * Prepare the complete SQL query by chaining various clauses.
   *
   * @returns The complete knex query builder instance.
   */
  private prepareQuery(): Knex.QueryBuilder {
    let query = knex(this.mainTable);

    query = this.buildAssociations(query);

    query = this.buildSelectClause(
      query,
      this.defaultSelect,
      this.fieldsMap[this.mainTable],
      this.mainTable
    );

    if (this.entityById) {
      return this.getEntityById(query);
    }

    query = this.buildWhereClause(query, this.defaultCondition, this.mainTable);

    query = this.buildLimitClause(query);
    query = this.buildOffsetClause(query);

    return query;
  }

  /*********************/
  // Statement functions
  /*********************/

  /**
   * Build the SELECT clause of the SQL query.
   *
   * @param query - The knex query builder instance.
   * @param fields - The fields to select.
   * @param fieldsMap - The fields map for the main table.
   * @param table - The main table name.
   * @returns The query builder instance with the SELECT clause.
   */
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

  /**
   * Build the WHERE clause of the SQL query.
   *
   * @param query - The knex query builder instance.
   * @param condition - The conditions to apply in the WHERE clause.
   * @param table - The main table name.
   * @returns The query builder instance with the WHERE clause.
   */
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
      const method =
        condition.type === OperationTypes.AND ? "andWhere" : "orWhere";
      query = query[method](
        this.resolveFieldReference(field, table),
        Operations[operation as keyof typeof Operations],
        value
      );
    }

    return query;
  }

  /**
   * Build the JOIN clauses to associate related tables in the SQL query.
   *
   * @param query - The knex query builder instance.
   * @returns The query builder instance with the JOIN clauses.
   */
  private buildAssociations(query: Knex.QueryBuilder): Knex.QueryBuilder {
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

  /**
   * Build the LIMIT clause of the SQL query.
   *
   * @param query - The knex query builder instance.
   * @returns The query builder instance with the LIMIT clause.
   */
  private buildLimitClause(query: Knex.QueryBuilder): Knex.QueryBuilder {
    return this.defaultLimit ? query.limit(this.defaultLimit) : query;
  }

  /**
   * Build the OFFSET clause of the SQL query.
   *
   * @param query - The knex query builder instance.
   * @returns The query builder instance with the OFFSET clause.
   */
  private buildOffsetClause(query: Knex.QueryBuilder): Knex.QueryBuilder {
    return this.defaultOffset ? query.offset(this.defaultOffset) : query;
  }

  /**
   * Add a WHERE clause to get a specific entity by its ID.
   *
   * @param query - The knex query builder instance.
   * @returns The query builder instance with the WHERE clause for entity by ID.
   */
  private getEntityById(query: Knex.QueryBuilder): Knex.QueryBuilder {
    return query.where(`${this.mainTable}.id`, this.entityById);
  }

  /******************/
  // Helper functions
  /******************/

  /**
   * Get all related tables associated with the main table.
   *
   * @returns An array of related table names.
   */
  private getAssociationTables(): Array<string> {
    return this.associations.map((x) => x.relatedTable);
  }

  /**
   * Get the related table and field for a given field.
   *
   * @param field - The field to find the related table and field for.
   * @returns An object with the related table and field.
   */
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

  /**
   * Resolve the full field reference including the table name for the query.
   *
   * @param field - The field to resolve.
   * @param table - The table to which the field belongs.
   * @returns The resolved field reference.
   */
  private resolveFieldReference(field: string, table: string): string {
    if (!(field in this.fieldsMap[table])) {
      const associatedField = this.getRelatedTableField(field); // Find the associated table - { fieldName: associatedTable }
      const [fieldName, tableName] = Object.entries(associatedField)[0];
      return `${tableName}.${fieldName}`;
    }

    return `${table}.${this.fieldsMap[table][field]}`;
  }

  /**
   * Map the response fields to their original names based on the fields map.
   *
   * @param response - The response array of records from the database.
   * @returns The array of records with mapped field names.
   */
  private mapResponseFields(
    response: Array<Record<string, string>>
  ): Array<Record<string, any>> {
    const reversedFieldsMap = this.reverseFieldsMap();
    const mappedResponse = response.map((row) => {
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

  /**
   * Reverse the fields map for easier mapping of response fields.
   *
   * @returns A reversed fields map.
   */
  private reverseFieldsMap(): Record<string, Record<string, string>> {
    let reversedFieldsMap: Record<string, Record<string, string>> = {};

    for (let table of Object.keys(this.fieldsMap)) {
      reversedFieldsMap[table] = {};

      for (let [key, value] of Object.entries(this.fieldsMap[table])) {
        reversedFieldsMap[table][value as string] = key;
      }
    }

    return reversedFieldsMap;
  }
}
