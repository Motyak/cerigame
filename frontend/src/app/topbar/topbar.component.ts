import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

import { HttpClient } from '@angular/common/http';

import { ConStatus } from '../structs/ConStatus';

@Component({
  selector: 'app-topbar',
  templateUrl: './topbar.component.html',
  styleUrls: ['./topbar.component.css']
})
export class TopbarComponent implements OnInit {

  @Input() username: string;
  @Input() lastLoginTime: string;

  @Output('authStatus')
  sendAuthStatusEmitter: EventEmitter<ConStatus> = new EventEmitter<ConStatus>();

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
  }

  // on devrait faire appel au service authentification
  logoutOnClick() : void {
    // send req but dont wait for response
    this.http.post('http://localhost:3037/logout', {}).subscribe();
    localStorage.removeItem('user');
    localStorage.removeItem('idDb');
    this.sendAuthStatusEmitter.emit(new ConStatus("info", "Vous êtes déconnecté."));
    console.log('logout clicked');
  }

}
