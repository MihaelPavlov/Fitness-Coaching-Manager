import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonModule } from '../../widgets/button/button.module';
import { InputModule } from '../../widgets/input/input.module';
import { LoginComponent } from './component/login.component';
import { LinkModule } from '../../widgets/link/link.module';

@NgModule({
    declarations: [
        LoginComponent
    ],
    imports: [
        CommonModule,
        ButtonModule,
        InputModule,
        LinkModule
    ],
    exports:[
        LoginComponent
    ]
})
export class LoginModule { }