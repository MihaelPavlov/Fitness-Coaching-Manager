import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CardComponent } from './component/card.component';

@NgModule({
    declarations: [CardComponent],
    imports: [CommonModule],
    exports: [CardComponent]
})
export class CardModule { }