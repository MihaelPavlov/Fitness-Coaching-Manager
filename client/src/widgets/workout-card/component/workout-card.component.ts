import { Component, Input } from '@angular/core';
import { IWorkoutCardsFields } from '../../../entities/workouts/models/workout-cards.interface';

@Component({
  selector: 'app-workout-card',
  templateUrl: './workout-card.component.html',
  styleUrls: ['./workout-card.component.scss'],
})
export class WorkoutCardComponent {
  @Input() workout: IWorkoutCardsFields | undefined;

  public starsCount(): Array<any> {
    if (this.workout?.rating === 0) return Array(1).fill(0);
    return Array(this.workout?.rating).fill(0);
  }
}
