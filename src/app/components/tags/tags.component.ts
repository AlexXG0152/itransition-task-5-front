import { Component, ElementRef, ViewChild } from '@angular/core';
import { debounceTime, distinctUntilChanged } from 'rxjs';
import { Subject } from 'rxjs/internal/Subject';
import { DatabaseService } from 'src/app/services/database.service';

@Component({
  selector: 'app-tags',
  templateUrl: './tags.component.html',
  styleUrls: ['./tags.component.scss'],
})
export class TagsComponent {
  constructor(private databaseService: DatabaseService) {}

  @ViewChild('scrollContainer') scrollContainer!: ElementRef;

  // selectedTags: Set<string> = new Set([]);
  messageTagList: Set<string>  = this.databaseService.messageTagList
  newTag!: string;

  addTag(tag: string) {
    this.databaseService.addTag(tag);
    // this.selectedTags.add(tag)
    this.databaseService.messageList.length = 0;
    this.databaseService.getAllMesagesByTags();
    this.filteredTags.clear()
    this.newTag = '';
  }

  removeTag(tag: string) {
    this.databaseService.removeTag(tag);
    // this.selectedTags.delete(tag);
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

  filteredTags: Set<string>  = this.databaseService.searchTagList

  searchTags() {
    this.filteredTags.clear()
    this.databaseService.searchTags(this.newTag)
  }

  selectTag(tag: string) {
    this.messageTagList.add(tag)
    this.filteredTags.clear()
  }
}
