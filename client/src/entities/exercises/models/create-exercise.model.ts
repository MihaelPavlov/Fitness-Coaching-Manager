import { IExerciseEquipment } from "./exercise-equipment.interface";
import { IExerciseTag } from "./exercise-tag.interface";

export interface CreateExercise {
  contributorId: number;
  title: string;
  description: string;
  thumbUri: string;
  difficulty: number;
  equipment:IExerciseEquipment
  tag:IExerciseTag
}
