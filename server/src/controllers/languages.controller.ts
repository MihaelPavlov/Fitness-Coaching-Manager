import express from "express";
import * as languageService from "./../services/language.service";

const router = express.Router();

router.post(
    "/getList",
    async (req: express.Request, res: express.Response, next: express.NextFunction) => {
        try {
            const languages = await languageService.getLanguages(req.body);

            res.status(200).json({
                status: "success",
                data: languages
            })
        } catch (error) {
            next(error)
        }
    }
)

export default router;