import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ExerciseLibraryComponent } from './component/exercise-library.component';

@NgModule({
  declarations: [ExerciseLibraryComponent],
  imports: [
    CommonModule
  ],
  exports: [
    ExerciseLibraryComponent
  ]
})

export class ExerciseLibraryModule { }
