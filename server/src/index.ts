import "dotenv/config";
import express from "express";
import cors from "cors";
import expressConfig from "./config/express.config";
import * as fs from "fs";
import * as stream from "stream"
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

// Fetch saved files from server to client
app.get("/files/:filename", (req: express.Request, res: express.Response) => {
  const r = fs.createReadStream(`uploads/${req.params.filename}`) // or any other way to get a readable stream
  const ps = new stream.PassThrough() // <---- this makes a trick with stream error handling
  stream.pipeline(
   r,
   ps, // <---- this makes a trick with stream error handling
   (err) => {
    if (err) {
      console.log(err) // No such file or any other kind of error
      return res.sendStatus(400); 
    }
  })
  ps.pipe(res) // <---- this makes a trick with stream error handling
});

expressConfig(app);

app.use(checkAccessToken, checkRefreshToken);

app.use("/api/v1", router);

app.use(errorHandler);

const port = 3000;
app.listen(port, () => {
  console.log(`Server is listening on port ${port}`);
});
