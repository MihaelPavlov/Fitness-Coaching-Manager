import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
    return knex.schema.createTable("contributor_applications", (table) => {
        table.increments("id").primary().unsigned().unique();
        table.integer("contributor_id").unsigned().notNullable();
        table.foreign("contributor_id").references("contributors.id");
        table.string("item_uri", 255).notNullable();
    });
}

export async function down(knex: Knex): Promise<void> {
    return knex.schema.dropTableIfExists("contributor_applications");
}

