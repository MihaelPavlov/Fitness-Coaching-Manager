import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
    return knex.schema.createTableIfNotExists("workout_session", (table) => {
        table.increments('id').primary().unsigned().notNullable().unique();
        table.integer('contributor_id').unsigned().notNullable();
        table.foreign('contributor_id').references('contributors.id');
        table.integer('related_user_id').unsigned().nullable().defaultTo(null);
        table.foreign('related_user_id').references('users.id');
        table.integer('type_id').unsigned().notNullable().defaultTo(1);
        table.string('name', 45).notNullable().defaultTo('NEW SESSION');
        table.string('description', 255).defaultTo(null);
        table.string('image_uri', 255).notNullable().defaultTo('/path/to/default/image.jpg');
        table.tinyint('set_count').unsigned().notNullable().defaultTo(1);
        table.tinyint('set_pause_time').unsigned().notNullable().defaultTo(0);
        table.tinyint('exercise_pause_time').unsigned().notNullable().defaultTo(0);
        table.boolean("is_active").notNullable().defaultTo(0);
        table.boolean("is_private").notNullable().defaultTo(0);
        table.string('tag_ids', 45).defaultTo(null);
        table.tinyint('rating').unsigned().notNullable().defaultTo(0);
        table.datetime("date_created").notNullable().defaultTo(knex.fn.now());
        table.datetime("date_modified").notNullable().defaultTo(knex.fn.now());
    });
}

export async function down(knex: Knex): Promise<void> {
    return knex.schema.dropTableIfExists("workout_session");
}

