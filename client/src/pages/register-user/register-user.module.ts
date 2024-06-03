import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InputModule } from '../../widgets/input/input.module';
import { ButtonModule } from '../../widgets/button/button.module';
import { RegisterUserComponent } from './component/register-user.component';
import { LogoModule } from '../../widgets/logo/logo.module';
import { BackgroundSquareComponent } from '../../widgets/background-square/component/background-square.component';
import { BackgroundSquareModule } from '../../widgets/background-square/background-square.module';



@NgModule({
  declarations: [RegisterUserComponent],
  imports: [
    CommonModule,
    InputModule,
    ButtonModule,
    LogoModule,
    BackgroundSquareModule    
  ],
  exports: [RegisterUserComponent]
})
export class RegisterUserModule { }
