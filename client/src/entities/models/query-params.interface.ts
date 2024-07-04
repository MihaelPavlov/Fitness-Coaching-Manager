import { ICondition } from './condition.interface';

export interface IQueryParams {
  limit?: number | null;
  offset?: number | null;
  what: Record<string, number>;
  condition?: ICondition;
  id?: number | null;
}
