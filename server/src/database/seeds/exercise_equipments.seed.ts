import { Knex } from "knex";

export async function seed(knex: Knex): Promise<void> {
  // Deletes ALL existing entries
  await knex("exercise_equipments").del();

  // Inserts seed entries
  await knex("exercise_equipments").insert([
    {
      title: "Treadmill",
      equipment_type: "indoor",
      icon_uri: "/path/to/icon1",
      tag_color: "#FF5733",
    },
    {
      title: "Dumbbells",
      equipment_type: "indoor",
      icon_uri: "/path/to/icon2",
      tag_color: "#33FF57",
    },
    {
      title: "Barbell",
      equipment_type: "gym",
      icon_uri: "/path/to/icon3",
      tag_color: "#3357FF",
    },
    {
      title: "Kettlebell",
      equipment_type: "indoor",
      icon_uri: "/path/to/icon4",
      tag_color: "#FF33A5",
    },
    {
      title: "Resistance Bands",
      equipment_type: "indoor",
      icon_uri: "/path/to/icon5",
      tag_color: "#A533FF",
    },
    {
      title: "Rowing Machine",
      equipment_type: "indoor",
      icon_uri: "/path/to/icon6",
      tag_color: "#33FFA5",
    },
    {
      title: "Exercise Bike",
      equipment_type: "indoor",
      icon_uri: "/path/to/icon7",
      tag_color: "#FF5733",
    },
    {
      title: "Jump Rope",
      equipment_type: "outdoor",
      icon_uri: "/path/to/icon8",
      tag_color: "#FFA533",
    },
    {
      title: "Pull-Up Bar",
      equipment_type: "gym",
      icon_uri: "/path/to/icon9",
      tag_color: "#33A5FF",
    },
    {
      title: "Medicine Ball",
      equipment_type: "indoor",
      icon_uri: "/path/to/icon10",
      tag_color: "#5733FF",
    },
    {
      title: "Battle Ropes",
      equipment_type: "gym",
      icon_uri: "/path/to/icon11",
      tag_color: "#33FF57",
    },
    {
      title: "Sandbag",
      equipment_type: "outdoor",
      icon_uri: "/path/to/icon12",
      tag_color: "#FF3357",
    },
    {
      title: "Foam Roller",
      equipment_type: "indoor",
      icon_uri: "/path/to/icon13",
      tag_color: "#FF5733",
    },
  ]);
}
