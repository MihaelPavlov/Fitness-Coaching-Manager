import { Component, Input, input } from '@angular/core';
import { IExercise } from '../../../entities/exercises/models/exercise.interface';
import { Router } from '@angular/router';
import { IExerciseTag } from '../../../entities/exercises/models/exercise-tag.interface';

@Component({
  selector: 'app-exercise-card',
  templateUrl: './exercise-card.component.html',
  styleUrls: ['./exercise-card.component.scss'],
})
export class ExerciseCardComponent {
  @Input() exercise!: IExercise;
  @Input() tags!: IExerciseTag[];
  imageUrl =
    '../../../shared/assets/images/temporary-exercise-list-placeholder-img.png'; //Provided image

  constructor(private readonly router: Router) {}

  public navigateToDetails(id: number): void {
    this.router.navigateByUrl(`exercise/details/${id}`);
  }
}
