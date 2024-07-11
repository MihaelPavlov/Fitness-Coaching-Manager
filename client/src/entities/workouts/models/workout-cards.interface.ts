export interface IWorkoutCardsFields {
  title: string,
  owner: WorkoutOwner,
  tags: Array<ITagInterface>,
  rating: number,
  imageUri: string
}

interface ITagInterface {
  name: string
}

interface WorkoutOwner {
  firstName: string
}
