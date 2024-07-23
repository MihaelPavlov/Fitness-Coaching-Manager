import express from "express";
import userController from "./controllers/user.controller";
import exercisesController from "./controllers/exercises.controller";
import workoutController from "./controllers/workout.controller";
import contributorController from "./controllers/contributor.controller";

const router = express.Router();

router.use("/users", userController);
router.use("/exercises", exercisesController);
router.use("/workouts", workoutController);
router.use("/contributors", contributorController);

export default router;
