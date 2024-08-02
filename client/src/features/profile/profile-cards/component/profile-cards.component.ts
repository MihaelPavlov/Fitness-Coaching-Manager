import { Component, Input } from '@angular/core';
import { IWorkout } from '../../../../entities/workouts/models/workout.interface';

@Component({
  selector: 'app-profile-card-list',
  templateUrl: './profile-cards.component.html',
  styleUrls: ['./profile-cards.component.scss'],
})
export class ProfileCardListComponent {
  @Input() workouts!: IWorkout[];
  @Input() isUser!: boolean;
}
