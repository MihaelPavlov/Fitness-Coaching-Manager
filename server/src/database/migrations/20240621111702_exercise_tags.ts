import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable("exercise_tags", (table) => {
    table.increments("id").primary().unsigned().unique();
    table.string("name", 45).notNullable();
    table.string("icon_uri", 255).notNullable();
    table.string("tag_color", 11).defaultTo(null);
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTableIfExists("exercise_tags");
}
