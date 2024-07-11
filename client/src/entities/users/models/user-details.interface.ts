export interface IPublicUserDetails {
  firstName: string;
  lastName: string;
  BMI: number;
  workoutCount: number;
  fitnessLevel?: string;
  weight: number;
  weightGoal: number;
  profilePicture?: string;
  preferences?: string;
}
export interface IPrivateUserDetails {
  firstName: string;
  lastName: string;
  BMI: number;
  workoutCount: number;
  fitnessLevel?: string;
  weight: number;
  weightGoal: number;
  profilePicture?: string;
  preferences?: string;
  birthDate?: string
}
