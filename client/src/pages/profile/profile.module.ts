import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonModule } from '../../widgets/button/button.module';
import { InputModule } from '../../widgets/input/input.module';
import { ProfileComponent } from './component/profile.component';
import { TagModule } from '../../widgets/tag/tag.module';

import { ProfileRoutingModule } from './profile-routing.module';
import { ProfileFormComponent } from '../../features/profile/profile-form/component/profile-form.component';
import { ProfileCardsComponent } from '../../features/profile/profile-cards/component/profile-cards.component';
import { WorkoutCardModule } from '../../widgets/workout-card/card.module';

@NgModule({
    declarations: [
        ProfileComponent,
        ProfileFormComponent,
        ProfileCardsComponent
    ],
    imports: [
        CommonModule,
        ButtonModule,
        InputModule,
        TagModule,
        ProfileRoutingModule,
        WorkoutCardModule
    ],
    exports: [
        ProfileComponent
    ]
})
export class ProfileModule { }