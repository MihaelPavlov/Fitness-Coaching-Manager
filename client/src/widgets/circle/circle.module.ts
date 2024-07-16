import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TagModule } from '../tag/tag.module';
import { CircleComponent } from './component/circle.component';

@NgModule({
  declarations: [CircleComponent],
  imports: [CommonModule],
  exports: [CircleComponent],
})
export class CircleModule {}
