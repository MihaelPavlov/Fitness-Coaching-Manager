import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InputModule } from '../../widgets/input/input.module';
import { ButtonModule } from '../../widgets/button/button.module';
import { RegisterUserComponent } from './component/register-user.component';



@NgModule({
  declarations: [RegisterUserComponent],
  imports: [
    CommonModule,
    InputModule,
    ButtonModule
    
  ],
  exports: [RegisterUserComponent]
})
export class RegisterUserModule { }
