import express from "express";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";

export default function expressConfig(app: express.Application) {
    app.use(express.urlencoded({ extended: false }));
    app.use(bodyParser.json());
    app.use(cookieParser());
    return app;
}