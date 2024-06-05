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

  // Initialize class instance and get the request body as queryParams and pass it to the default properties
  constructor(queryParams: QueryParams | null = null) {
    this.defaultLimit = queryParams.limit ?? this.defaultLimit;
    this.defaultOffset = queryParams.offset ?? this.defaultOffset;
    this.defaultSelect = queryParams.what ?? this.defaultSelect;
    this.defaultCondition = queryParams.condition ?? this.defaultCondition;
  }

  /******************/
  // Helper functions
  /******************/

  // Return all tables associated to the current one
  private getAssociationTables(): Array<string> {
    return this.associations.map(x => x.relatedTable);
  }

  // Return object with key equal to the field name, and value equal to the associated table where it is located
  private getRelatedTableField(field: string): Record<string, string> {
    // Get all associated tables
    const associationsTables = this.getAssociationTables();
    // Loop through them
    for (const associationTable of associationsTables) {
      // Get the fieldsMap object for the current associated table
      // And find where the field from the input is located
      // And return Object - key = field, value = associated table
      const fieldsMapObj = this.fieldsMap[associationTable];
      if (field in fieldsMapObj) {
        return { [fieldsMapObj[field]]: associationTable };
      }
    }
    return {}; // If the field is not found in any associated tables return empty object
  }

  // Function for mapping a field to string that contains the table and field name for knex query logic
  private resolveFieldReference(field: string, table: string): string {
    // If field is not part of the main table,
    // Find from which associated table is and structure it for knex
    if (!(field in this.fieldsMap[table])) {
      const associatedField = this.getRelatedTableField(field); // Find the associated table - { fieldName: associatedTable }
      const [fieldName, tableName] = Object.entries(associatedField)[0];
      return `${tableName}.${fieldName}`;
    }
    // If it is part of the main table, structure it and return it
    return `${table}.${this.fieldsMap[table][field]}`;
  }

  // Function for reversing the model's fields map
  private reverseFieldsMap(): Record<string, Record<string, string>> {
    let reversedFieldsMap: Record<string, Record<string, string>> = {}

    for (let table of Object.keys(this.fieldsMap)) { // Loop through each table of the model - main table + associated tables
      reversedFieldsMap[table] = {} // Create key with empty object for each table

      for (let [key, value] of Object.entries(this.fieldsMap[table])) { // Loop through each fields in each table
        reversedFieldsMap[table][value as string] = key; // Add each field's value to be key, and each field's key to be value to the current table
      }
    }

    return reversedFieldsMap;
  }

  /*********************/
  // Statement functions
  /*********************/

  // Select query builder
  private buildSelectClause(
    query: Knex.QueryBuilder,
    fields: Record<string, any>,
    fieldsMap: Record<string, any>,
    table: string
  ): Knex.QueryBuilder {
    if (!fields) { // Check if the input is provided with fields, if not select all and end the function
      return query.select("*");
    }
 
    // Loop through each fields
    const fieldsInTables = Object.entries(fields)
      .filter(([_, value]) => value === 1) // Leave only the fields that has value '1' - true
      .map(([key]) => { // Map each field and make an object containing the field as key and table from where is the field as value
        if (!(key in fieldsMap)) {
          return this.getRelatedTableField(key);
        }
        return { [fieldsMap[key]]: table };
      });
 
    for (const fieldEntry of fieldsInTables) { // Loop through each field object 
      // Get the field name and its table.
      const [fieldName, tableName] = Object.entries(fieldEntry)[0];
      // Make different select statement for each field formatted for knex
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
    if (!condition) { // If there is no condition provided, don't manipulate the query, return it and end the function
      return query;
    }
 
    // Get the first condition item and make normal where clause
    query = query.where(
      this.resolveFieldReference(condition.items[0].field, table), // Get `table`.`field` format string as first argument
      Operations[condition.items[0].operation as keyof typeof Operations], // Get chosen operation as second argument e.g (GT = >)
      condition.items[0].value // Get the value for checking
    );
 
    for (let i = 1; i < condition.items.length; i++) { // Loop through the other items after the first one
      const { field, operation, value } = condition.items[i]; // Destructure the item object to get the field, operator and value
      const method = condition.type === OperationTypes.AND ? "andWhere" : "orWhere"; // Get the method which we will stack on the query
      query = query[method](
        this.resolveFieldReference(field, table), // `table`.`field`
        Operations[operation as keyof typeof Operations], // e.g (GT = >)
        value
      ); // Update the query
    }
 
    return query;
  }

  // Association (join) query builder
  private buildAssociations(query: Knex.QueryBuilder): Knex.QueryBuilder {
    // If there are not any association tables, don't manipulate the query and end the function
    if (this.associations.length === 0) {
      return query;
    }

    for (let associationItem of this.associations) { // Loop through each association object and create leftJoin statement with it
      query = query.leftJoin(
        associationItem.relatedTable, // Associated table
        `${this.mainTable}.${associationItem.mainField}`, // `mainTable`.`mainField`
        `${associationItem.relatedTable}.${associationItem.relatedField}` // `relatedTable`.`relatedField`
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

  // Function for mapping the response objects to not expose the original fields names
  private mapResponseFields(response: Array<Record<string, string>>): Array<Record<string, any>> {
    const reversedFieldsMap = this.reverseFieldsMap(); // Get the reversed fields map
    const mappedResponse = response.map(row => { // Loop through each row of the response array
      const resultRow: Record<string, string> = {}; // Create empty result object for mapping

      for (const [fieldName, fieldValue] of Object.entries(row)) { // Loop through each field name and field value of the current row

        // Loop through each table in the reversed fields map of the model in order to find
        // where a current field is located
        for (const table in reversedFieldsMap) { 
          // If the field is located in the current table
          // Create object with the 'fake' fieldName from the reversed fieldsMap and the original field value
          if (reversedFieldsMap[table][fieldName]) {
            resultRow[reversedFieldsMap[table][fieldName]] = fieldValue;
          }
        }
      }

      // Return the result row to manipulate the array
      return resultRow;
    });

    return mappedResponse;
  }

  // Builder main function
  public async buildQuery(): Promise<Array<Record<string, any>>> {
    return this.mapResponseFields(await this.prepareQuery());
  }
}