import { NextFunction, Response, Request } from "express";
import { BadRequestException } from "../models/exceptions/bad-request.exception";
import { RESPONSE_STATUS } from "../constants/response.constants";
import { NotFoundException } from "../models/exceptions/not-found.exception";
import { InternalServerException } from "../models/exceptions/internal-server.exception";
import multer from "multer";
import { KnexValidationException } from "../models/exceptions/knex-validation.exception";

export const errorHandler = (
  error: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.log("error------>",error)
  if (error instanceof BadRequestException) {
    return res.status(error.code).send({
      status: RESPONSE_STATUS.FAILED,
      data: { message: error.message },
    });
  } else if (error instanceof NotFoundException) {
    return res.status(error.code).send({
      status: RESPONSE_STATUS.FAILED,
      data: { message: error.message },
    });
  } else if (error instanceof multer.MulterError) {
    return res.status(409).json({
      status: RESPONSE_STATUS.FAILED,
      data: { message: error.message },
    });
  } else if (error instanceof KnexValidationException) {
    return res.status(error.code).json({
      status: RESPONSE_STATUS.FAILED,
      data: { message: error.message },
    });
  } else {
    const internalError = new InternalServerException();
    return res.status(internalError.code).send({
      status: RESPONSE_STATUS.FAILED,
      data: { message: error.message },
    });
  }
};

export const asyncHandler =
  (fn: Function) => (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
