import { ExerciseBuilder } from "./../query-builders/exercise.builder";
import { QueryParams } from "./../query-builders/models/builder.models";

export const mapSessionExercises = async (exercises: Array<any>) => {
    return await Promise.all(
        exercises.map(async (exercise) => {
            const exerciseInfo = await mapExerciseId(exercise.exerciseId);
            return {...exercise, ...exerciseInfo};
        })
    )
}

const mapExerciseId = async (exerciseId: any) => {
    const queryParams: QueryParams = {
        what: {
            title: 1,
            thumbUri: 1
        },
        condition: {
            type: "AND",
            items: [
                {
                    field: "uid",
                    operation: "EQ",
                    value: exerciseId
                }
            ]
        }
    }

    const builder = new ExerciseBuilder(queryParams);
    return (await builder.buildQuery()).at(0);
}