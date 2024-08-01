import { Component, Input } from '@angular/core';
import { ISessionExercise } from '../../../entities/sessions/models/session-exercise.interface';

@Component({
    selector: 'app-exercise-set-card',
    templateUrl: './exercise-set-card.component.html',
    styleUrls: ['./exercise-set-card.component.scss']
})
export class ExerciseSetCardComponent {
  @Input() exercise?: ISessionExercise
}
