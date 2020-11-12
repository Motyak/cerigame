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

  topbarUsername = "Motyak";
  topbarLastLoginTime = "10 novembre 2020 à 10h52"

  bannerType = BannerType.ERROR;
  bannerMsg = 'Login incorrect!';

    constructor(auth: AuthentificationService) {
      this.auth = auth;
  }

  onStatusChange = function(status: ConStatus) : void {
    console.log("onStatusChange called");
    this.bannerVisible = true;
    this.bannerType = status.status;
    this.bannerMsg = status.msg;
  }
}
