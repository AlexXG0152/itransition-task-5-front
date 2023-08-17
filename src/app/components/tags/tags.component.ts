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

  messageTagList: Set<string> = this.databaseService.messageTagList;

  newTag!: string;
  filteredTags: Set<string> = this.databaseService.autocompleteTagList;

  addTag(tag: string) {
    if (this.messageTagList.has(tag)) {
      return;
    }
    this.databaseService.addTag(tag);
    this.databaseService.messageList.length = 0;
    this.databaseService.getAllMesagesByTags();
    this.filteredTags.clear();
    this.newTag = '';
  }

  removeTag(tag: string) {
    this.databaseService.removeTag(tag);
    this.databaseService.messageList.length = 0;
    this.databaseService.getAllMesagesByTags();
  }

  searchTags() {
    this.filteredTags.clear();
    this.databaseService.searchTags(this.newTag);
  }

  scrollToBottom() {
    setTimeout(() => {
      const chatContainerEl: HTMLDivElement =
        this.scrollContainer.nativeElement;
      chatContainerEl.scrollTop = chatContainerEl.scrollHeight;
    });
  }
}
