import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ExerciseLibrarySearchComponent } from './component/exercise-library-search/exercise-library-search.component';


@NgModule({
  declarations: [ExerciseLibrarySearchComponent],
  imports: [
    CommonModule
  ],
  exports: [
    ExerciseLibrarySearchComponent
  ]
})
export class ExerciseLibrarySearchModule { }
