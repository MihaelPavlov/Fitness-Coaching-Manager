import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProfileFormComponent } from './component/profile-form.component';
import { ButtonModule } from '../../../widgets/button/button.module';
import { InputModule } from '../../../widgets/input/input.module';

@NgModule({
    declarations: [ProfileFormComponent],
    imports: [CommonModule,
        ButtonModule,
        InputModule,],
    exports: [ProfileFormComponent]
})
export class ProfileFormModule { }