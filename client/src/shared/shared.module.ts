import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { HeaderComponent } from './layout/header/header.component';
import { MenuContainerComponent } from './layout/menu-container/menu-container.component';

@NgModule({
  declarations: [HeaderComponent, MenuContainerComponent],
  imports: [CommonModule],
  exports: [CommonModule, HeaderComponent, MenuContainerComponent],
  providers: [],
})
export class SharedModule {}
