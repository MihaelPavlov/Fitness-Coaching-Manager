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
          message: "You must give a proof of rights to be a coach",
        },
      });
    }
  }

  next();
};

export const hasFileValidationMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (!req.file) {
    return res.status(422).json({
      status: RESPONSE_STATUS.FAILED,
      data: {
        message: "You must upload a file",
      },
    });
  }

  next();
};

export const isFileImageMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const allowedFiles = ["image/png", "image/jpeg", "image/jpg", "image/webp"];
  if (!allowedFiles.includes(req.file.mimetype)) {
    return res.status(422).json({
      status: RESPONSE_STATUS.FAILED,
      data: {
        message: "File must be an image",
      },
    });
  }

  next();
};
