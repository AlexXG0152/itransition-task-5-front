import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { IMessage } from '../interfaces/message.interface';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class DatabaseService {
  constructor(private http: HttpClient) {}

  MESSAGES_API = environment.MESSAGES_API;

  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
  };

  getAllMesages() {
    return this.http.get<IMessage[]>(this.MESSAGES_API);
  }

  getAllMesagesByTags(tags: string[]) {
    return this.http.post<IMessage[]>(
      `${this.MESSAGES_API}`,
      { tags },
      this.httpOptions
    );
  }

  getMesageById() {}

  createMessage(data: IMessage) {
    return this.http.post<IMessage>(this.MESSAGES_API, data);
  }
}
