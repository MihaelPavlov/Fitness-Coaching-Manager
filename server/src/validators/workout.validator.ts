import { checkSchema, ValidationChain } from "express-validator";
import { formatString } from "./../helpers/string-format.helper";
import { EXCEPTION } from "./../constants/exceptions.constants";

export const createWorkoutValidators: ValidationChain[] = checkSchema({
    relatedStudent: {
        in: ["body"],
        exists: {
            errorMessage: formatString(EXCEPTION.VALIDATION.REQUIRED_FIELD, "relatedStudent")
        },
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
});

export const createWorkoutExercisesValidators: ValidationChain[] = checkSchema({
    exercises: {
        in: ["body"],
        exists: {
            errorMessage: formatString(EXCEPTION.VALIDATION.REQUIRED_FIELD, "exercises")
        }
    },
    "exercises.*.exerciseId": {
        in: ["body"],
        exists: {
            errorMessage: formatString(EXCEPTION.VALIDATION.REQUIRED_FIELD, "exerciseId")
        },
        isNumeric: {
            errorMessage: formatString(EXCEPTION.VALIDATION.INVALID_VALUE, "exerciseId")
        }
    },
    "exercises.*.rank": {
        in: ["body"],
        exists: {
            errorMessage: formatString(EXCEPTION.VALIDATION.REQUIRED_FIELD, "rank")
        },
        isNumeric: {
            errorMessage: formatString(EXCEPTION.VALIDATION.INVALID_VALUE, "rank")
        }
    },
    "exercises.*.hasTiming": {
        in: ["body"],
        exists: {
            errorMessage: formatString(EXCEPTION.VALIDATION.REQUIRED_FIELD, "hasTiming")
        },
        isBoolean: {
            errorMessage: formatString(EXCEPTION.VALIDATION.INVALID_VALUE, "hasTiming")
        }
    },
    "exercises.*.duration": {
        in: ["body"],
        exists: {
            errorMessage: formatString(EXCEPTION.VALIDATION.REQUIRED_FIELD, "duration")
        },
        isNumeric: {
            errorMessage: formatString(EXCEPTION.VALIDATION.INVALID_VALUE, "duration")
        }
    },
    "exercises.*.repetitions": {
        in: ["body"],
        exists: {
            errorMessage: formatString(EXCEPTION.VALIDATION.REQUIRED_FIELD, "repetitions")
        },
        isNumeric: {
            errorMessage: formatString(EXCEPTION.VALIDATION.INVALID_VALUE, "repetitions")
        }
    },
});