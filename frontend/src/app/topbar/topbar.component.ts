import { Component, OnInit, Output, EventEmitter } from '@angular/core';

import { WebsocketService } from '../websocket.service';
import { AuthenticationService } from '../authentication.service';
import { PersistenceService } from '../persistence.service';

import { ConStatus } from '../ConStatus';

@Component({
  selector: 'app-topbar',
  templateUrl: './topbar.component.html',
  styleUrls: ['./topbar.component.css']
})
export class TopbarComponent implements OnInit {

  username: string;
  lastLoginTime: string;

  @Output('menuItemSelection')
  sendMenuItemSelectionEmitter: EventEmitter<string> = new EventEmitter<any>();

  @Output('authStatus')
  sendAuthStatusEmitter: EventEmitter<ConStatus> = new EventEmitter<ConStatus>();

  constructor(private auth : AuthenticationService, private persi : PersistenceService, private webSocket : WebsocketService) {}

  ngOnInit(): void {
    const user = this.persi.getConnectedUser();

    this.username = this.persi.getConnection();
    this.lastLoginTime = user.lastLogin;
  }

  toggleProfile() : void {
    this.sendMenuItemSelectionEmitter.emit('profile');
  }

  togglePlayersList() : void {
    this.sendMenuItemSelectionEmitter.emit('playerslist');
  }

  toggleTopTen() : void {
    this.sendMenuItemSelectionEmitter.emit('topten');
  }

  logoutOnClick() : void {
    const user = this.persi.getConnectedUser();

    // send req but dont wait for response
    this.auth.logout(user.idDb).subscribe();
    this.webSocket.emit('logout', {idDb: user.idDb, username: this.username});
    this.persi.deleteConnection();
    
    this.sendAuthStatusEmitter.emit(new ConStatus("info", "Vous êtes déconnecté."));
  }
}
