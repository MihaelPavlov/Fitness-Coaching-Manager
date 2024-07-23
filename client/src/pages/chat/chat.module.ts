import { NgModule } from '@angular/core';
import { SharedModule } from '../../shared/shared.module';
import { TagModule } from '../../widgets/tag/tag.module';
import { ChatRoutingModule } from './chat-routing.module';
import { ChatComponent } from './component/chat.component';
import { SearchModule } from '../../widgets/search/search.module';

@NgModule({
  declarations: [ChatComponent],
  imports: [
    SharedModule,
    TagModule,
    ChatRoutingModule,
    SearchModule
  ],
  exports: [],
})
export class ChatModule {}