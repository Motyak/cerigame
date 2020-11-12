import { Component } from '@angular/core';

import { BannerType } from './enums/BannerType';

import { AuthentificationService } from './authentification.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  auth: AuthentificationService;
  title = 'frontend';
  bannerVisible = true;

  topbarUsername = "Motyak";
  topbarLastLoginTime = "10 novembre 2020 à 10h52"

  bannerType = BannerType.ERROR;
  bannerMsg = 'Login incorrect!';

    constructor(auth: AuthentificationService) {
      this.auth = auth;
  }

  onStatusChange = function(status: string) : void {
    console.log("onStatusChange called");
    this.bannerMsg = status;
  }
}
