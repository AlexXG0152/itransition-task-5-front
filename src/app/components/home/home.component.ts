import { Component } from '@angular/core';
import { ChatService } from 'src/app/services/chat.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent {
  newMessage = '';
  messageList: string[] = [];

  constructor(private chatService: ChatService) {}

  ngOnInit() {
    this.chatService.getNewMessage().subscribe((message: string) => {
      this.messageList.push(message);
    });
  }

  sendMessage() {
    this.chatService.sendMessage(this.newMessage);
    this.newMessage = '';
  }
}
