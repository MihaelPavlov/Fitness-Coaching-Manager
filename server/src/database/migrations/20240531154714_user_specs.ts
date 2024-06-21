import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
    return knex.schema.createTable("user_specs", (table) => {
        table.increments("id").primary().unsigned().unique();
        table.integer("user_id").unsigned()
        table.foreign("user_id").references("users.id");
        table.tinyint("weight").unsigned().notNullable().defaultTo(0);
        table.tinyint("weight_goal").unsigned().notNullable().defaultTo(0);
        table.tinyint("height").unsigned().notNullable().defaultTo(0);
        table.tinyint("bmi").unsigned().notNullable().defaultTo(0);
        table.tinyint("total_calorie_burned").unsigned().notNullable().defaultTo(0);
        table.integer("total_workouts").notNullable().defaultTo(0);
        table.string("workout_preferences", 45).defaultTo(null);
        table.enum("sex", ["Male", "Female"]).defaultTo(null);
        table.enum("fitness_level", ["Sedentary","Beginner","Intermediate","Advanced", "Elite"]).defaultTo(null);
        table.date("date_of_birth").defaultTo(null);
    });
}

export async function down(knex: Knex): Promise<void> {
    return knex.schema.dropTableIfExists("user_specs");
}