import { NgModule } from '@angular/core';
import { SharedModule } from '../../shared/shared.module';
import { TagModule } from '../../widgets/tag/tag.module';
import { ChatRoutingModule } from './chat-routing.module';
import { ChatComponent } from './component/chat.component';
import { ReactiveFormsModule } from '@angular/forms';
import { ChatSearchModule } from '../../widgets/chat-search/chat-search.module';

@NgModule({
  declarations: [ChatComponent],
  imports: [
    SharedModule,
    TagModule,
    ChatRoutingModule,
    ReactiveFormsModule,
    ChatSearchModule
  ],
  exports: [],
})
export class ChatModule {}
