import type { Knex } from "knex";


export async function up(knex: Knex): Promise<void> {
    return knex.schema.createTableIfNotExists("chats", (table) => {
        table.increments('id').primary().unsigned().notNullable().unique();
        table.integer('initiator_user_id').unsigned().notNullable();
        table.foreign('initiator_user_id').references('users.id');
        table.integer('recipient_user_id').unsigned().notNullable();
        table.foreign('recipient_user_id').references('users.id');
        table.boolean("is_active").notNullable().defaultTo(1);
        table.datetime('date_created').notNullable().defaultTo(knex.fn.now());
    });
}

export async function down(knex: Knex): Promise<void> {
    return knex.schema.dropTableIfExists("chats");
}

