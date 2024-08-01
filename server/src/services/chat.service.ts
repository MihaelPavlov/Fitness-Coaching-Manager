import { QueryParams } from "../query-builders/models/builder.models";
import { TABLE } from "../database/constants/tables.constant";
import db from "../database/database-connector";

export const addChat = async (chatData: any) => {
  const currentDate = new Date().toISOString().split("T")[0];
  const createdChatID = (
    await db(TABLE.CHATS).insert({
      initiator_user_id: chatData.initiatorUserId,
      recipient_user_id: chatData.recipientUserId,
      date_created: currentDate,
    })
  ).at(0);

  return createdChatID;
};

export const getUserChats = async (user: any) => {
  console.log(user);

  const { id, role } = user;

  const chats = await db(TABLE.CHATS)
    .join(TABLE.USERS, function () {
      if (role === 1) {
        this.on("chats.initiator_user_id", "=", "users.id");
      } else {
        this.on("chats.recipient_user_id", "=", "users.id");
      }
    })
    .select(
      "chats.id",
      "chats.initiator_user_id as initiatorUserId",
      "chats.recipient_user_id as recipientUserId"
    )
    .where(function () {
      if (role === 1) {
        this.where("chats.initiator_user_id", id);
      } else {
        this.where("chats.recipient_user_id", id);
      }
      this.andWhere("is_active", 1)
    });

  return chats;
};

export const getChat = async (chatData: any) => {
  const { initiatorUserId, recipientUserId } = chatData;

  const chat = await db(TABLE.CHATS)
    .select("id", "initiator_user_id", "recipient_user_id")
    .where("initiator_user_id", initiatorUserId)
    .andWhere("recipient_user_id", recipientUserId);

  return chat;
};

export const createMessage = async (messageData: any, user: any) => {
  const { chatId, text } = messageData;
  const currentDate = new Date(Date.now()).toISOString().split("T");
  const createdChatID = (
    await db(TABLE.CHAT_MESSAGES).insert({
      chat_id: chatId,
      sender_id: user.id,
      text: text,
      date_created: `${currentDate[0]} ${currentDate[1].split(".")[0]}`,
    })
  ).at(0);

  const message = await db(TABLE.CHAT_MESSAGES)
    .select(
      "id",
      "chat_id as chatId",
      "sender_id as senderId",
      "text",
      "date_created as dateCreated"
    )
    .where("id", createdChatID)
    .first();
  return message;
};

export const getMessages = async (messageData: any) => {
  const { chatId } = messageData;

  const messages = await db(TABLE.CHAT_MESSAGES)
    .select(
      "id",
      "chat_id as chatId",
      "sender_id as senderId",
      "text",
      "date_created as dateCreated"
    )
    .where("chat_id", chatId)
    .orderBy("date_created", "asc");

  return messages;
};
