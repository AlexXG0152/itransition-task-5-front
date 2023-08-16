import { Component, ElementRef, ViewChild } from '@angular/core';
import { IMessage } from 'src/app/interfaces/message.interface';
import { ChatService } from 'src/app/services/chat.service';
import { DatabaseService } from 'src/app/services/database.service';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss'],
})
export class ChatComponent {
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

    // this.databaseService.getAllMesages().subscribe((data: IMessage[]) => {
    //   console.log('databaseService', data);

    //   this.messageList.push(...data);
    // });

    // this.databaseService.getAllMesagesByTags(['test1']).subscribe((data: IMessage[]) => {
    //   console.log('databaseService', data);

    //   this.messageList.push(...data);
    // });

    this.chatService.getNewMessage().subscribe((message: any) => {
      if (message !== '') {
        this.messageList!.push(message);
      }

      // if (message === '') {
      //   return;
      // }
      // if (message.tags.length === 0) {
      //   this.messageList!.push(message);
      // }
      // for (const tag of message.tags) {
      //   if (this.databaseService.tagList.has(tag)) {
      //     this.messageList!.push(message);
      //   }
      // }
    });

    this.usernameInput =
      JSON.parse(localStorage.getItem('USERNAME')!) || 'anonimous12345';
  }

  sendMessage() {
    if (this.newMessage.trim() === '') {
      return;
    }

    const message: IMessage = {
      socketId: this.socketId[0],
      user: this.usernameInput,
      text: this.newMessage.trim(),
      date: Date.now().toString(),
      tags: [
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
      ],
    };

    this.chatService.sendMessage(message);
    this.databaseService.createMessage(message);

    this.newMessage = '';
    this.scrollToBottom();
  }

  getMessageClass(message: IMessage) {
    return (message.user === this.usernameInput ? 'left' : 'right') || '';
  }

  clearTags() {
    this.tags = '';
  }

  setUsername(username: string) {
    if (username.trim().length === 0) {
      localStorage.setItem('USERNAME', 'anonimous12345');
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

  getMessageTags(tags: string[]) {
    return tags.map((i: string) => `#${i}`).join(', ');
  }
}
