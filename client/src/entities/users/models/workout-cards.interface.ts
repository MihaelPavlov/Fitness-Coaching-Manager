export interface IWorkoutCardsFields {
  title: string,
  tags: Array<ITagInterface>,
  rating: number,
  imageUri: string
}

interface ITagInterface {
  name: string
}
