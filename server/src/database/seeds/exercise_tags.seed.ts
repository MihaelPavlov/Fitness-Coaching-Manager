import { Knex } from "knex";

export async function seed(knex: Knex): Promise<void> {
  // Deletes ALL existing entries
  await knex("exercise_tags").del();

  // Inserts seed entries
  await knex("exercise_tags").insert([
    { name: "Strength", icon_uri: "/path/to/icon1", tag_color: "#FF5733" },
    { name: "Cardio", icon_uri: "/path/to/icon2", tag_color: "#33FF57" },
    { name: "Flexibility", icon_uri: "/path/to/icon3", tag_color: "#3357FF" },
    { name: "Balance", icon_uri: "/path/to/icon4", tag_color: "#FF33A5" },
    { name: "Speed", icon_uri: "/path/to/icon5", tag_color: "#A533FF" },
    { name: "Endurance", icon_uri: "/path/to/icon6", tag_color: "#33FFA5" },
    { name: "Agility", icon_uri: "/path/to/icon7", tag_color: "#FF5733" },
    { name: "Power", icon_uri: "/path/to/icon8", tag_color: "#FFA533" },
    { name: "Coordination", icon_uri: "/path/to/icon9", tag_color: "#33A5FF" },
    { name: "Precision", icon_uri: "/path/to/icon10", tag_color: "#5733FF" },
    { name: "Stamina", icon_uri: "/path/to/icon11", tag_color: "#33FF57" },
    { name: "Recovery", icon_uri: "/path/to/icon12", tag_color: "#FF3357" },
    { name: "Plyometrics", icon_uri: "/path/to/icon13", tag_color: "#FF5733" },
  ]);
}
