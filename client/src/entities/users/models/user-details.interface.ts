export interface IUserDetails {
  uid: number;
  firstName?: string;
  lastName?: string;
  userName: string;
  BMI: number;
  workoutCount: number;
  fitnessLevel?: string;
  weight: number;
  weightGoal: number;
  profilePicture?: string;
  preferences?: string;
  birthDate?: string;
  email?: string;
  userRole: number;
  contributorId?: number;
}
