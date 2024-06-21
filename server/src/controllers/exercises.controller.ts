import express from "express";
import * as exerciseService from "./../services/exercise.service";
import { isCoach } from "./../middlewares/auth.middleware";

const router = express.Router();

router.post("/add", isCoach, async (req: any, res: express.Response) => {

});


router.post("/getList", async (req: any, res: express.Response) => {
    const exercises = await exerciseService.getExercises(req.body);

    res.status(200).json({
      status: "success",
      data: {
        exercises,
      },
    });
});

export default router;
