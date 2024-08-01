// import { TABLE } from "../database/constants/tables.constant";
// import { AbstractBuilder } from "./common/abstract.builder";
// import {
//   AssociationItem,
//   Condition,
//   OrderItem,
//   QueryParams,
// } from "./models/builder.models";

// export class ChatBuilder extends AbstractBuilder {
//   override fieldsMap: Record<string, Record<string, string>> = {
//     [TABLE.CHATS]: {
//       uid: "id",
//       initiatorUserId: "initiator_user_id",
//       recipientUserId: "recipient_user_id",
//     },
//   };
//   override mainTable: string = TABLE.CHATS;
//   override defaultLimit: number | null = 20; // Specify default limit here, otherwise it will not be reflected on the query
//   override defaultOffset: number | null = 0; // Specify default offset here, otherwise it will not be reflected on the query
//   override defaultSelect: Record<string, number> | null; // Specify Default fields for selection here, Otherwise it will select all
//   override defaultCondition: Condition; // Specify Default Condition for where clause here, otherwise there will be no condition
//   protected defaultOrder: OrderItem[];
//   override entityById: number | null = null;
//   override associations: Array<AssociationItem> = [
//     {
//       mainField: "initiator_user_id",
//       relatedTable: TABLE.USERS,
//       relatedField: "user_id",
//     }
//   ];

//   constructor(queryParams: QueryParams | null = null) {
//     super(queryParams);
//   }
// }
