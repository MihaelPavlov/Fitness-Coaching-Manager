export interface IWorkout {
  title: string,
  owner: WorkoutOwner,
  tags: Array<ITagInterface>,
  rating: number,
  imageUri: string,
  numberOfSets?: number,
  pauseBetweenExercises?: number;
  pauseBetweenSets?: number
}

interface ITagInterface {
  name: string
}

interface WorkoutOwner {
  firstName: string
}
