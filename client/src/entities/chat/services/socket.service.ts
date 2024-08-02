import { Injectable } from '@angular/core';
import { io, Socket } from 'socket.io-client';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class SocketService {
  public readonly socket: Socket;
  private onlineUsersSubject$: BehaviorSubject<any> = new BehaviorSubject<any>(
    []
  );
  public onlineUsers$: Observable<any> =
    this.onlineUsersSubject$.asObservable();

  constructor() {
    this.socket = io('http://localhost:3500');
    this.socket.on('getOnlineUsers', (x) => {
      this.onlineUsersSubject$.next(x);
    });
  }

  // Emit an event
  emitEvent(eventName: string, data: any) {
    this.socket.emit(eventName, data);
  }

  // Listen to an event
  onEvent<T>(eventName: string): Observable<T> {
    return new Observable<T>((observer) => {
      this.socket.on(eventName, (data: T) => observer.next(data));
    });
  }

  // Disconnect the socket
  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
    }
  }
}
