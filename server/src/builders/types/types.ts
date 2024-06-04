export interface QueryParams {
  limit: number | null | undefined;
  offset: number | null | undefined;
  what: Record<string, number>;
  condition: Condition,
  id: number | null | undefined
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
  direction: ORDER_DIRECTION
}

export enum ORDER_DIRECTION {
  ASC = "ASC",
  DESC = "DESC"
}

export enum OPERATIONS {
  EQ = "=",
  NE = "!=",
  LT = "<",
  GT = ">",
}

export enum OPERATION_TYPES {
  AND = "AND",
  OR = "OR"
}