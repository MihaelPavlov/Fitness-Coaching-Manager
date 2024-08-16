import { EXCEPTION } from "./../constants/exceptions.constants";
import { ValidationChain, checkSchema } from "express-validator";
import { formatString } from "./../helpers/string-format.helper";
import { GenderType } from "./../models/enums/gender-list.enum";
import { FitnessLevels } from "./../models/enums/fitness-levels.enum";

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
    languages: {
        in: ["body"],
        exists: {
            errorMessage: formatString(EXCEPTION.VALIDATION.REQUIRED_FIELD, "language")
        }
    },
    sex: {
        in: ["body"],
        exists: {
            errorMessage: formatString(EXCEPTION.VALIDATION.REQUIRED_FIELD, "sex")
        },
        isIn: {
            options: [Object.values(GenderType)],
            errorMessage: formatString(EXCEPTION.VALIDATION.INVALID_VALUE, "sex")
        }
    },
    fitnessLevel: {
        in: ["body"],
        exists: {
            errorMessage: formatString(EXCEPTION.VALIDATION.REQUIRED_FIELD, "fitnessLevel")
        },
        isIn: {
            options: [Object.values(FitnessLevels)],
            errorMessage: formatString(EXCEPTION.VALIDATION.INVALID_VALUE, "fitnessLevel")
        }
    }
});

export const createCoachValidators: ValidationChain[] = checkSchema({
    userRole: {
        in: ["body"],
        exists: {
            errorMessage: formatString(EXCEPTION.VALIDATION.REQUIRED_FIELD, "userRole")
        },
        toInt: true,
        isInt: {
            options: {
                min: 1,
                max: 1
            },
            errorMessage: formatString(EXCEPTION.VALIDATION.INVALID_VALUE, "userRole")
        }
    },
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
        },
        isEmail: true
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
    languages: {
        in: ["body"],
        exists: {
            errorMessage: formatString(EXCEPTION.VALIDATION.REQUIRED_FIELD, "language")
        }
    },
    sex: {
        in: ["body"],
        exists: {
            errorMessage: formatString(EXCEPTION.VALIDATION.REQUIRED_FIELD, "sex")
        },
        isIn: {
            options: [Object.values(GenderType)],
            errorMessage: formatString(EXCEPTION.VALIDATION.INVALID_VALUE, "sex")
        }
    },
    phoneNumber: {
        in: ["body"],
        exists: {
            errorMessage: formatString(EXCEPTION.VALIDATION.REQUIRED_FIELD, "phoneNumber")
        }
    },
    firstName: {
        in: ["body"],
        exists: {
            errorMessage: formatString(EXCEPTION.VALIDATION.REQUIRED_FIELD, "firstName")
        }
    },
    lastName: {
        in: ["body"],
        exists: {
            errorMessage: formatString(EXCEPTION.VALIDATION.REQUIRED_FIELD, "lastName")
        }
    },
});

const dateRegex = /[1-9][0-9][0-9]{2}\/([0][1-9]|[1][0-2])\/([1-2][0-9]|[0][1-9]|[3][0-1])/gm;

export const updateUserValidators: ValidationChain[] = checkSchema({
    firstName: {
        in: ["body"],
        exists: {
            errorMessage: formatString(EXCEPTION.VALIDATION.REQUIRED_FIELD, "firstName")
        }
    },
    lastName: {
        in: ["body"],
        exists: {
            errorMessage: formatString(EXCEPTION.VALIDATION.REQUIRED_FIELD, "lastName")
        }
    },
    email: {
        in: ["body"],
        exists: {
            errorMessage: formatString(EXCEPTION.VALIDATION.REQUIRED_FIELD, "email")
        },
        isEmail: {
            errorMessage: formatString(EXCEPTION.VALIDATION.INVALID_VALUE, "email")
        }
    },
});