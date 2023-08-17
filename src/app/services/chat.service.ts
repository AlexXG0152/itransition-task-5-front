import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { io } from 'socket.io-client';
import { environment } from 'src/environments/environment';
import { IMessage } from '../interfaces/message.interface';

@Injectable({
  providedIn: 'root',
})
export class ChatService {
  socket = io(environment.SOCKET, {
    path: '/my-custom-path/',
  });

  public message$: BehaviorSubject<string> = new BehaviorSubject('');
  public username$: BehaviorSubject<string> = new BehaviorSubject('');

  public sendMessage(message: IMessage): void {
    this.socket.emit('message', message);
  }

  public getNewMessage(): Observable<string> {
    this.socket.on('message', (message) => {
      this.message$.next(JSON.parse(message).message);
    });

    return this.message$.asObservable();
  }

  public sendUsername(username: string): void {
    this.socket.emit('username', username);
  }

  public getUsername(): Observable<string> {
    this.socket.on('username', (username) => {
      this.username$.next(username.split(':'));
    });

    return this.username$.asObservable();
  }
}
