import { Component, ElementRef, ViewChild } from '@angular/core';
import { DatabaseService } from 'src/app/services/database.service';

@Component({
  selector: 'app-tags',
  templateUrl: './tags.component.html',
  styleUrls: ['./tags.component.scss'],
})
export class TagsComponent {
  constructor(private databaseService: DatabaseService) {}

  @ViewChild('scrollContainer') scrollContainer!: ElementRef;

  tags: Set<string> = this.databaseService.tagList;
  newTag!: string;

  addTag(tag: string) {
    this.databaseService.addTag(tag);
    this.newTag = '';
    this.databaseService.messageList.length = 0;
    this.databaseService.getAllMesagesByTags();
  }

  removeTag(tag: string) {
    this.databaseService.removeTag(tag);
    this.databaseService.messageList.length = 0;
    this.databaseService.getAllMesagesByTags();
  }


  scrollToBottom() {
    setTimeout(() => {
      const chatContainerEl: HTMLDivElement =
        this.scrollContainer.nativeElement;
      chatContainerEl.scrollTop = chatContainerEl.scrollHeight;
    });
  }
}
