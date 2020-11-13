import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

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

  constructor() { }

  ngOnInit(): void {
  }

  logoutOnClick() : void {
    localStorage.removeItem('user');
    this.sendAuthStatusEmitter.emit(new ConStatus("info", "Vous êtes déconnecté."));
    console.log('logout clicked');
  }

}
