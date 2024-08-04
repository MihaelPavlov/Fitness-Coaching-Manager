import {
  AfterViewChecked,
  ChangeDetectorRef,
  Component,
  ElementRef,
  HostListener,
  OnInit,
  ViewChild,
  OnDestroy,
} from '@angular/core';
import { ChatService } from '../../../entities/chat/services/chat.service';
import { Chat } from '../../../entities/chat/models/chat.model';
import { FormControl, FormGroup } from '@angular/forms';
import { SocketService } from '../../../entities/chat/services/socket.service';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { UserService } from '../../../entities/users/services/user.service';
import { IQueryParams } from '../../../entities/models/query-params.interface';
import { IUserDetails } from '../../../entities/users/models/user-details.interface';
import { ActivatedRoute } from '@angular/router';
import { environment } from '../../../shared/environments/environment.development';

export interface GroupedChatMessage {
  senderId: number;
  messages: string[];
  dateCreated: Date;
}

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss'],
})
export class ChatComponent implements OnInit, AfterViewChecked, OnDestroy {
  @ViewChild('chatArea') private chatContainer!: ElementRef;
  @HostListener('window:resize', ['$event'])
  public onResize(event: any): void {
    this.checkScreenSize();
  }

  public inChat: boolean = false;
  public isMobile: boolean = false;
  public chats: Chat[] = [];
  public uniqueUserIds: number[] = [];
  public currentChat!: Chat;
  public currentAvailableUsers: IUserDetails[] = [];
  private shouldScrollToBottom = false;
  public currentChatMessagesSubject$: BehaviorSubject<GroupedChatMessage[]> =
    new BehaviorSubject<GroupedChatMessage[]>([]);
  public chatForm: FormGroup = new FormGroup({
    message: new FormControl(''),
  });
  public navigateWithId: number | null = null;
  public currentChatUser: IUserDetails | null = null;
  public socketOnlineUser!: Observable<any>;
  constructor(
    private readonly chatService: ChatService,
    private readonly cdRef: ChangeDetectorRef,
    private readonly socketService: SocketService,
    private readonly userService: UserService,
    private readonly activeRouter: ActivatedRoute
  ) {
    this.activeRouter.params.subscribe((params) => {
      if (params['id']) {
        this.navigateWithId = params['id'];
      } else {
        this.navigateWithId = null;
      }
    });

    this.socketOnlineUser = this.socketService.onlineUsers$;
    this.socketOnlineUser.subscribe((y: any) => {
      this.fetchUserChats();
      this.cdRef.detectChanges();
    });

    this.socketService.socket.on('getMessage', (message: any) => {
      if (this.currentChat.id !== message.chatId) return;
      const groups = this.currentChatMessagesSubject$.value;

      let currentGroup2: GroupedChatMessage | null | undefined = groups.pop();

      let newGroup: GroupedChatMessage | null = null;
      if (currentGroup2 && currentGroup2.senderId === message.senderId) {
        currentGroup2.messages.push(message.text);
        groups.push(currentGroup2);
      } else {
        if (currentGroup2) {
          groups.push(currentGroup2);
        }
        newGroup = {
          senderId: message.senderId,
          messages: [message.text],
          dateCreated: message.dateCreated,
        };
      }

      if (newGroup) {
        groups.push(newGroup);
      }

      this.currentChatMessagesSubject$.next(groups);
      this.shouldScrollToBottom = true;
      this.cdRef.detectChanges();
    });
  }

  public get getUserRole(): number {
    return this.userService.getUser ? this.userService.getUser.role : 0;
  }

  public setProfilePicture(profilePicture: string | undefined): string {
    return profilePicture
      ? profilePicture.includes('http') || profilePicture.includes('https')
        ? profilePicture
        : environment.files + profilePicture
      : '';
  }

  public getUser(userId: number): Observable<IUserDetails> {
    const user = this.currentAvailableUsers.find((user) => user.uid === userId);
    if (user) return of(user);

    return of();
  }

  public ngOnInit(): void {
    this.checkScreenSize();
    document.querySelector('.main-page')?.classList.add('chat-active');
    this.fetchUserChats();
  }

