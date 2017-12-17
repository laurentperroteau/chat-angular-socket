import { Component, OnInit, OnDestroy } from '@angular/core';
import { ChatService } from '../chat.service';

interface Message {
  username: string;
  text: string;
}
@Component({
  selector: 'app-chat',
  template: `
<pre>{{ messages | json }}</pre>
<pre>{{ user | json }}</pre>
<div *ngFor='let message of messages'>
  {{ message.username }} : {{ message.message }}
</div>
<div>
  <label>Ton nom : </label>
  <input [disabled]='user' [(ngModel)]='username' />
  <button (click)='setUsername()'>Envoyer</button>
  <br />
  <label>Ton message : </label>
  <input [disabled]='!user' [(ngModel)]='message' />
  <button (click)='sendMessage()'>Envoyer</button>
</div>`,
})
export class ChatComponent implements OnInit, OnDestroy {
  chatConnexion;
  username: string;
  user: any;
  message: string;
  messages: Message[] = [];

  constructor(private chatService: ChatService) {
  }

  ngOnInit() {
    this.chatConnexion = this.chatService.onNewMessage().subscribe(message => {
      console.log(message);
      this.messages.push(message);
    });

    this.chatService.onUserSetted().subscribe(user => {
      console.log(user, this.username);
      if (user.name === this.username) {
        this.user = user;
      }
    });
  }

  sendMessage() {
    this.chatService.sendMessage({userId: this.user.id, message: this.message});
    this.message = '';
  }

  setUsername() {
    this.chatService.setUsername(this.username);
  }

  ngOnDestroy() {
    this.chatConnexion.unsubscribe();
  }
}
