import express, { NextFunction } from "express";
import * as userService from "./../services/user.service";
import { isAuth } from "./../middlewares/auth.middleware";
import { RESPONSE_STATUS } from "../constants/response.constants";
import { PATH } from "../constants/path.constants";
import {
  fileSizeValidationMiddleware,
  inputValidationMiddleware,
  registrationMiddlware,
} from "./../middlewares/validation.middleware";
import { updateUserValidators } from "./../validators/user.validator";
import { UserRoles } from "./../models/enums/user-roles.enum";
import { getContributorId } from "./../services/contributor.service";
import upload from "./../config/file-upload.config";
import {
  isFileImageMiddleware,
  registrationFileValidationMiddleware,
} from "./../middlewares/file-uploads.middleware";
import { asyncHandler } from "../middlewares/error.middleware";

const router = express.Router();

router.get(
  PATH.USERS.GET_USER_INFO,
  isAuth,
  async (req: any, res: express.Response) => {
    try {
      const user = await userService.getUser({
        what: {
          userName: 1,
          contributorId: 1,
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
          contributorId: user[0].contributorId,
          role: req.user.role,
        },
      });
    } catch (err) {
      res.status(400).json({
        status: RESPONSE_STATUS.FAILED,
        data: {
          message: err.message,
        },
      });
    }
  }
);

router.post(
  PATH.USERS.GET_LIST,
  async (req: express.Request, res: express.Response) => {
    const users = await userService.getUsers(req.body);

    res.status(200).json({
      status: RESPONSE_STATUS.SUCCESS,
      data: users,
    });
  }
);

router.post(
  PATH.USERS.GET_DETAILS,
  async (req: express.Request, res: express.Response) => {
    const user = await userService.getUser(req.body);

    res.status(200).json({
      status: RESPONSE_STATUS.SUCCESS,
      data: user[0],
    });
  }
);

router.post(
  PATH.USERS.REGISTER,
  upload.array("files"),
  registrationFileValidationMiddleware,
  registrationMiddlware,
  asyncHandler(
    async (req: express.Request, res: express.Response, next: NextFunction) => {
      console.log("register");
      const [accessToken, refreshToken, session] =
        await userService.registerUser(req.body, req.files);

      res.status(200).json({
        status: RESPONSE_STATUS.SUCCESS,
        data: {
          session,
          accessToken,
          refreshToken,
        },
      });
    }
  )
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
  PATH.USERS.LOGOUT,
  isAuth,
  async (req: any, res: express.Response, next: express.NextFunction) => {
    try {
      userService.logoutUser(req.user.sessionId, req.get("accessToken"));

      res.status(204).end();
    } catch (error) {
      next(error);
    }
  }
);

router.put(
  PATH.USERS.UPDATE,
  isAuth,
  upload.single("profilePicture"),
  fileSizeValidationMiddleware,
  isFileImageMiddleware,
  inputValidationMiddleware(updateUserValidators),
  asyncHandler(async (req: any, res: express.Response) => {
    await userService.updateUser(req.user.id, req.body, req.file);

    res.status(200).json({
      status: RESPONSE_STATUS.SUCCESS,
      data: {
        message: "Successfully updated user!",
      },
    });
  })
);

router.post(
  PATH.USERS.SUBSCRIBE + "/:contributorId",
  isAuth,
  async (req: any, res: express.Response) => {
    try {
      await userService.subscribeToContributor(
        req.user.id,
        req.params.contributorId
      );

      res.status(200).json({
        status: RESPONSE_STATUS.SUCCESS,
        data: {
          message: "Successfully subscribed.",
        },
      });
    } catch (err) {
      res.status(400).json({
        status: RESPONSE_STATUS.FAILED,
        data: {
          error: err.message,
        },
      });
    }
  }
);

router.post(
  PATH.USERS.UNSUBSCRIBE + "/:contributorId",
  isAuth,
  async (req: any, res: express.Response) => {
    try {
      await userService.unsubscribeToContributor(
        req.user.id,
        req.params.contributorId
      );

      res.status(200).json({
        status: RESPONSE_STATUS.SUCCESS,
        data: {
          message: "Successfully unsubscribed.",
        },
      });
    } catch (err) {
      res.status(400).json({
        status: RESPONSE_STATUS.FAILED,
        data: {
          error: err.message,
        },
      });
    }
  }
);

router.get(
  PATH.USERS.HAS_SUBSCRIBED + "/:id",
  isAuth,
  async (req: any, res: express.Response) => {
    try {
      let hasSubscribed;
      if (req.user.role === UserRoles.Coach) {
        hasSubscribed = await userService.hasUserSubscribed(
          req.params.id,
          await getContributorId(req.user.id)
        );
      } else {
        hasSubscribed = await userService.hasUserSubscribed(
          req.user.id,
          await getContributorId(req.params.id)
        );
      }

      res.status(200).json({
        status: RESPONSE_STATUS.SUCCESS,
        data: {
          hasSubscribed,
        },
      });
    } catch (err) {
      res.status(400).json({
        status: RESPONSE_STATUS.FAILED,
        data: {
          error: err.message,
        },
      });
    }
  }
);

router.post(
  PATH.USERS.ADD_TO_COLLECTION + "/:workoutId",
  isAuth,
  async (req: any, res: express.Response) => {
    try {
      await userService.addWorkoutToUserWorkoutCollection(
        req.user.id,
        req.params.workoutId
      );
      res.status(200).json({
        status: RESPONSE_STATUS.SUCCESS,
        data: {},
      });
    } catch (err) {
      res.status(400).json({
        status: RESPONSE_STATUS.FAILED,
        data: {
          error: err.message,
        },
      });
    }
  }
);

router.post(
  PATH.USERS.REMOVE_FROM_COLLECTION + "/:workoutId",
  isAuth,
  async (req: any, res: express.Response) => {
    try {
      await userService.removeWorkoutToUserWorkoutCollection(
        req.user.id,
        req.params.workoutId
      );
      res.status(200).json({
        status: RESPONSE_STATUS.SUCCESS,
        data: {},
      });
    } catch (err) {
      res.status(400).json({
        status: RESPONSE_STATUS.FAILED,
        data: {
          error: err.message,
        },
      });
    }
  }
);

router.post(
  PATH.USERS.GET_USER_COLLECTION,
  async (req: express.Request, res: express.Response) => {
    const userWorkoutList = await userService.getUserWorkoutCollection(
      req.body
    );

    res.status(200).json({
      status: RESPONSE_STATUS.SUCCESS,
      data: userWorkoutList,
    });
  }
);

export default router;
