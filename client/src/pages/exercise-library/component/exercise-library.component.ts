import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-exercise-library',
  templateUrl: './exercise-library.component.html',
  styleUrl: './exercise-library.component.scss'
})
export class ExerciseLibraryComponent {
  @Input() pageName: string = 'Exercises'
}
