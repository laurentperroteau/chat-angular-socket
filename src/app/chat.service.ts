import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/filter';
import 'rxjs/add/operator/mergeMap';
import 'rxjs/add/operator/map';

import { Injectable } from '@angular/core';

import * as io from 'socket.io-client';

@Injectable()
export class ChatService {
  private url = 'http://localhost:5000';
  private socket;
  private chatChanges$: Observable<any>;

  constructor() {
    this._setChat$();
  }

  sendMessage(message) {
    this.socket.emit('add-message', message);
  }

  setUsername(username) {
    this.socket.emit('set-user', username);
  }

  onNewMessage() {
    return this.chatChanges$
      .filter(data => data.type === 'new-message')
      .map(data => data.payload);
  }

  onUserSetted() {
    return this.chatChanges$
      .filter(data => data.type === 'user-setted')
      .map(data => data.payload);
  }

  private _setChat$() {
    this.chatChanges$ = new Observable(observer => {
      this.socket = io(this.url);
      this.socket.on('chat', (data) => {
        observer.next(data);
      });
      return () => {
        this.socket.disconnect();
      };
    });
  }
}
