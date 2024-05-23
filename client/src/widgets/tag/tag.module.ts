import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TagComponent } from './component/tag.component';

@NgModule({
  declarations: [TagComponent],
  imports: [CommonModule],
  exports: [TagComponent]
})
export class TagModule {}