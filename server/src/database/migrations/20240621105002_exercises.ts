import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
    return knex.schema.createTable("exercises", (table) => {
        table.increments('id').primary().unsigned().unique();
        table.integer('contributor_id').unsigned()
        table.foreign('contributor_id').references('contributor_id');
        table.string('title', 45).notNullable().defaultTo('NEW EXERCISE');
        table.string('thumb_uri', 255).notNullable();
        table.tinyint('difficulty').unsigned().notNullable().defaultTo(1);
        table.string('equipment_ids', 11).defaultTo(null);
        table.string('description', 255).defaultTo(null);
        table.string('tag_ids', 45).defaultTo(null);
        table.datetime('date_created').notNullable().defaultTo(knex.fn.now());
        table.datetime('date_modified').notNullable().defaultTo(knex.fn.now());
    });
}

export async function down(knex: Knex): Promise<void> {
    return knex.schema.dropTableIfExists("exercises");
}

