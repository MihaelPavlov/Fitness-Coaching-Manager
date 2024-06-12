import express from "express";

// Config imports
import expressConfig from "./config/express.config";

// Main router import
import router from "./routes";

const app = express();

// Express configs
expressConfig(app);

app.use(router);

const port = 3000;

app.listen(port, () => {
  console.log(`Server is listening on port ${port}`);
});