import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoginComponent } from './component/login.component';
import { LinkModule } from '../../widgets/link/link.module';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { ErrorModule } from '../../shared/components/error/error.module';
import { LoaderModule } from '../../shared/components/loader/loader.module';
import { LoginRoutingModule } from './login-routing.module';

@NgModule({
  declarations: [LoginComponent],
  imports: [
    CommonModule,
    LinkModule,
    ReactiveFormsModule,
    RouterModule,
    ErrorModule,
    LoaderModule,
    LoginRoutingModule,
  ],
  exports: [LoginComponent],
})
export class LoginModule {}
