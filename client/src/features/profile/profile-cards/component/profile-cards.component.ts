import { Component, Input } from '@angular/core';
import { IWorkoutCardsFields } from '../../../../entities/users/models/workout-cards.interface';

@Component({
  selector: 'app-profile-cards',
  templateUrl: './profile-cards.component.html',
  styleUrls: ['./profile-cards.component.scss']
})
export class ProfileCardsComponent {
  @Input() workouts: IWorkoutCardsFields[] | undefined;
}
