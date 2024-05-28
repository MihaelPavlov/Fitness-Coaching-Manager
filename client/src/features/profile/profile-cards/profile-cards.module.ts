import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProfileCardsComponent } from './component/profile-cards.component';
import { CardModule } from '../../../widgets/card/card.module';

@NgModule({
    declarations: [ProfileCardsComponent],
    imports: [CommonModule,
        CardModule
    ],
    exports: [ProfileCardsComponent]
})
export class ProfileCardsModule { }