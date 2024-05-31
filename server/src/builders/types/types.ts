export interface QueryParams {
  limit: number | null | undefined;
  offset: number | null | undefined;
  what: Record<string, number> | null | undefined;
  condition: Condition | null | undefined;
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
