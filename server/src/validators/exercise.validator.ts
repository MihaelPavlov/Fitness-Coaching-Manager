import { EXCEPTION } from "../constants/exceptions.constants";
import { formatString } from "../helpers/string-format.helper";
import { ValidationChain, checkSchema } from "express-validator";

export const exerciseValidators: ValidationChain[] = checkSchema({
  title: {
    in: ["body"],
    exists: {
      errorMessage: formatString(EXCEPTION.VALIDATION.REQUIRED_FIELD, "Title"),
    },
    isLength: {
      options: { min: 3, max: 45 },
      errorMessage: formatString(
        EXCEPTION.VALIDATION.INVALID_LENGTH,
        "Title",
        "3",
        "45"
      ),
    },
  },
  description: {
    in: ["body"],
    exists: {
      errorMessage: formatString(
        EXCEPTION.VALIDATION.REQUIRED_FIELD,
        "Description"
      ),
    },
    isLength: {
      options: { min: 10, max: 255 },
      errorMessage: formatString(
        EXCEPTION.VALIDATION.INVALID_LENGTH,
        "Description",
        "10",
        "255"
      ),
    },
  },
  thumbUri: {
    in: ["body"],
    notEmpty: true,
  },
  difficulty: {
    in: ["body"],
    isInt: {
      options: {
        min: 1,
        max: 3,
      },
      errorMessage: formatString(
        EXCEPTION.VALIDATION.INVALID_VALUE_WITH_RANGE,
        "Difficulty",
        "1",
        "3"
      ),
    },
  },
});
