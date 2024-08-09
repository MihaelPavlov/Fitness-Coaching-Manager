import express from "express";
import userController from "./controllers/user.controller";
import exercisesController from "./controllers/exercises.controller";
import workoutController from "./controllers/workout.controller";
import chatController from "./controllers/chat.controller";
import contributorController from "./controllers/contributor.controller";
import sessionController from "./controllers/session.controller";
import languageController from "./controllers/languages.controller";

const router = express.Router();

router.use("/users", userController);
router.use("/exercises", exercisesController);
router.use("/workouts", workoutController)
router.use("/chats", chatController)
router.use("/contributors", contributorController);
router.use("/sessions", sessionController);
router.use("/languages", languageController);

export default router;
