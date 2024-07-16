import { Component } from '@angular/core';

@Component({
  selector: 'app-workout-session',
  templateUrl: './workout-session.component.html',
  styleUrl: './workout-session.component.scss',
})
export class WorkoutSessionComponent {
  workoutName: string = 'Chest Workout';
}
