import { Component, Input } from '@angular/core';

@Component({
    selector: 'app-workout-edit-card',
    templateUrl: './workout-edit-card.component.html',
    styleUrls: ['./workout-edit-card.component.scss']
})
export class WorkoutEditCardComponent {
  @Input() exercise: any;
}
