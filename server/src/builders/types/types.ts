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
