import express from "express";
import * as userService from "./../services/user.service";

const router = express.Router();

router.get("/getList", async (req: express.Request, res: express.Response) => {
  const users = await userService.getUsers(req.body);

  res.status(200).json({
    status: "success",
    data: {
      users,
    },
  });
});

router.get("/getDetail", async (req: express.Request, res: express.Response) => {
  const user = await userService.getUser(req.body);

  res.status(200).json({
    status: "success",
    data: {
      user
    },
  });
});

router.post("/register", async (req: express.Request, res: express.Response) => {
  try {
    const createdUser = await userService.createUser(req.body);

    res.status(200).json({
      status: "success",
      data: {
        message: "Register!"
      }
    });
  } catch (err) {
    res.status(500).json({
      status: "error",
      data: {
        message: err.message,
      },
    });
  }
});

router.post("/login", async (req: express.Request, res: express.Response) => {

});

router.post("/createSpecs", async (req: express.Request, res: express.Response) => {
  try {
    const createdUserSpecs = await userService.createUserSpecs(req.body);

    res.status(201).json({
      status: "success",
      data: {
        message: "Successfully created user specs!",
        user: createdUserSpecs,
      },
    });
  } catch (err) {
    res.status(500).json({
      status: "error",
      data: {
        message: err.message,
      },
    });
  }
});

export default router;