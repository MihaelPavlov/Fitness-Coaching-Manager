import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-exercise-library-search',
  templateUrl: './exercise-library-search.component.html',
  styleUrl: './exercise-library-search.component.scss'
})
export class ExerciseLibrarySearchComponent {

  @Input() toggleFilterForm: boolean = false;

  filterHandler() {
    this.toggleFilterForm = !this.toggleFilterForm;
  }
}
