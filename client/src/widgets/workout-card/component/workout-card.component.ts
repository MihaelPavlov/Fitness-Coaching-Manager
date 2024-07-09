import { Component, Input } from '@angular/core';
import { IWorkoutCardsFields } from '../../../entities/users/models/workout-cards.interface';

@Component({
    selector: 'app-workout-card',
    templateUrl: './workout-card.component.html',
    styleUrls: ['./workout-card.component.scss']
})
export class WorkoutCardComponent {
  @Input() workout: IWorkoutCardsFields | undefined;
}
