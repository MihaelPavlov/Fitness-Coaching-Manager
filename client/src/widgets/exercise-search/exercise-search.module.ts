import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ExerciseSearchComponent } from './component/exercise-search.component';

@NgModule({
  declarations: [ExerciseSearchComponent],
  imports: [CommonModule],
  exports: [ExerciseSearchComponent]
})
export class ExerciseSearchModule {}
