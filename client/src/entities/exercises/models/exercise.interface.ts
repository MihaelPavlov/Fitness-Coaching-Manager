export interface IExercise {
  uid: number;
  contributorId: number;
  title: string;
  thumbUri: string;
  difficulty: number;
  equipmentIds: number[];
  description: string;
  tagIds: number[];
  dateCreated: string;
  dateModified: string;
}
