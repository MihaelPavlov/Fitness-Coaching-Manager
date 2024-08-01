import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SearchComponent } from './component/search.component';

@NgModule({
  declarations: [SearchComponent],
  imports: [CommonModule],
  exports: [SearchComponent]
})
export class SearchModule {}
