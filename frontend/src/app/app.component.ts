import { Component } from '@angular/core';

import { BannerType } from './enums/BannerType';

import { AuthentificationService } from './authentification.service';

import { ConStatus } from './structs/ConStatus';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  auth: AuthentificationService;
  title = 'frontend';
  bannerVisible = false;

  topbarUsername: string;
  topbarLastLoginTime: string;

    constructor(auth: AuthentificationService) {
      this.auth = auth;
      const username = localStorage.getItem['user'];
      if(username) {
        const user = localStorage.getItem[username];
        this.topbarUsername = username;
        this.topbarLastLoginTime = user.lastLogin;
      }
  }

  onStatusChange = function(status: ConStatus) : void {
    console.log("onStatusChange called");
    if(this.auth.isLogged()) {
      const username = localStorage.getItem('user');
      const user = JSON.parse(localStorage.getItem(username));
      this.topbarUsername = username;
      this.topbarLastLoginTime = user.lastLogin;
    }
    this.bannerVisible = true;
    this.bannerType = status.status;
    this.bannerMsg = status.msg;
  }
}
