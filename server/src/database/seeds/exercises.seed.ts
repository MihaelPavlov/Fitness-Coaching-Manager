import { Knex } from "knex";

export async function seed(knex: Knex): Promise<void> {
  // Deletes ALL existing entries
  await knex("exercises").del();

  // Inserts seed entries
  await knex("exercises").insert([
    {  title: "Push-Up", thumb_uri: "exercise1.jpg", difficulty: 2, equipment_ids: "2,3", description: "A basic push-up exercise", tag_ids: "1,2" },
    {  title: "Running", thumb_uri: "exercise2.jpg", difficulty: 3, equipment_ids: "1", description: "Running exercise", tag_ids: "2" },
    { title: "Yoga Stretch", thumb_uri: "exercise3.jpg", difficulty: 1, equipment_ids: "", description: "A relaxing yoga stretch", tag_ids: "3" },
    {  title: "Squat", thumb_uri: "exercise4.jpg", difficulty: 2, equipment_ids: "3", description: "Basic squat exercise", tag_ids: "1,4" },
    {  title: "Plank", thumb_uri: "exercise5.jpg", difficulty: 2, equipment_ids: "", description: "Plank exercise for core", tag_ids: "1,3" },
    {  title: "Burpee", thumb_uri: "exercise6.jpg", difficulty: 1, equipment_ids: "", description: "High intensity burpee exercise", tag_ids: "2,4" },
    {  title: "Deadlift", thumb_uri: "exercise7.jpg", difficulty: 3, equipment_ids: "3", description: "Deadlift for strength", tag_ids: "1" },
    {  title: "Bicep Curl", thumb_uri: "exercise8.jpg", difficulty: 2, equipment_ids: "2", description: "Bicep curl exercise", tag_ids: "1" },
    {  title: "Mountain Climbers", thumb_uri: "exercise9.jpg", difficulty: 3, equipment_ids: "", description: "Mountain climbers for cardio", tag_ids: "2" },
    { title: "Lunges", thumb_uri: "exercise10.jpg", difficulty: 2, equipment_ids: "3", description: "Lunges exercise", tag_ids: "1,4" },
    { title: "Pull-Ups", thumb_uri: "exercise11.jpg", difficulty: 1, equipment_ids: "9", description: "Pull-ups for upper body", tag_ids: "1" },
    { title: "Bench Press", thumb_uri: "exercise12.jpg", difficulty: 3, equipment_ids: "3", description: "Bench press exercise", tag_ids: "1" },
    { title: "Box Jumps", thumb_uri: "exercise13.jpg", difficulty: 3, equipment_ids: "", description: "Box jumps for power", tag_ids: "4" }
  ]);
}
