import { UserBuilder } from "./../query-builders/user.builder";
import { WorkoutTagsBuilder } from "./../query-builders/workout-tags.builder";

export const sortWorkouts = (workouts: Array<any>) => {
  workouts = workouts.sort((a, b) => b.rating-a.rating);
}

export const mapWorkouts = async (workouts: Array<any>) => {
  return await Promise.all(
    workouts.map(async (el) => {
      if (el.tags) { // Map Tags
        el.tags = el.tags.split(",");
        el.tags = await mapTagIds(el.tags);
      }

      // Map owner
      el.owner = await mapWorkoutOwner(el.owner);

      return el;
    })
  );
};

const mapWorkoutOwner = async (ownerId: number) => {
  return (await new UserBuilder({
    what: {
      firstName: 1
    },
    id: ownerId
  }).buildQuery()).at(0);
}

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