  private fetchUserChats(): void {
    this.chatService.getUserChats().subscribe((x) => {
      this.chats = x.data;
      this.fetchUsers();
      if (this.navigateWithId) {
        let chat: Chat | null;
        if (this.getUserRole === 1) {
          chat =
            this.chats.find((y) => y.recipientUserId == this.navigateWithId) ??
            null;
        } else {
          chat =
            this.chats.find((y) => y.initiatorUserId == this.navigateWithId) ??
            null;
        }
        if (chat) this.getMessages(chat, this.navigateWithId);
        if (this.isMobile) this.goInChat();
      }
    });
  }

  public ngAfterViewChecked(): void {
    if (this.shouldScrollToBottom) {
      this.scrollToBottom();
      this.shouldScrollToBottom = false;
    }
  }

  public ngOnDestroy(): void {
    document.querySelector('.main-page')?.classList.remove('chat-active');
  }

  public getMessages(chat: Chat, userId: number | null = null): void {
    if (userId) {
      this.currentChatUser =
        this.currentAvailableUsers.find((user) => user.uid === userId) ?? null;
    }
    if (this.isMobile) {
      this.inChat = true;
    }
    this.currentChatMessagesSubject$.next([]);
    this.chatService.getChatMessages(chat.id).subscribe((x) => {
      this.currentChat = chat;
      let currentGroup: GroupedChatMessage | null = null;
      const groups = [];
      for (const message of x.data) {
        if (currentGroup && currentGroup.senderId === message.senderId) {
          currentGroup.messages.push(message.text);
        } else {
          if (currentGroup) {
            groups.push(currentGroup);
          }
          currentGroup = {
            senderId: message.senderId,
            messages: [message.text],
            dateCreated: message.dateCreated,
          };
        }
      }

      if (currentGroup) {
        groups.push(currentGroup);
      }

      this.currentChatMessagesSubject$.next(groups);
      this.shouldScrollToBottom = true;
      this.cdRef.detectChanges();
    });
  }

  public createMessage(): void {
    if (this.currentChat) {
      this.chatService
        .createMessage(this.currentChat.id, this.chatForm.value.message)
        .subscribe((createdMessage: any) => {
          this.getMessages(this.currentChat);
          this.chatForm.reset();
          this.socketService.emitEvent('sendMessage', {
            message: createdMessage.data,
            recipientId:
              this.getActiveUserIdFroMChat() ===
              this.currentChat.initiatorUserId
                ? this.currentChat.recipientUserId
                : this.currentChat.initiatorUserId,
          });
        });
    }
  }

  public isUserOnline(userId: number, onlineUsers: any): boolean {
    const currentUser = this.userService.getUser;
    if (currentUser) {
      return onlineUsers.some((user: any) => user.userId === userId);
    }

    return false;
  }

  public getActiveUserIdFroMChat(): number {
    return this.userService.getUser ? this.userService.getUser.id : -1;
  }

  public goBack(): void {
    if (this.isMobile) {
      this.inChat = false;
      this.navigateWithId = null;
    }
  }

  public goInChat(): void {
    if (this.isMobile) {
      this.inChat = true;
    }
  }

  private fetchUsers(): void {
    const currentUniqueUserIds: number[] = [];
    this.chats.forEach((chat) => {
      if (!this.uniqueUserIds.includes(chat.initiatorUserId)) {
        currentUniqueUserIds.push(chat.initiatorUserId);
      }
      if (!this.uniqueUserIds.includes(chat.recipientUserId)) {
        currentUniqueUserIds.push(chat.recipientUserId);
      }
    });

    if (currentUniqueUserIds.length !== 0) {
      const queryParams: IQueryParams = {
        what: {
          uid: 1,
          firstName: 1,
          lastName: 1,
          userName: 1,
          profilePicture: 1,
        },
        condition: {
          type: 'OR',
          items: currentUniqueUserIds.map((x) => ({
            field: 'uid',
            operation: 'EQ',
            value: x,
          })),
        },
      };

      this.userService.getList(queryParams).subscribe((users) => {
        if (users) {
          const uniqueUsers = users.data.filter(
            (user) =>
              !this.currentAvailableUsers.some(
                (existingUser) => existingUser.uid === user.uid
              )
          );

          this.currentAvailableUsers = [
            ...this.currentAvailableUsers,
            ...uniqueUsers,
          ];
        }
      });

      this.uniqueUserIds.push(...currentUniqueUserIds);
    }
  }

  private checkScreenSize(): void {
    this.isMobile = window.innerWidth <= 768;
  }

  private scrollToBottom(): void {
    this.chatContainer.nativeElement.scrollTop =
      this.chatContainer.nativeElement.scrollHeight;
  }
}
