import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  selector: 'app-exercise-details',
  templateUrl: './exercise-details.component.html',
  standalone: true,
  imports: [CommonModule],
  styleUrl: './exercise-details.component.scss'
})
export class ExerciseDetailsComponent {

  //setting this for development purposes
  exerciseInstructions = [
    'Begin with legs shoulder width apart and place hands on the floor in a push up position under the shoulders',
    'Kick legs back and lower stomach and thighs to touch the floor',
    'Push from this position while simultaniously bringing kness to the chest planting feet on the ground',
    'Extend upward and jump from this position, extending arms upwards returning to beginning position',
    'Repeat for reps'
  ]
}
