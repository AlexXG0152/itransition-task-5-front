import { Component, ElementRef, ViewChild } from '@angular/core';

@Component({
  selector: 'app-tags',
  templateUrl: './tags.component.html',
  styleUrls: ['./tags.component.scss'],
})
export class TagsComponent {
  @ViewChild('scrollContainer') scrollContainer!: ElementRef;

  tags: Set<string> = new Set([
    'test1',
    'test2',
    'test3',
  ]);

  newTag!: string;

  addTag(tag: string) {
    if (tag && tag.trim() !== '') {
      this.tags.add(tag.trim());
      this.newTag = '';
    }
  }

  removeTag(tag: string) {
    this.tags.delete(tag);
  }

  scrollToBottom() {
    setTimeout(() => {
      const chatContainerEl: HTMLDivElement =
        this.scrollContainer.nativeElement;
      chatContainerEl.scrollTop = chatContainerEl.scrollHeight;
    });
  }
}
