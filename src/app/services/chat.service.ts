import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { io } from 'socket.io-client';
import { environment } from 'src/environments/environment';
import { IMessage } from '../interfaces/message.interface';

@Injectable({
  providedIn: 'root',
})
export class ChatService {
  constructor() {}

  socket = io(environment.SOCKET);

  public message$: BehaviorSubject<string> = new BehaviorSubject('');
  public username$: BehaviorSubject<string> = new BehaviorSubject('');

  public sendMessage(message: any) {
    console.log('sendMessage: ', message);
    this.socket.emit('message', message);
  }

  public getNewMessage = () => {
    this.socket.on('message', (message) => {
      this.message$.next(JSON.parse(message).message);
    });

    return this.message$.asObservable();
  };

  public sendUsername(username: string) {
    console.log('sendUsername: ', username);
    this.socket.emit('username', username);
  }

  public getUsername = () => {
    this.socket.on('username', (username) => {
      console.log(username);

      this.username$.next(username.split(':'));
    });

    return this.username$.asObservable();
  };
}
