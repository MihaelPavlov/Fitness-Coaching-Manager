import express from "express";

const app: express.Application = express();

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