import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-exercise-list',
  templateUrl: './exercise-list.component.html',
  styleUrl: './exercise-list.component.scss',
})
export class ExerciseListComponent {
  @Input() cardText: string = 'Dumbbell Chest Press';

  constructor(public router: Router) {}

  //setting this variable for development purposes - it represent the number of exercises in the list
  //this would be adjusted accordingly when we have a backend and start retrieving data from it
  exerciseCount = [
    1, 2, 3, 4, 5, 6, 7, 8, 9, 1, 1, 1, 1, 11, 1, 1, 1, 1, 1, 1, 1, 1,
  ];

  navigateToDetails() {
    // again, hardocoding this route for development purposes. no backend present yet, so no way to retrieve id of the specific card
    this.router.navigate(['exercise/list/1'])
  }
}
