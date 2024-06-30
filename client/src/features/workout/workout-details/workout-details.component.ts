import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-workout-details',
  templateUrl: './workout-details.component.html',
  styleUrl: './workout-details.component.scss',
})
export class WorkoutDetailsComponent {
  workoutName:string = 'Chest Workout'

  constructor(private readonly router:Router){}

  navigateToDetails(){
    this.router.navigateByUrl("exercise/details/1");
  }
}
