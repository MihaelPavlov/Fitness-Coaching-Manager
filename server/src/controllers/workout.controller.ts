import { isAuth, isCoach } from "./../middlewares/auth.middleware";
import { PATH } from "./../constants/path.constants";
import express from "express";

const router = express.Router();

router.post(
    PATH.WORKOUTS.CREATE_WORKOUT,
    isAuth,
    isCoach,
    async (req: any, res: express.Response) => {
        
    }
)

export default router;