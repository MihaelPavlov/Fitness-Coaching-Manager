import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonModule } from '../../widgets/button/button.module';
import { InputModule } from '../../widgets/input/input.module';
import { ProfileComponent } from './component/profile.component';
import { TagModule } from '../../widgets/tag/tag.module';
import { ProfileFormModule } from '../../features/profile/profile-form/profile-forms.module';
import { ProfileCardsModule } from '../../features/profile/profile-cards/profile-cards.module';

@NgModule({
    declarations: [
        ProfileComponent
    ],
    imports: [
        CommonModule,
        ButtonModule,
        InputModule,
        TagModule,
        ProfileFormModule,
        ProfileCardsModule
    ],
    exports:[
        ProfileComponent
    ]
})
export class ProfileModule { }