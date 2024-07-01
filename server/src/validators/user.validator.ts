import { EXCEPTION } from "./../constants/exceptions.constants";
import { ValidationChain, checkSchema } from "express-validator";
import { formatString } from "./../helpers/string-format.helper";

export const createUserValidators: ValidationChain[] = checkSchema({
    username: {
        in: ["body"],
        exists: {
            errorMessage: formatString(EXCEPTION.VALIDATION.REQUIRED_FIELD, "username")
        }
    }
});