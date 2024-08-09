import { Knex } from "knex";

export async function seed(knex: Knex): Promise<void> {
  // Deletes ALL existing entries
  await knex("supported_languages").del();

  // Inserts seed entries
  await knex("supported_languages").insert([
    {
        language: "Bulgarian",
        code: "BG",
        local: "+359"
    },
    {
        language: "English",
        code: "EN",
        local: "+555"
    },
    {
        language: "Russian",
        code: "RU",
        local: "+545"
    },
  ])
}