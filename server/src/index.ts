import express from "express";

// Config imports
import expressConfig from "./config/express.config";

// Auth middleware import
import { authMiddleware } from "./middlewares/auth";

// Main router import
import router from "./routes";

const app = express();

// Express configs
expressConfig(app);

// Auth middleware - first middleware
app.use(authMiddleware);

// API Version 1
app.use("/api/v1", router);

const port = 3000;

app.listen(port, () => {
  console.log(`Server is listening on port ${port}`);
});