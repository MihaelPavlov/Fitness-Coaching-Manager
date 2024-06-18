import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WorkoutCardComponent } from './component/workout-card.component';
import { TagModule } from '../tag/tag.module';

@NgModule({
  declarations: [WorkoutCardComponent],
  imports: [CommonModule,TagModule],
  exports: [WorkoutCardComponent],
})
export class WorkoutCardModule {}
