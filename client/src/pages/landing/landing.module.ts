import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InputModule } from '../../widgets/input/input.module';
import { LandingComponent } from './component/landing.component';

@NgModule({
    declarations: [
        LandingComponent
    ],
    imports: [
        CommonModule,
        InputModule
    ],
    exports:[
        LandingComponent
    ]
})
export class LandingModule { }