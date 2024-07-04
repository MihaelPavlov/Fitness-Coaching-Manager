export interface IExercise {
  uid: number;
  contributorId: number;
  title: string;
  thumbUri: string;
  difficulty: number;
  equipmentIds: string;
  description: string;
  tagIds: string;
  dateCreated: string;
  dateModified: string;
}
