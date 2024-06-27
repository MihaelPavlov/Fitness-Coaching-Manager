import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable("exercise_equipments", (table) => {
    table.increments("id").primary().unsigned().unique();
    table.string("title", 45).notNullable();
    table.enum("equipment_type", ["indoor", "outdoor", "gym"]).notNullable();
    table.string("icon_uri", 255).notNullable();
    table.string("tag_color", 11).defaultTo(null);
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTableIfExists("exercise_equipments");
}
