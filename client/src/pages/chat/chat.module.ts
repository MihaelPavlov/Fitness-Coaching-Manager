import { NgModule } from '@angular/core';
import { SharedModule } from '../../shared/shared.module';
import { TagModule } from '../../widgets/tag/tag.module';
import { ChatRoutingModule } from './chat-routing.module';
import { ChatComponent } from './component/chat.component';

@NgModule({
  declarations: [ChatComponent],
  imports: [
    SharedModule,
    TagModule,
    ChatRoutingModule
  ],
  exports: [],
})
export class ChatModule {}
