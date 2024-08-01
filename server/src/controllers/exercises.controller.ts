import express from "express";
import * as exerciseService from "./../services/exercise.service";
import { isAuth, isCoach } from "./../middlewares/auth.middleware";
import { fileMediaValidationMiddleware, fileSizeValidationMiddleware, inputValidationMiddleware } from "../middlewares/validation.middleware";
import { createExerciseValidators } from "../validators/exercise.validator";
import { RESPONSE_STATUS } from "../constants/response.constants";
import { PATH } from "../constants/path.constants";
import upload from "./../config/file-upload.config";

const router = express.Router();

router.post(
  PATH.EXERCISES.CREATE,
  isAuth,
  isCoach,
  upload.single("thumbUri"),
  fileSizeValidationMiddleware,
  fileMediaValidationMiddleware,
  inputValidationMiddleware(createExerciseValidators),
  async (
    req: any,
    res: express.Response,
    next: express.NextFunction
  ) => {
    try {
      const createdExerciseID = await exerciseService.addExercise(req.user.contributorId, req.body, req.file);

      res.status(201).json({
        status: RESPONSE_STATUS.SUCCESS,
        data: createdExerciseID,
      });
    } catch (error) {
      next(error);
    }
  }
);

router.post(
  PATH.EXERCISES.GET_DETAILS,
  async (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    try {
      const exercise = await exerciseService.executeExerciseBuilder(req.body);

      res.status(201).json({
        status: RESPONSE_STATUS.SUCCESS,
        data: exercise,
      });
    } catch (error) {
      next(error);
    }
  }
);

router.post(
  PATH.EXERCISES.GET_LIST,
  async (req: any, res: express.Response) => {
    try {
      const exercises = await exerciseService.executeExerciseBuilder(req.body);

      res.status(200).json({
        status: RESPONSE_STATUS.SUCCESS,
        data: exercises,
      });
    } catch (error) {
      res.status(400).json({
        status: RESPONSE_STATUS.FAILED,
        message: error.message,
      });
    }
  }
);

router.post(
  PATH.EXERCISES.GET_TAG_LIST,
  async (req: any, res: express.Response) => {
    try {
      const exerciseTags = await exerciseService.getTags(req.body);

      res.status(201).json({
        status: RESPONSE_STATUS.SUCCESS,
        data: exerciseTags,
      });
    } catch (error) {
      res.status(400).json({
        status: RESPONSE_STATUS.FAILED,
        message: error.message,
      });
    }
  }
);

router.post(
  PATH.EXERCISES.GET_EQUIPMENT_LIST,
  async (req: any, res: express.Response) => {
    try {
      const exerciseEquipments = await exerciseService.getEquipments(req.body);

      res.status(201).json({
        status: RESPONSE_STATUS.SUCCESS,
        data: exerciseEquipments,
      });
    } catch (error) {
      res.status(400).json({
        status: RESPONSE_STATUS.FAILED,
        message: error.message,
      });
    }
  }
);

export default router;
