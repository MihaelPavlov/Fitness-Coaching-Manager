export interface QueryParams {
  limit?: number | null;
  offset?: number | null;
  what?: Record<string, number>;
  condition?: Condition,
  order?: Array<OrderItem>,
  id?: number | null
}

export interface Condition {
  type: string;
  items: Array<ConditionItem>;
}

export interface ConditionItem {
  field: string;
  operation: string;
  value: any;
}

export interface AssociationItem {
  mainField: string;
  relatedTable: string;
  relatedField: string;
}

export interface OrderItem {
  field: string;
  direction: OrderDirection
}

export enum OrderDirection {
  ASC = "ASC",
  DESC = "DESC"
}

export enum Operations {
  EQ = "=",
  NE = "!=",
  LT = "<",
  GT = ">",
}

export enum OperationTypes {
  AND = "AND",
  OR = "OR"
}