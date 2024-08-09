import express, { NextFunction } from "express";

import * as sessionService from "./../services/session.service";
import { RESPONSE_STATUS } from "./../constants/response.constants";
import { PATH } from "./../constants/path.constants";
import { isAuth } from "./../middlewares/auth.middleware";
import { inputValidationMiddleware } from "./../middlewares/validation.middleware";
import { finishSessionValidators } from "./../validators/session.validator";

const router = express.Router();

router.post(
    PATH.SESSIONS.GET_EXERCISES,
    async (req: express.Request, res: express.Response, next: NextFunction) => {
        try {
            const exercises = await sessionService.getSessionExercises(req.body);

            res.status(200).json({
                status: RESPONSE_STATUS.SUCCESS,
                data: exercises
            })
        } catch (err) {
            next(err)
        }
    }
)

router.post(
    PATH.SESSIONS.GET_EXERCISE,
    async (req: express.Request, res: express.Response, next: NextFunction) => {
        try {
            const exercise = await sessionService.getSessionExercise(req.body);

            res.status(200).json({
                status: RESPONSE_STATUS.SUCCESS,
                data: exercise
            })
        } catch (err) {
            next(err)
        }
    }
)

router.post(
    PATH.SESSIONS.FINISH_SESSION,
    isAuth,
    inputValidationMiddleware(finishSessionValidators),
    async (req: any, res: express.Response, next: NextFunction) => {
        try {
            await sessionService.finishSession(req.user.id, req.params.workoutId, req.body);

            res.status(200).json({
                status: RESPONSE_STATUS.SUCCESS,
                data: {
                    message: "Successfully finished workout"
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