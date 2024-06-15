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
    const [accessToken, refreshToken, session] = await userService.registerUser(req.body);

    res.status(200).json({
      status: "success",
      data: {
          session,
          accessToken,
          refreshToken
      }
    });

  } catch (err) {
    return res.status(400).json({
      status: "fail",
      data: {
          error: err.message
      }
    })
  }
});

router.post("/login", async (req: express.Request, res: express.Response) => {
  try {
    const [accessToken, refreshToken, session] = await userService.loginUser(req.body);

    res.status(200).json({
      status: "success",
      data: {
          session,
          accessToken,
          refreshToken
      }
    });

  } catch (err) {
    return res.status(400).json({
      status: "fail",
      data: {
          error: err.message
      }
    })
  }
});

export default router;