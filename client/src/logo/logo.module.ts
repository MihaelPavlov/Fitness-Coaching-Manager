import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LogoComponent } from './component/logo.component';
import { RouterModule } from '@angular/router';

@NgModule({
  declarations: [LogoComponent],
  imports: [CommonModule,RouterModule],
  exports: [LogoComponent]
})
export class LogoModule {}