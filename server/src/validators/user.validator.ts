import { EXCEPTION } from "./../constants/exceptions.constants";
import { ValidationChain, checkSchema } from "express-validator";
import { formatString } from "./../helpers/string-format.helper";

export const createUserValidators: ValidationChain[] = checkSchema({
    username: {
        in: ["body"],
        exists: {
            errorMessage: formatString(EXCEPTION.VALIDATION.REQUIRED_FIELD, "username")
        }
    },
    email: {
        in: ["body"],
        exists: {
            errorMessage: formatString(EXCEPTION.VALIDATION.REQUIRED_FIELD, "email")
        }
    },
    password: {
        in: ["body"],
        exists: {
            errorMessage: formatString(EXCEPTION.VALIDATION.REQUIRED_FIELD, "password")
        }
    },
    country: {
        in: ["body"],
        exists: {
            errorMessage: formatString(EXCEPTION.VALIDATION.REQUIRED_FIELD, "country")
        }
    },
    language: {
        in: ["body"],
        exists: {
            errorMessage: formatString(EXCEPTION.VALIDATION.REQUIRED_FIELD, "language")
        }
    },
    sex: {
        in: ["body"],
        exists: {
            errorMessage: formatString(EXCEPTION.VALIDATION.REQUIRED_FIELD, "sex")
        }
    },
});