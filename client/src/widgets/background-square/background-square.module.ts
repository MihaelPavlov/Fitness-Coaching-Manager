import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BackgroundSquareComponent } from './component/background-square.component';



@NgModule({
  declarations: [BackgroundSquareComponent],
  imports: [
    CommonModule
  ],
  exports: [BackgroundSquareComponent]
})
export class BackgroundSquareModule { }
