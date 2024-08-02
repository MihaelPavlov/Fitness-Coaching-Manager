import { Component, Input } from '@angular/core';
import { IWorkout } from '../../../entities/workouts/models/workout.interface';
import { Router } from '@angular/router';

@Component({
  selector: 'app-workout-card',
  templateUrl: './workout-card.component.html',
  styleUrls: ['./workout-card.component.scss'],
})
export class WorkoutCardComponent {
  @Input() workout!: IWorkout;

  constructor(
    private readonly router: Router
  ) {}

  public navigateToWorkout() {
    this.router.navigate([`/workout/details/${this.workout.uid}`])
  }

  public starsCount(): Array<any> {
    if (this.workout?.rating === 0) return Array(1).fill(0);
    return Array(this.workout?.rating).fill(0);
  }
}
