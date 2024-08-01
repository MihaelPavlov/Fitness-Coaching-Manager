export interface ChatMessage {
  id: number;
  chat_id: number;
  senderId: number;
  text: string;
  dateCreated: Date;
}
