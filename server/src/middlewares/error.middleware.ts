import { NextFunction, Response, Request } from "express";
import { BadRequestException } from "../models/exceptions/bad-request.exception";
import { RESPONSE_STATUS } from "../constants/response.constants";
import { NotFoundException } from "../models/exceptions/not-found.exception";
import { InternalServerException } from "../models/exceptions/internal-server.exception";

export const errorHandler = (
  error: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (error instanceof BadRequestException) {
    return res.status(error.code).send({
      status: RESPONSE_STATUS.FAILED,
      message: error.message,
    });
  } else if (error instanceof NotFoundException) {
    return res.status(error.code).send({
      status: RESPONSE_STATUS.FAILED,
      message: error.message,
    });
  } else {
    const internalError = new InternalServerException();
    return res.status(internalError.code).send({
      status: RESPONSE_STATUS.FAILED,
      message: internalError.message,
    });
  }
};