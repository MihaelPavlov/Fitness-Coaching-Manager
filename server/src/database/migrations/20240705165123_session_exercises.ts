import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
    return knex.schema.createTableIfNotExists("session_exercises", (table) => {
        table.increments('id').primary().unsigned().notNullable().unique();
        table.integer('session_id').unsigned().notNullable();
        table.foreign('session_id').references('workout_session.id');
        table.integer('exercise_id').unsigned().notNullable();
        table.foreign('exercise_id').references('exercises.id');
        table.tinyint('rank').unsigned().notNullable();
        table.string('description', 255).defaultTo(null);
        table.boolean('has_timing').notNullable().defaultTo(0);
        table.integer('time_duration').unsigned().notNullable().defaultTo(0);
        table.integer('reps').unsigned().notNullable().defaultTo(1);
    });
}

export async function down(knex: Knex): Promise<void> {
    return knex.schema.dropTableIfExists("session_exercises");
}