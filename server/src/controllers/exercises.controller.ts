import express from "express";
import * as exerciseService from "./../services/exercise.service";
import { isCoach } from "./../middlewares/auth.middleware";

const router = express.Router();

router.post("/add", async (req: any, res: express.Response) => {
  try {
    const createdExerciseID = await exerciseService.addExercise(req.body);

    res.status(201).json({
      status: "success",
      data: {
        exerciseID: createdExerciseID,
      },
    });
  } catch (error) {
    res.status(400).json({
      status: "error",
      message: error.message,
    });
  }
});

router.post("/getList", async (req: any, res: express.Response) => {
  try {
    const exercises = await exerciseService.getExercises(req.body);

    res.status(200).json({
      status: "success",
      data: exercises,
    });
  } catch (error) {
    res.status(400).json({
      status: "error",
      message: error.message,
    });
  }
});

router.post("/getTagList", async (req: any, res: express.Response) => {
  try {
    const exerciseTags = await exerciseService.getTags(req.body);

    res.status(201).json({
      status: "success",
      data: exerciseTags,
    });
  } catch (error) {
    res.status(400).json({
      status: "error",
      message: error.message,
    });
  }
});

router.post("/getEquipmentList", async (req: any, res: express.Response) => {
  try {
    const exerciseEquipments = await exerciseService.getEquipments(req.body);

    res.status(201).json({
      status: "success",
      data: exerciseEquipments,
    });
  } catch (error) {
    res.status(400).json({
      status: "error",
      message: error.message,
    });
  }
});

export default router;
