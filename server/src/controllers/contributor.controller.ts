import express from "express";
import * as contributorService from "./../services/contributor.service";
import { isAuth, isCoach } from "./../middlewares/auth.middleware";
import { RESPONSE_STATUS } from "./../constants/response.constants";
import { PATH } from "./../constants/path.constants";

const router = express.Router();

router.post(
    PATH.CONTRIBUTORS.GET_SUBSCRIBERS,
    isAuth,
    isCoach,
    async (req: any, res: express.Response, next: express.NextFunction) => {
        try {
            const subscribers = await contributorService.getContributorSubscribers(req.user.id, req.body);

            res.status(200).json({
                status: RESPONSE_STATUS.SUCCESS,
                data: subscribers
            })
        } catch (err) {
            next(err);
        }
    }
)

export default router;