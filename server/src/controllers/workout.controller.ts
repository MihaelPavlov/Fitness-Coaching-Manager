import express from "express";
import * as workoutService from "./../services/workout.service";
import { isAuth, isCoach } from "./../middlewares/auth.middleware";
import { PATH } from "./../constants/path.constants";
import {
  createWorkoutExercisesValidators,
  createWorkoutValidators,
} from "./../validators/workout.validator";
import { RESPONSE_STATUS } from "./../constants/response.constants";
import { inputValidationMiddleware } from "./../middlewares/validation.middleware";
import upload from "./../config/file-upload.config";
import { hasFileValidationMiddleware, isFileImageMiddleware } from "./../middlewares/file-uploads.middleware";

const router = express.Router();

router.post(
  "/getWorkouts",
  async (req: express.Request, res: express.Response) => {
    try {
      const workouts = await workoutService.getWorkouts(req.body);

      res.status(200).json({
        status: RESPONSE_STATUS.SUCCESS,
        data: workouts,
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
  PATH.WORKOUTS.CREATE_WORKOUT,
  isAuth,
  isCoach,
  upload.single("imageUri"),
  hasFileValidationMiddleware,
  isFileImageMiddleware,
  inputValidationMiddleware(createWorkoutValidators),
  inputValidationMiddleware(createWorkoutExercisesValidators),
  async (req: any, res: express.Response) => {
    try {
      const createdWorkout = await workoutService.createWorkoutSession(
        req.user.contributorId,
        req.body,
        req.file
      );

      res.status(201).json({
        status: RESPONSE_STATUS.SUCCESS,
        data: {
          workout: createdWorkout,
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
  PATH.WORKOUTS.GET_TAG_LIST,
  async (req: any, res: express.Response) => {
    try {
      const workoutTags = await workoutService.getWorkoutTags(req.body);

      res.status(201).json({
        status: RESPONSE_STATUS.SUCCESS,
        data: workoutTags,
      });
    } catch (err) {
      res.status(400).json({
        status: RESPONSE_STATUS.FAILED,
        message: err.message,
      });
    }
  }
);

export default router;
