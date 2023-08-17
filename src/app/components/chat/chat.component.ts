import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { IMessage } from 'src/app/interfaces/message.interface';
import { ChatService } from 'src/app/services/chat.service';
import { DatabaseService } from 'src/app/services/database.service';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss'],
})
export class ChatComponent implements OnInit {
  @ViewChild('scrollContainer') scrollContainer!: ElementRef;

  socketId!: string;
  usernameInput?: string;

  newMessage: string = '';
  messageList?: IMessage[] = this.databaseService.messageList;
  tags?: string;

  constructor(
    private chatService: ChatService,
    private databaseService: DatabaseService
  ) {}

  ngOnInit() {
    this.chatService.getUsername().subscribe((socketId: string) => {
      this.socketId = socketId;
    });

    this.databaseService.getAllMesagesByTags();

    this.chatService.getNewMessage().subscribe((message: any) => {
      if (message !== '') {
        this.messageList!.push(message);
      }
      this.scrollToBottom();
    });

    this.usernameInput =
      JSON.parse(localStorage.getItem('USERNAME')!) ||
      `anonimous${Date.now().toString().slice(7)}`;

    this.scrollToBottom();
  }

  sendMessage() {
    if (this.newMessage.trim() === '') {
      return;
    }

    const createTags = [
      ...new Set(
        this.tags
          ?.trim()
          .replaceAll('#', '')
          .split(',')
          .map((i) => i.trim())
      ),
      ...new Set(
        this.newMessage.match(/#\w+/g)?.map((i) => i.replace('#', ''))
      ),
    ];

    if (createTags[0] === '') {
      createTags.length = 0;
    }

    const message: IMessage = {
      socketId: this.socketId[0],
      user: this.usernameInput,
      text: this.newMessage.trim(),
      date: Date.now().toString(),
      tags: createTags,
    };

    this.chatService.sendMessage(message);
    this.databaseService.createMessage(message);

    this.newMessage = '';
  }

  setMessageClass(message: IMessage) {
    return (message.user === this.usernameInput ? 'left' : 'right') || '';
  }

  clearTags() {
    this.tags = '';
  }

  getMessageTags(tags: string[]) {
    return tags.map((i: string) => `#${i}`).join(', ');
  }

  setUsername(username: string) {
    if (username.trim().length === 0) {
      localStorage.setItem(
        'USERNAME',
        `anonimous${Date.now().toString().slice(7)}`
      );
      return;
    }

    this.usernameInput = username;
    localStorage.setItem('USERNAME', JSON.stringify(username));
    this.chatService.sendUsername(username);
  }

  clearUsername() {
    localStorage.setItem('USERNAME', '');
  }

  scrollToBottom() {
    setTimeout(() => {
      const chatContainerEl: HTMLDivElement =
        this.scrollContainer.nativeElement;
      chatContainerEl.scrollTop = chatContainerEl.scrollHeight;
    });
  }
}
