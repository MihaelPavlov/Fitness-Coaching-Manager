import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
    return knex.schema.createTable("users", (table) => {
        table.increments("id").primary().unsigned().unique();
        table.string("first_name", 45).defaultTo(null);
        table.string("last_name", 45).defaultTo(null);
        table.string("email", 45).notNullable();
        table.string("username", 45).notNullable();
        table.string("password", 255).notNullable();
        table.string("profile_picture_url", 255).defaultTo(null);
        table.string("country", 45).defaultTo(null);
        table.string("languages", 255).notNullable();
        table.string("phone_number", 25).defaultTo(null);
        table.tinyint("user_role", 1).notNullable().defaultTo(-1);
        table.tinyint("visible").unsigned().notNullable().defaultTo(1);
        table.datetime("date_created").notNullable().defaultTo(knex.fn.now());
    });
}

export async function down(knex: Knex): Promise<void> {
    return knex.schema.dropTableIfExists("users");
}