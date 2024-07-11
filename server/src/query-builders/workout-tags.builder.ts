import { TABLE } from "./../database/constants/tables.constant";
import { AbstractBuilder } from "./common/abstract.builder";
import { AssociationItem, Condition, QueryParams } from "./models/builder.models";

export class WorkoutTagsBuilder extends AbstractBuilder {
    protected override fieldsMap: Record<string, Record<string, string>> = {
        [TABLE.WORKOUT_TAGS]: {
            uid: "id",
            name: "name",
            tagIcon: "icon_uri",
            tagColor: "tag_color"
        }
    };
    protected override mainTable: string = TABLE.WORKOUT_TAGS;
    protected override defaultLimit: number;
    protected override defaultSelect: Record<string, number>;
    protected override defaultCondition: Condition;
    protected override entityById: number;
    protected override associations: AssociationItem[] = [];

    constructor(queryParams: QueryParams | null = null) {
        super(queryParams);
    }
}