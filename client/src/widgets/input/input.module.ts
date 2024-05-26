import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InputComponent } from './component/input.component';

@NgModule({
  declarations: [InputComponent],
  imports: [CommonModule],
  exports: [InputComponent]
})
export class InputModule {}