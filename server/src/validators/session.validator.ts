import { checkSchema, ValidationChain } from "express-validator";
import { formatString } from "./../helpers/string-format.helper";
import { EXCEPTION } from "./../constants/exceptions.constants";

export const finishSessionValidators: ValidationChain[] = checkSchema({
    timeDuration: {
        in: ["body"],
        exists: {
            errorMessage: formatString(EXCEPTION.VALIDATION.REQUIRED_FIELD, "timeDuration")
        }
    },
    startTime: {
        in: ["body"],
        exists: {
            errorMessage: formatString(EXCEPTION.VALIDATION.REQUIRED_FIELD, "startTime")
        }
    },
    endTime: {
        in: ["body"],
        exists: {
            errorMessage: formatString(EXCEPTION.VALIDATION.REQUIRED_FIELD, "endTime")
        }
    },
});