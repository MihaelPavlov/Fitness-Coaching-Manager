import { Component, Input, OnChanges } from '@angular/core';
import { IWorkout } from '../../../entities/workouts/models/workout.interface';
import { Router } from '@angular/router';
import { UserService } from '../../../entities/users/services/user.service';
import { UserRoles } from '../../../shared/enums/user-roles.enum';
import { IUserWorkout } from '../../../entities/users/models/user-workout.interface';

@Component({
  selector: 'app-workout-card',
  templateUrl: './workout-card.component.html',
  styleUrls: ['./workout-card.component.scss'],
})
export class WorkoutCardComponent implements OnChanges {
  @Input() workout!: IWorkout;
  @Input() userWorkouts: IUserWorkout[] = [];

  public isCardAdded: boolean = false;
  constructor(
    private readonly router: Router,
    private readonly userService: UserService
  ) {}

  public get canUserAddCard(): boolean {
    return this.userService.getUser?.role === UserRoles.User;
  }

  public ngOnChanges(): void {
    if (this.workout && this.userWorkouts) {
      this.isCardAdded = this.userWorkouts.some(
        (x) => x.workoutSessionId === this.workout.uid
      );
    }
  }

  public navigateToWorkout(): void {
    this.router.navigate([`/workout/details/${this.workout.uid}`]);
  }

  public starsCount(): Array<any> {
    if (this.workout?.rating === 0) return Array(1).fill(0);
    return Array(this.workout?.rating).fill(0);
  }

  public onAdd(): void {
    if (this.workout.uid) {
      this.userService.addToCollection(this.workout.uid).subscribe();
      this.isCardAdded = true;
    }
  }

  public onRemove(): void {
    if (this.workout.uid) {
      this.userService.removeFromCollection(this.workout.uid).subscribe();
      this.isCardAdded = false;
    }
  }
}
