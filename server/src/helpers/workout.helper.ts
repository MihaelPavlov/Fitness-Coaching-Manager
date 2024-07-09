import { WorkoutTagsBuilder } from "./../query-builders/workout-tags.builder";

export const mapWorkouts = async (workouts: Array<any>) => {
  return await Promise.all(
    workouts.map(async (el) => {
      if (el.tags) {
        el.tags = el.tags.split(",");
        el.tags = await mapTagIds(el.tags);
      }
      return el;
    })
  );
};

const mapTagIds = async (tags: Array<string>) => {
  return await Promise.all(
    tags.map(async (tagId) => {
      const tag = new WorkoutTagsBuilder({
        what: {
          name: 1,
        },
        condition: {
          type: "AND",
          items: [
            {
              field: "uid",
              operation: "EQ",
              value: Number(tagId),
            },
          ],
        },
      });
      return (await tag.buildQuery()).at(0);
    })
  );
};
