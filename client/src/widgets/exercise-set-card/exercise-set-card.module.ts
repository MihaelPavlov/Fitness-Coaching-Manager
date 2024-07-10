import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TagModule } from '../tag/tag.module';
import { ExerciseSetCardComponent } from './component/exercise-set-card.component';

@NgModule({
  declarations: [ExerciseSetCardComponent],
  imports: [CommonModule, TagModule],
  exports: [ExerciseSetCardComponent],
})
export class ExerciseSetCardModule {}
