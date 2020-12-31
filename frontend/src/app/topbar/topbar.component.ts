import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

import { HttpClient } from '@angular/common/http';

import { ConStatus } from '../structs/ConStatus';
import { WebsocketService } from '../websocket.service';

@Component({
  selector: 'app-topbar',
  templateUrl: './topbar.component.html',
  styleUrls: ['./topbar.component.css']
})
export class TopbarComponent implements OnInit {

  @Input() username: string;
  @Input() lastLoginTime: string;

  @Input() webSocket: WebsocketService;

  @Output('profileToggle')
  sendProfileToggleEmitter: EventEmitter<boolean> = new EventEmitter<boolean>();

  @Output('authStatus')
  sendAuthStatusEmitter: EventEmitter<ConStatus> = new EventEmitter<ConStatus>();

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
  }

  toggleProfile() : void {
    this.sendProfileToggleEmitter.emit(true);
  }

  // on devrait faire appel au service authentification
  logoutOnClick() : void {
    const username = localStorage.getItem('user');
    const user = JSON.parse(localStorage.getItem(username));

    // send req but dont wait for response
    this.http.post('http://localhost:3037/logout', {idDb: user.idDb}).subscribe();
    localStorage.removeItem('user');
    this.webSocket.emit('logout', this.username);
    this.sendAuthStatusEmitter.emit(new ConStatus("info", "Vous êtes déconnecté."));
  }

}
