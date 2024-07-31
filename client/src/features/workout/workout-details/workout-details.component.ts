import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { WorkoutService } from '../../../entities/workouts/services/workout.service';

@Component({
  selector: 'app-workout-details',
  templateUrl: './workout-details.component.html',
  styleUrl: './workout-details.component.scss',
})
export class WorkoutDetailsComponent implements OnInit {
  public workoutId?: number;
  public workoutName:string = 'Chest Workout';
  public exercises?: any;

  constructor(
    private readonly router: Router,
    private readonly route: ActivatedRoute,
    private readonly workoutService: WorkoutService
  ){}

  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      this.workoutId = params['workoutId'];
    })
  }

  public navigateToDetails(){
    this.router.navigateByUrl("exercise/details/1");
  }

  public navigateToSession() {
    this.router.navigate([`/workouts/session/${this.workoutId}`]);
  }

  private fetchWorkout(workoutId: number) {

  }
}
