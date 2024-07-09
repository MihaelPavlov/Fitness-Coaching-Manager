import { TABLE } from "./../database/constants/tables.constant";
import { AbstractBuilder } from "./common/abstract.builder";
import { AssociationItem, Condition, QueryParams } from "./models/builder.models";

export class WorkoutBuilder extends AbstractBuilder {
    protected override fieldsMap: Record<string, Record<string, string>> = {
        [TABLE.WORKOUT_SESSION]: {
            uid: "id",
            owner: "contributor_id",
            relatedStudent: "related_user_id",
            type_id: "type_id",
            title: "name",
            description: "description",
            imageUri: "image_uri",
            numberOfSets: "set_count",
            pauseBetweenSets: "set_pause_time",
            pauseBetweenExercises: "exercise_pause_time",
            active: "is_active",
            private: "is_private",
            tags: "tag_ids",
            rating: "rating",
            date_created: "date_created",
            date_modified: "dateModified"
        }
    };
    protected override mainTable: string = TABLE.WORKOUT_SESSION;
    protected override defaultLimit: number;
    protected override defaultSelect: Record<string, number>;
    protected override defaultCondition: Condition;
    protected override entityById: number;
    protected override associations: AssociationItem[];

    constructor(queryParams: QueryParams | null = null) {
        super(queryParams);
    }
}