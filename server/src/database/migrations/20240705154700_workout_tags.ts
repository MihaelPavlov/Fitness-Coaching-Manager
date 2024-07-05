import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
    return knex.schema.createTableIfNotExists("workout_tags", (table) => {
        table.increments('id').primary().unsigned().primary().notNullable().unique();
        table.string('name', 45).notNullable().unique();
        table.string('icon_uri', 255).notNullable().defaultTo('/path/to/default/tag.jpg');
        table.string('tag_color', 11).defaultTo(null);
    });
}

export async function down(knex: Knex): Promise<void> {
    return knex.schema.dropTableIfExists("workout_tags");
}

