import { Component, Input } from '@angular/core';
import { IExercise } from '../../../entities/exercises/models/exercise.interface';
import { Router } from '@angular/router';

@Component({
  selector: 'app-exercise-card',
  templateUrl: './exercise-card.component.html',
  styleUrls: ['./exercise-card.component.scss'],
})
export class ExerciseCardComponent {
  @Input() exercise!: IExercise;
  imageUrl =
    '../../../shared/assets/images/temporary-exercise-list-placeholder-img.png'; //Provided image
  /**
   *
   */
  constructor(private readonly router: Router) {}
  // get tags

  public navigateToDetails(id: number): void {
    this.router.navigateByUrl(`exercise/details/${id}`);
  }
}
