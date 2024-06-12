import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ExerciseListComponent } from './component/exercise-list.component';

@NgModule({
  declarations: [ExerciseListComponent],
  imports: [
    CommonModule
  ],
  exports: [ExerciseListComponent]
})
export class ExerciseListModule { }
