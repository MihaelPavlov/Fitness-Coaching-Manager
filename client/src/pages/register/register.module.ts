import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InputModule } from '../../widgets/input/input.module';
import { ButtonModule } from '../../widgets/button/button.module';
import { RegisterComponent } from './component/register.component';
import { SelectModule } from '../../widgets/select/select.module';
import { ReactiveFormsModule } from '@angular/forms';
import { RegisterRoutingModule } from './register-routing.module';
import { RouterModule } from '@angular/router';
import { ErrorModule } from '../../shared/components/error/error.module';

@NgModule({
  declarations: [RegisterComponent],
  imports: [
    CommonModule,
    InputModule,
    ButtonModule,
    SelectModule,
    ReactiveFormsModule,
    RegisterRoutingModule,
    RouterModule,
    ErrorModule
  ],
  exports: [RegisterComponent]
})
export class RegisterModule { }
