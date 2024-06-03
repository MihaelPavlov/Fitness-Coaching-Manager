import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InputModule } from '../../widgets/input/input.module';
import { LandingComponent } from './component/landing.component';
import { LogoModule } from '../../widgets/logo/logo.module';
import { RouterModule } from '@angular/router';

@NgModule({
    declarations: [
        LandingComponent
    ],
    imports: [
        CommonModule,
        InputModule,
        LogoModule,
        RouterModule
    ],
    exports:[
        LandingComponent
    ]
})
export class LandingModule { }