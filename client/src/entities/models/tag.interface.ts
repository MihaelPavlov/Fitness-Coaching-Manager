import { ListItem } from "ng-multiselect-dropdown/multiselect.model";

export interface Tag extends ListItem {
  uid?: number;
  name?: string
}
