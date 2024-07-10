import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TagModule } from '../tag/tag.module';
import { WorkoutEditCardComponent } from './component/workout-edit-card.component';

@NgModule({
  declarations: [WorkoutEditCardComponent],
  imports: [CommonModule,TagModule],
  exports: [WorkoutEditCardComponent],
})
export class WorkoutEditCardModule {}
