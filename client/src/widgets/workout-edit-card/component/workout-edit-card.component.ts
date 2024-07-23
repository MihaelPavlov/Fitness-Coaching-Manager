import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
    selector: 'app-workout-edit-card',
    templateUrl: './workout-edit-card.component.html',
    styleUrls: ['./workout-edit-card.component.scss']
})
export class WorkoutEditCardComponent {
  @Input() exercise: any;
  @Input() numberOfSets?: number | string = 0;

  @Output() removeExercise = new EventEmitter<any>()

  public onRemove() {
    this.removeExercise.emit(this.exercise);
  }
}
