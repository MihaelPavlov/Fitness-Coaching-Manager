import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
    return knex.schema.createTableIfNotExists('user_workout_collection', (table) => {
        table.increments('id').primary().unsigned().notNullable().unique();
        table.integer('user_id').unsigned().notNullable();
        table.foreign('user_id').references('users.id')
        table.integer('workout_session_id').unsigned().notNullable();
        table.foreign('workout_session_id').references('workout_session.id');
    })
}

export async function down(knex: Knex): Promise<void> {
    return knex.schema.dropTableIfExists('user_workout_collection');
}

