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

  ngOnInit(): void {
    this.chatService.getUsername().subscribe((socketId: string) => {
      this.socketId = socketId;
    });

    this.databaseService.getAllMesagesByTags();

    this.chatService.getNewMessage().subscribe((message: any) => {
      if (message.tags?.length !== 0) {
        message.tags?.forEach((tag: string) => {
          if (this.databaseService.messageTagList.has(tag) && message !== '') {
            this.messageList!.push(message);
            return;
          }
        });
      } else if (
        this.databaseService.messageTagList.size === 0 &&
        message !== ''
      ) {
        this.messageList!.push(message);
        return;
      } else if (
        this.databaseService.messageTagList.size !== 0 &&
        message.tags?.length === 0
      ) {
        this.messageList!.push(message);
      }
      this.scrollToBottom();
    });

    this.usernameInput =
      JSON.parse(localStorage.getItem('USERNAME')!) ||
      `anonimous${Date.now().toString().slice(7)}`;

    this.scrollToBottom();
  }

  createMessage(): IMessage | undefined {
    if (this.newMessage.trim() === '') {
      return;
    }

    const tagFormField = [
      ...new Set(
        this.tags
          ?.trim()
          .replaceAll('#', '')
          .split(',')
          .map((i) => i.trim())
      ),
    ];

    tagFormField.push(
      ...new Set(this.newMessage.match(/#\w+/g)?.map((i) => i.replace('#', '')))
    );

    const createTags = [...new Set(tagFormField)];

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

    this.newMessage = '';

    return message;
  }

  sendMessage(): void {
    const message: IMessage = this.createMessage()!;

    this.chatService.sendMessage(message);
    this.databaseService.createMessage(message!);
  }

  setMessageClass(message: IMessage): 'left' | 'right' {
    return (message.user === this.usernameInput ? 'left' : 'right') || '';
  }

  clearTags(): void {
    this.tags = '';
  }

  getMessageTags(tags: string[]): string {
    return tags.map((i: string) => `#${i}`).join(', ');
  }

  setUsername(username: string): void {
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

  clearUsername(): void {
    localStorage.setItem('USERNAME', '');
  }

  scrollToBottom(): void {
    setTimeout(() => {
      const chatContainerEl: HTMLDivElement =
        this.scrollContainer.nativeElement;
      chatContainerEl.scrollTop = chatContainerEl.scrollHeight;
    });
  }
}
