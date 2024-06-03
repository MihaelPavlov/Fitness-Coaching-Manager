import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { LogoComponent } from './logo/logo.component';

@NgModule({
  declarations: [LogoComponent],
  imports: [CommonModule],
  exports: [CommonModule, LogoComponent],
  providers: [],
})
export class SharedModule {}
