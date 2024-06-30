import { IConditionItem } from './condition-item.interface';

export interface ICondition {
  type: string;
  items: Array<IConditionItem>;
}
