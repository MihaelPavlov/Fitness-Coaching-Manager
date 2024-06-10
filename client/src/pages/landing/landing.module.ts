import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InputModule } from '../../widgets/input/input.module';
import { LandingComponent } from './component/landing.component';
import { ButtonModule } from '../../widgets/button/button.module';
import { RouterModule } from '@angular/router';

@NgModule({
    declarations: [
        LandingComponent
    ],
    imports: [
        CommonModule,
        InputModule,
        ButtonModule,
        RouterModule
    ],
    exports: [
        LandingComponent
    ]
})
export class LandingModule { }