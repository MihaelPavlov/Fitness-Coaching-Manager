import { Component, HostListener, OnInit } from '@angular/core';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss'],
})
export class ChatComponent implements OnInit {
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
}
