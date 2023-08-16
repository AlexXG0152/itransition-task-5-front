import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { IMessage } from '../interfaces/message.interface';
import { environment } from 'src/environments/environment';
import { of } from 'rxjs/internal/observable/of';

@Injectable({
  providedIn: 'root',
})
export class DatabaseService {
  constructor(private http: HttpClient) {}

  MESSAGES_API = environment.MESSAGES_API;

  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
  };

  messageList: IMessage[] = [];
  tagList: Set<string> = new Set([]);

  getAllMesagesByTags() {
    const tags = this.tagList.size > 0 ? this.tagList : '';

    return this.http
      .post<IMessage[]>(
        `${this.MESSAGES_API}`,
        { tags: [...tags] },
        this.httpOptions
      )
      .subscribe((response) => {
        this.messageList.push(...response);
      });
  }

  createMessage(data: IMessage) {
    return this.http.post<IMessage>(this.MESSAGES_API, data);
  }

  addTag(tag: string) {
    if (tag && tag.trim() !== '') {
      this.tagList.add(tag.trim());
    }
  }

  removeTag(tag: string) {
    this.tagList.delete(tag);
  }

  earchTags(term: string){
    if(!term.trim()){
      return of([])
    }
    return this.http.get(`${this.MESSAGES_API}/?tag=${term}`)
  }
}
