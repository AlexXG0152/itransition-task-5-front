import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { IMessage } from '../interfaces/message.interface';
import { environment } from 'src/environments/environment';
import { Subscription } from 'rxjs/internal/Subscription';
import { Observable } from 'rxjs/internal/Observable';

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

  getAllMesagesByTags(): Subscription {
    const tags = this.messageTagList.size > 0 ? this.messageTagList : '';

    return this.http
      .post<IMessage[]>(`${this.API}`, { tags: [...tags] }, this.httpOptions)
      .subscribe((response) => {
        this.messageList.push(...response);
      });
  }

  createMessage(data: IMessage): Observable<IMessage> {
    return this.http.post<IMessage>(this.API, data);
  }

  addTag(tag: string): void {
    if (tag && tag.trim() !== '') {
      this.messageTagList.add(tag.trim());
    }
  }

  removeTag(tag: string): void {
    this.messageTagList.delete(tag);
  }

  searchTags(tag: string): Subscription {
    return this.http.get(`${this.API}/tags?q=${tag}`).subscribe((data: any) => {
      data.map((i: string) => {
        if (i.trim()) {
          this.autocompleteTagList.add(i);
        }
      });
    });
  }
}
