import express from "express";
import * as userService from "./../services/user.service";
import { isAuth } from "./../middlewares/auth.middleware";
import { RESPONSE_STATUS } from "../constants/response.constants";
import { PATH } from "../constants/path.constants";
import { inputValidationMiddleware, registrationMiddlware } from "./../middlewares/validation.middleware";
import { createCoachValidators, createUserValidators } from "./../validators/user.validator";
import { UserRoles } from "./../models/enums/user-roles.enum";

const router = express.Router();

router.get(
  PATH.USERS.GET_USER_INFO,
  isAuth,
  async (req: any, res: express.Response) => {
    const user = await userService.getUser({
      what: {
        userName: 1,
      },
      id: req.user.id,
      limit: 20,
      offset: 0,
    });
    const username = user[0].userName;
    res.status(200).json({
      status: RESPONSE_STATUS.SUCCESS,
      data: {
        id: req.user.id,
        username,
        role: req.user.role,
      },
    });
  }
);

router.get(
  PATH.USERS.GET_LIST,
  async (req: express.Request, res: express.Response) => {
    const users = await userService.getUsers(req.body);

    res.status(200).json({
      status: RESPONSE_STATUS.SUCCESS,
      data: {
        users,
      },
    });
  }
);

router.post(
  PATH.USERS.GET_DETAILS,
  async (req: express.Request, res: express.Response) => {
    const user = await userService.getUser(req.body);

    res.status(200).json({
      status: RESPONSE_STATUS.SUCCESS,
      data: user[0]
    });
  }
);

router.post(
  PATH.USERS.REGISTER,
  registrationMiddlware,
  async (req: express.Request, res: express.Response) => {
    try {
      const [accessToken, refreshToken, session] =
        await userService.registerUser(req.body);

      res.status(200).json({
        status: RESPONSE_STATUS.SUCCESS,
        data: {
          session,
          accessToken,
          refreshToken,
        },
      });
    } catch (err) {
      return res.status(400).json({
        status: RESPONSE_STATUS.FAILED,
        data: {
          error: err.message,
        },
      });
    }
  }
);

router.post(
  PATH.USERS.LOGIN,
  async (req: express.Request, res: express.Response) => {
    try {
      const [accessToken, refreshToken, session] = await userService.loginUser(
        req.body
      );

      res.status(200).json({
        status: RESPONSE_STATUS.SUCCESS,
        data: {
          session,
          accessToken,
          refreshToken,
        },
      });
    } catch (err) {
      return res.status(400).json({
        status: RESPONSE_STATUS.FAILED,
        data: {
          error: err.message,
        },
      });
    }
  }
);

router.post(
  PATH.USERS.SUBSCRIBE + "/:contributorId",
  isAuth,
  async (req: any, res: express.Response) => {
    try {
      await userService.subscribeToContributor(req.user.id, req.params.contributorId);

      res.status(200).json({
        status: RESPONSE_STATUS.SUCCESS,
        data: {
          message: "Successfully subscribed."
        }
      })
    } catch (err) {
      res.status(400).json({
        status: RESPONSE_STATUS.FAILED,
        data: {
          error: err.message
        }
      })
    }
  }
)

export default router;
