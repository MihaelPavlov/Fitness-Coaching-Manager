import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
    return knex.schema.createTableIfNotExists('user_session', (table) => {
        table.increments('id').primary().unsigned().notNullable().unique();
        table.integer('workout_id').unsigned().notNullable();
        table.integer('user_id').unsigned().notNullable();
        table.tinyint('time_duration').unsigned().defaultTo(null);
        table.integer('calories_burned').unsigned().defaultTo(null);
        table.datetime('start_time').notNullable().defaultTo(knex.raw('CURRENT_TIMESTAMP'));
        table.datetime('end_time').defaultTo(null);
    });
}

export async function down(knex: Knex): Promise<void> {
    return knex.schema.dropTableIfExists('user_session');
}
