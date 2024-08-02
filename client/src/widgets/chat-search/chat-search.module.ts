import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChatSearchComponent } from './component/chat-search.component';

@NgModule({
  declarations: [ChatSearchComponent],
  imports: [CommonModule],
  exports: [ChatSearchComponent]
})
export class ChatSearchModule {}
