import { ICondition } from './condition.interface';
import { OrderItem } from './order-item.interface';

export interface IQueryParams {
  limit?: number | null;
  offset?: number | null;
  what: Record<string, number>;
  condition?: ICondition;
  order?: Array<OrderItem>;
  id?: number | null;
}
