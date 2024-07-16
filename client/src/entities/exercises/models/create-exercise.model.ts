import { IExerciseEquipment } from "./exercise-equipment.interface";
import { IExerciseTag } from "./exercise-tag.interface";

export interface CreateExercise {
  title: string;
  description: string;
  thumbUri: string;
  difficulty: number;
  equipment:string;
  tag:string;
}
