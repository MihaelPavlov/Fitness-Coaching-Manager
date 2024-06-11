import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ExerciseListComponent } from './component/exercise-list.component';
import { RouterModule } from '@angular/router';



@NgModule({
  declarations: [ExerciseListComponent],
  imports: [
    CommonModule,
    RouterModule
  ],
  exports: [ExerciseListComponent]
})
export class ExerciseListModule { }
