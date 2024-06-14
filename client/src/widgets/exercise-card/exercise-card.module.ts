import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ExerciseCardComponent } from './component/exercise-card.component';
import { TagModule } from '../tag/tag.module';

@NgModule({
  declarations: [ExerciseCardComponent],
  imports: [CommonModule, TagModule],
  exports: [ExerciseCardComponent],
})
export class ExerciseCardModule {}
