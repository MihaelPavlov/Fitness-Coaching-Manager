import { Knex } from "knex";

export async function seed(knex: Knex): Promise<void> {
  // Deletes ALL existing entries
  await knex("workout_tags").del();

  // Inserts seed entries
  await knex("workout_tags").insert([
    {
      name: "Morning Routine",
      icon_uri: "/path/to/default/tag.jpg",
      tag_color: "#FF5733",
    },
    {
      name: "Evening Workout",
      icon_uri: "/path/to/default/tag.jpg",
      tag_color: "#33FF57",
    },
    {
      name: "Quick Workout",
      icon_uri: "/path/to/default/tag.jpg",
      tag_color: "#3357FF",
    },
    {
      name: "High Intensity",
      icon_uri: "/path/to/default/tag.jpg",
      tag_color: "#FF33A5",
    },
    {
      name: "Low Intensity",
      icon_uri: "/path/to/default/tag.jpg",
      tag_color: "#A533FF",
    },
    {
      name: "Strength Training",
      icon_uri: "/path/to/default/tag.jpg",
      tag_color: "#33FFA5",
    },
    {
      name: "Cardio Session",
      icon_uri: "/path/to/default/tag.jpg",
      tag_color: "#FF5733",
    },
    {
      name: "Flexibility Routine",
      icon_uri: "/path/to/default/tag.jpg",
      tag_color: "#FFA533",
    },
    {
      name: "Full Body",
      icon_uri: "/path/to/default/tag.jpg",
      tag_color: "#33A5FF",
    },
    {
      name: "Upper Body",
      icon_uri: "/path/to/default/tag.jpg",
      tag_color: "#5733FF",
    },
    {
      name: "Lower Body",
      icon_uri: "/path/to/default/tag.jpg",
      tag_color: "#33FF57",
    },
    {
      name: "Core Focus",
      icon_uri: "/path/to/default/tag.jpg",
      tag_color: "#FF3357",
    },
    {
      name: "Recovery Session",
      icon_uri: "/path/to/default/tag.jpg",
      tag_color: "#FF5733",
    },
  ]);
}
