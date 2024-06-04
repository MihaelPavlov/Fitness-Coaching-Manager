import { Component } from '@angular/core';

@Component({
  selector: 'app-exercise-library-search',
  templateUrl: './exercise-library-search.component.html',
  styleUrl: './exercise-library-search.component.scss'
})
export class ExerciseLibrarySearchComponent {

  filterHandler() {
    console.log('Hello World!')
  }
}
