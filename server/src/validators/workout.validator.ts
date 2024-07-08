import { checkSchema, ValidationChain } from "express-validator";
import { formatString } from "./../helpers/string-format.helper";
import { EXCEPTION } from "./../constants/exceptions.constants";

export const createWorkoutValidators: ValidationChain[] = checkSchema({
    relatedStudent: {
        in: ["body"],
        exists: {
            errorMessage: formatString(EXCEPTION.VALIDATION.REQUIRED_FIELD, "relatedStudent")
        },
        isNumeric: {
            errorMessage: formatString(EXCEPTION.VALIDATION.INVALID_VALUE, "relatedStudent")
        }
    },
    title: {
        in: ["body"],
        exists: {
            errorMessage: formatString(EXCEPTION.VALIDATION.REQUIRED_FIELD, "title")
        }
    },
    description: {
        in: ["body"],
        exists: {
            errorMessage: formatString(EXCEPTION.VALIDATION.REQUIRED_FIELD, "description")
        }
    },
    imageUri: {
        in: ["body"],
        exists: {
            errorMessage: formatString(EXCEPTION.VALIDATION.REQUIRED_FIELD, "imageUri")
        }
    },
    numberOfSets: {
        in: ["body"],
        exists: {
            errorMessage: formatString(EXCEPTION.VALIDATION.REQUIRED_FIELD, "numberOfSets")
        },
        isNumeric: {
            errorMessage: formatString(EXCEPTION.VALIDATION.INVALID_VALUE, "numberOfSets")
        }
    },
    pauseBetweenSets: {
        in: ["body"],
        exists: {
            errorMessage: formatString(EXCEPTION.VALIDATION.REQUIRED_FIELD, "pauseBetweenSets")
        },
        isNumeric: {
            errorMessage: formatString(EXCEPTION.VALIDATION.INVALID_VALUE, "pauseBetweenSets")
        }
    },
    pauseBetweenExercises: {
        in: ["body"],
        exists: {
            errorMessage: formatString(EXCEPTION.VALIDATION.REQUIRED_FIELD, "pauseBetweenExercises")
        },
        isNumeric: {
            errorMessage: formatString(EXCEPTION.VALIDATION.INVALID_VALUE, "pauseBetweenExercises")
        }
    },
    active: {
        in: ["body"],
        exists: {
            errorMessage: formatString(EXCEPTION.VALIDATION.REQUIRED_FIELD, "active")
        },
        isBoolean: {
            errorMessage: formatString(EXCEPTION.VALIDATION.INVALID_VALUE, "active")
        }
    },
    private: {
        in: ["body"],
        exists: {
            errorMessage: formatString(EXCEPTION.VALIDATION.REQUIRED_FIELD, "private")
        },
        isBoolean: {
            errorMessage: formatString(EXCEPTION.VALIDATION.INVALID_VALUE, "private")
        }
    },
    tags: {
        in: ["body"],
        exists: {
            errorMessage: formatString(EXCEPTION.VALIDATION.REQUIRED_FIELD, "tags")
        }
    },
    rating: {
        in: ["body"],
        exists: {
            errorMessage: formatString(EXCEPTION.VALIDATION.REQUIRED_FIELD, "rating")
        },
        isNumeric: {
            errorMessage: formatString(EXCEPTION.VALIDATION.INVALID_VALUE, "rating")
        }
    },
});