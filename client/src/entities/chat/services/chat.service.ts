import { Injectable } from '@angular/core';
import { RestApiService } from '../../../shared/services/rest-api.service';
import { PATH } from '../../../shared/configs/path.config';
import { Observable } from 'rxjs';
import { Chat } from '../models/chat.model';
import { IRequestResult } from '../../models/request-result.interface';
import { ChatMessage } from '../models/chat-message.model';

@Injectable({
  providedIn: 'root',
})
export class ChatService {
  constructor(private readonly apiService: RestApiService) {}

  public getUserChats(): Observable<IRequestResult<Chat[]>> {
    return this.apiService.get<IRequestResult<Chat[]>>('chats/getUserChats');
  }

  public getChatMessages(
    chatId: number
  ): Observable<IRequestResult<ChatMessage[]>> {
    return this.apiService.get<IRequestResult<ChatMessage[]>>(
      `chats/getMessages/${chatId}`
    );
  }

  public createMessage(
    chatId: number,
    text: string
  ): Observable<IRequestResult<ChatMessage> | null> {
    return this.apiService.post<IRequestResult<ChatMessage>>(
      `chats/addMessage`,
      {
        chatId,
        text,
      }
    );
  }
}
