import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { httpRequestInterceptorProvider } from './interceptors/request.interceptor';

@NgModule({
  declarations: [],
  imports: [CommonModule],
  exports: [CommonModule],
  providers: [],
})
export class SharedModule {}
