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
    // send req but dont wait for response
    this.http.post('http://pedago.univ-avignon.fr:3037/logout', {}).subscribe();
    localStorage.removeItem('user');
    localStorage.removeItem('idDb');
    this.sendAuthStatusEmitter.emit(new ConStatus("info", "Vous êtes déconnecté."));
    console.log('logout clicked');
  }

}
