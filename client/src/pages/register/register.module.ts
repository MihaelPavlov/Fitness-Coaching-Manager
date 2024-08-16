import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RegisterComponent } from './component/register.component';
import { ReactiveFormsModule } from '@angular/forms';
import { RegisterRoutingModule } from './register-routing.module';
import { RouterModule } from '@angular/router';
import { ErrorModule } from '../../shared/components/error/error.module';
import { LoaderModule } from '../../shared/components/loader/loader.module';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';


@NgModule({
  declarations: [RegisterComponent],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RegisterRoutingModule,
    RouterModule,
    ErrorModule,
    LoaderModule,
    NgMultiSelectDropDownModule
  ],
  exports: [RegisterComponent]
})
export class RegisterModule { }
