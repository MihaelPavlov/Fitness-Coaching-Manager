import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonModule } from '../../widgets/button/button.module';
import { InputModule } from '../../widgets/input/input.module';
import { LoginComponent } from './component/login.component';
import { LinkModule } from '../../widgets/link/link.module';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { ErrorModule } from '../../shared/components/error/error.module';
import { LoginRoutingModule } from './login-routing.module';

@NgModule({
    declarations: [
        LoginComponent
    ],
    imports: [
        CommonModule,
        ButtonModule,
        InputModule,
        LinkModule,
        ReactiveFormsModule,
        RouterModule,
        ErrorModule,
        LoginRoutingModule,
    ],
    exports:[
        LoginComponent
    ]
})
export class LoginModule { }
