import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
    return knex.schema.createTable("contributors", (table) => {
        table.increments("id").primary().unsigned().unique();
        table.integer("user_id").unsigned()
        table.foreign("user_id").references("users.id");
        table.date("approval_date").defaultTo(null);
        table.string("summary", 500).defaultTo(null);
        table.decimal("rating", 2, 1).unsigned().notNullable().defaultTo(0.0);
        table.tinyint("is_trusted").unsigned().notNullable().defaultTo(0);
    });
}

export async function down(knex: Knex): Promise<void> {
    return knex.schema.dropTableIfExists("contributors");
}

