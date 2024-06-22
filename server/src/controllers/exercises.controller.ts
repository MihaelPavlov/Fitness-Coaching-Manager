import express from "express";
import * as exerciseService from "./../services/exercise.service";
import { isCoach } from "./../middlewares/auth.middleware";

const router = express.Router();

router.post("/add", isCoach, async (req: any, res: express.Response) => {
  try {
    const exerciseData = req.body;

    const createdExerciseID = await exerciseService.addExercise(exerciseData);

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
      data: {
        exercises,
      },
    });
  } catch (error) {
    res.status(400).json({
      status: "error",
      message: error.message,
    });
  }
});

export default router;
