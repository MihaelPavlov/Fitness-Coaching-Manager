import { UserRoles } from "./../models/enums/user-roles.enum";
import { RESPONSE_STATUS } from "./../constants/response.constants";
import { NextFunction, Request, Response } from "express";

export const registrationFileValidationMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
    if (+req.body.userRole === UserRoles.Coach) {
        if (!req.files || !req.body.links) {
            return res.status(422).json({
                status: RESPONSE_STATUS.FAILED,
                data: {
                    message: "You must give a proof of rights to be a coach"
                }
            })
        }
    }

    next();
};
