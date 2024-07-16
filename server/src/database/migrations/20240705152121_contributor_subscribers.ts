import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
    return knex.schema.createTableIfNotExists("contributor_subscribers", (table) => {
        table.increments('id').primary().unsigned().notNullable().unique();
        table.integer('contributor_id').unsigned().notNullable();
        table.foreign('contributor_id').references('contributors.id')
        table.integer('user_id').unsigned().notNullable();
        table.foreign('user_id').references('users.id');
    });
}

export async function down(knex: Knex): Promise<void> {
    return knex.schema.dropTableIfExists("contributor_subscribers");
}

