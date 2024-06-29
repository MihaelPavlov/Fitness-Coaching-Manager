import express from "express";
import userController from "./controllers/user.controller";
import exercisesController from "./controllers/exercises.controller";

const router = express.Router();

router.use("/users", userController);
router.use("/exercises", exercisesController);

export default router;
