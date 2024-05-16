import express from "express";

// Config imports
import expressConfig from "./config/express.config";

const app: express.Application = express();

// Express Configs
expressConfig(app);

app.get("/", (req: express.Request, res: express.Response) => {
    res.status(200).json({
        status: "success",
        data: {
            message: "Backend works successfully!"
        }
    })
});

const PORT: Number = 3000;

app.listen(PORT, () => {
    console.log(`Server is listening on port ${PORT}`);
});