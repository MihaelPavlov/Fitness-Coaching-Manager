import type { Knex } from "knex";


export async function up(knex: Knex): Promise<void> {
    return knex.schema.createTableIfNotExists("chat_messages", (table) => {
        table.increments('id').primary().unsigned().notNullable().unique();
        table.integer('chat_id').unsigned().notNullable();
        table.foreign('chat_id').references('chats.id');
        table.integer('sender_id').unsigned().notNullable();
        table.foreign('sender_id').references('users.id');
        table.string("text",1000).notNullable();
        table.datetime('date_created').notNullable().defaultTo(knex.fn.now());
    });
}

export async function down(knex: Knex): Promise<void> {
    return knex.schema.dropTableIfExists("chat_messages");
}

