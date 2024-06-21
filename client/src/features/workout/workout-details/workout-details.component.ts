import { Component } from '@angular/core';

@Component({
  selector: 'app-workout-details',
  templateUrl: './workout-details.component.html',
  styleUrl: './workout-details.component.scss',
})
export class WorkoutDetailsComponent {
  workoutName:string = 'Chest Workout'
}
