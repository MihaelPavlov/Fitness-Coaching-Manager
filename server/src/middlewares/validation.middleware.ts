import { Request, Response, NextFunction } from "express";
import {
  FieldValidationError,
  validationResult,
  ValidationChain,
  ResultFactory,
} from "express-validator";
import { RESPONSE_STATUS } from "../constants/response.constants";
import { IValidationException } from "../models/exceptions/validation-exception";
import { UserRoles } from "./../models/enums/user-roles.enum";
import {
  createCoachValidators,
  createUserValidators,
} from "./../validators/user.validator";

const applicationValidationResult: ResultFactory<IValidationException> =
  validationResult.withDefaults({
    formatter: (error: FieldValidationError) => {
      return { message: error.msg as string, field: error.path as string };
    },
  });

export const inputValidationMiddleware = (validators: ValidationChain[]) => {
  return async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    await Promise.all(validators.map((validator) => validator.run(req)));

    const validation = applicationValidationResult(req);

    if (!validation.isEmpty()) {
      const uniqueErrors: { [key: string]: string } = {};

      validation.array().forEach((error) => {
        if (!(error.field in uniqueErrors)) {
          uniqueErrors[error.field] = error.message;
        }
      });

      const uniqueErrorArray = Object.keys(uniqueErrors).map((field) => ({
        message: uniqueErrors[field],
        field: field,
      }));

      res.status(422).json({
        status: RESPONSE_STATUS.FAILED,
        data: uniqueErrorArray,
      });

      return;
    }

    next();
  };
};

export const registrationMiddlware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const validators: ValidationChain[] = +req.body.userRole === UserRoles.Coach ? createCoachValidators : createUserValidators;

  await Promise.all(
    validators.map((validator) => validator.run(req))
  );

  const validation = applicationValidationResult(req);

  if (!validation.isEmpty()) {
    const uniqueErrors: { [key: string]: string } = {};

    validation.array().forEach((error) => {
      if (!(error.field in uniqueErrors)) {
        uniqueErrors[error.field] = error.message;
      }
    });

    const uniqueErrorArray = Object.keys(uniqueErrors).map((field) => ({
      message: uniqueErrors[field],
      field: field,
    }));

    res.status(422).json({
      status: RESPONSE_STATUS.FAILED,
      data: uniqueErrorArray,
    });

    return;
  }

  next();
};