import "dotenv/config";
import express from "express";
import cors from "cors";
import expressConfig from "./config/express.config";
import {
  checkAccessToken,
  checkRefreshToken,
} from "./middlewares/auth.middleware";
import router from "./routes";
import { errorHandler } from "./middlewares/error.middleware";

const app = express();
app.use(
  cors({
    origin: "http://localhost:4200",
    credentials: true,
  })
);

expressConfig(app);

app.use(checkAccessToken, checkRefreshToken);

app.use("/api/v1", router);

app.use(errorHandler);

const port = 3000;
app.listen(port, () => {
  console.log(`Server is listening on port ${port}`);
});
