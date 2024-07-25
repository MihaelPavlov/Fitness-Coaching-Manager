import { Component, HostListener, OnInit, OnDestroy } from '@angular/core';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss'],
})
export class ChatComponent implements OnInit,OnDestroy {
  public inChat: boolean = false;
  public isMobile: boolean = false;

  constructor() {
    this.checkScreenSize();
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: any): void {
    this.checkScreenSize();
  }

  ngOnInit(): void {
    this.checkScreenSize();
    document.querySelector('.main-page')?.classList.add('chat-active');
  }

  private checkScreenSize(): void {
    this.isMobile = window.innerWidth <= 768;
  }

  public goBack(): void {
    if (this.isMobile) {
      this.inChat = false;
    }
  }

  public goInChat(): void {
    if (this.isMobile) {
      this.inChat = true;
    }
  }

  ngOnDestroy(): void {
    document.querySelector('.main-page')?.classList.remove('chat-active');
  }
}
