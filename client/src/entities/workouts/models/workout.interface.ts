export interface IWorkout {
  uid?: number;
  title: string,
  owner: WorkoutOwner,
  tags: Array<ITagInterface>,
  rating: number,
  imageUri: string,
  numberOfSets?: number,
  pauseBetweenExercises?: number;
  pauseBetweenSets?: number
}

export interface ITagInterface {
  uid: number;
  name: string
}

interface WorkoutOwner {
  firstName: string
}
