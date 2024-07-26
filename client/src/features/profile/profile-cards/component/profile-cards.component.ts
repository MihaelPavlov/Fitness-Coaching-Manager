import { Component, Input } from '@angular/core';
import { IWorkoutCardsFields } from '../../../../entities/workouts/models/workout-cards.interface';

@Component({
  selector: 'app-profile-card-list',
  templateUrl: './profile-cards.component.html',
  styleUrls: ['./profile-cards.component.scss'],
})
export class ProfileCardListComponent {
  @Input() workouts!: IWorkoutCardsFields[];
  @Input() isUser!: boolean;
}
