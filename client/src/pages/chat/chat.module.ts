import { NgModule } from '@angular/core';
import { SharedModule } from '../../shared/shared.module';
import { TagModule } from '../../widgets/tag/tag.module';
import { ChatRoutingModule } from './chat-routing.module';

@NgModule({
  declarations: [],
  imports: [
    SharedModule,
    TagModule,
    ChatRoutingModule
  ],
  exports: [],
})
export class ChatModule {}
