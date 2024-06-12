import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
    return knex.schema.createTable("supported_languages", (table) => {
        table.increments("id").primary().unsigned().unique();
        table.string("language", 45).notNullable().unique();
        table.string("code", 10).notNullable().unique();
        table.string("local", 45).notNullable().unique();
    });
}

export async function down(knex: Knex): Promise<void> {
    return knex.schema.dropTableIfExists("supported_languages");
}

