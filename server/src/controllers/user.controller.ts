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
  
});

router.post("/login", async (req: express.Request, res: express.Response) => {

});

export default router;