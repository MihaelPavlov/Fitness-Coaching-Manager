import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WorkoutSearchComponent } from './component/workout-search.component';

@NgModule({
  declarations: [WorkoutSearchComponent],
  imports: [CommonModule],
  exports: [WorkoutSearchComponent]
})
export class WorkoutSearchModule {}
