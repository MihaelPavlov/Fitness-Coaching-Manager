import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-exercise-list',
  templateUrl: './exercise-list.component.html',
  styleUrl: './exercise-list.component.scss'
})
export class ExerciseListComponent {

  @Input() cardText: string = 'Dumbbell Chest Press'
  // setting card id for development purposes - it will be used in routerLink for exercise details
  @Input() exerciseId: number = 1;

  //setting this variable for development purposes - it represent the number of exercises in the list
  //this would be adjusted accordingly when we have a backend and start retrieving data from it
  exerciseCount = [1, 2, 3, 4, 5, 6, 7, 8, 9, 1, 1, 1, 1, 1, 1];
}