import { Component, Input } from '@angular/core';
import { IWorkout } from '../../../../entities/workouts/models/workout.interface';
import { IUserWorkout } from '../../../../entities/users/models/user-workout.interface';

@Component({
  selector: 'app-profile-card-list',
  templateUrl: './profile-cards.component.html',
  styleUrls: ['./profile-cards.component.scss'],
})
export class ProfileCardListComponent {
  @Input() workouts!: IWorkout[];
  @Input() userWorkouts: IUserWorkout[] = [];
  @Input() isUser!: boolean;
}
