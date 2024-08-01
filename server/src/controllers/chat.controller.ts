import express from "express";
import * as chatService from "./../services/chat.service";
import { isCoach } from "./../middlewares/auth.middleware";
import { RESPONSE_STATUS } from "../constants/response.constants";
import { PATH } from "../constants/path.constants";
import { QueryParams } from "../query-builders/models/builder.models";

const router = express.Router();

router.get(
  PATH.CHAT.GET_USER_CHATS,
  async (req: any, res: express.Response) => {
    if (req.user) {
      const chats = await chatService.getUserChats(req.user);
      res.status(200).json({
        status: RESPONSE_STATUS.SUCCESS,
        data: chats,
      });
    }
  }
);

router.get(PATH.CHAT.GET_CHAT, async (req: any, res: express.Response) => {
  const chat = await chatService.getChat(req.body);
  res.status(200).json({
    status: RESPONSE_STATUS.SUCCESS,
    data: chat,
  });
});

router.post(
  PATH.CHAT.CREATE,
  //   isCoach,
  async (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    try {
      const createdChatID = await chatService.addChat(req.body);
      res.status(201).json({
        status: RESPONSE_STATUS.SUCCESS,
        data: createdChatID,
      });
    } catch (error) {
      next(error);
    }
  }
);

router.post(
  PATH.CHAT.CREATE_MESSAGE,
  async (
    req: any,
    res: express.Response,
    next: express.NextFunction
  ) => {
    try {
        if (req.user) {
        const message = await chatService.createMessage(
          req.body,
          req.user
        );
        res.status(201).json({
          status: RESPONSE_STATUS.SUCCESS,
          data: message,
        });
      }
      } catch (error) {
        next(error);
      }
    }
);

router.get(
  PATH.CHAT.GET_MESSAGES + "/:chatId",
  async (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    try {
      const messages = await chatService.getMessages(req.params);
      res.status(201).json({
        status: RESPONSE_STATUS.SUCCESS,
        data: messages,
      });
    } catch (error) {
      next(error);
    }
  }
);

export default router;
