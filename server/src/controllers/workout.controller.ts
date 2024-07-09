import express from "express";
import { createWorkoutSession } from "./../services/workout.service";
import { isAuth, isCoach } from "./../middlewares/auth.middleware";
import { PATH } from "./../constants/path.constants";
import { createWorkoutExercisesValidators, createWorkoutValidators } from "./../validators/workout.validator";
import { RESPONSE_STATUS } from "./../constants/response.constants";
import { inputValidationMiddleware } from "./../middlewares/validation.middleware";

const router = express.Router();

router.post(
    PATH.WORKOUTS.CREATE_WORKOUT,
    isAuth,
    isCoach,
    inputValidationMiddleware(createWorkoutValidators),
    inputValidationMiddleware(createWorkoutExercisesValidators),
    async (req: any, res: express.Response) => {
        try {
            const createdWorkout = await createWorkoutSession(req.user.id, req.body);

            res.status(201).json({
                status: RESPONSE_STATUS.SUCCESS,
                data: {
                    workout: createdWorkout
                }
            })
        } catch (err) {
            res.status(400).json({
                status: RESPONSE_STATUS.FAILED,
                data: {
                    error: err.message
                }
            });
        }
    }
)

export default router;