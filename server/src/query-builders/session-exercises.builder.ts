import { TABLE } from "./../database/constants/tables.constant";
import { AbstractBuilder } from "./common/abstract.builder";
import { AssociationItem, Condition, OrderItem, QueryParams } from "./models/builder.models";

export class SessionExercisesBuilder extends AbstractBuilder {
    protected override fieldsMap: Record<string, Record<string, string>> = {
        [TABLE.SESSION_EXERCISES]: {
            uid: "id",
            sessionId: "session_id",
            exerciseId: "exercise_id",
            rank: "rank",
            description: "description",
            hasTiming: "has_timing",
            duration: "time_duration",
            repetitions: "reps"
        },
    };
    protected override mainTable: string = TABLE.SESSION_EXERCISES;
    protected override defaultLimit: number;
    protected override defaultSelect: Record<string, number>;
    protected override defaultCondition: Condition;
    protected override defaultOrder: OrderItem[];
    protected override entityById: number;
    protected override associations: AssociationItem[] = [
        {
            mainField: "session_id",
            relatedTable: TABLE.WORKOUT_SESSION,
            relatedField: "id"
        },
        {
            mainField: "exercise_id",
            relatedTable: TABLE.EXERCISES,
            relatedField: "id"
        }
    ];

    constructor(queryParams: QueryParams | null = null) {
        super(queryParams);
    }
}