import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { IMessage } from '../interfaces/message.interface';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class DatabaseService {
  constructor(private http: HttpClient) {}

  API = environment.MESSAGES_API;

  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
  };

  messageList: IMessage[] = [];
  messageTagList: Set<string> = new Set();
  autocompleteTagList: Set<string> = new Set();

  getAllMesagesByTags() {
    const tags = this.messageTagList.size > 0 ? this.messageTagList : '';

    return this.http
      .post<IMessage[]>(`${this.API}`, { tags: [...tags] }, this.httpOptions)
      .subscribe((response) => {
        this.messageList.push(...response);
      });
  }

  createMessage(data: IMessage) {
    return this.http.post<IMessage>(this.API, data);
  }

  addTag(tag: string) {
    if (tag && tag.trim() !== '') {
      this.messageTagList.add(tag.trim());
    }
  }

  removeTag(tag: string) {
    this.messageTagList.delete(tag);
  }

  searchTags(tag: string) {
    return this.http.get(`${this.API}/tags?q=${tag}`).subscribe((data: any) => {
      data.map((i: string) => {
        if (i.trim()) {
          this.autocompleteTagList.add(i);
        }
      });
    });
  }
}
