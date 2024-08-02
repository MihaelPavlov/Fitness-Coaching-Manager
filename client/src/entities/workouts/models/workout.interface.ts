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
  uid: number;
  name: string
}

interface WorkoutOwner {
  firstName: string
}
