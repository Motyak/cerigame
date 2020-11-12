import { Component } from '@angular/core';
import { BannerType } from './enums/BannerType';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'frontend';
  userIsConnected = false;
  bannerVisible = false;

  topbarUsername = "Motyak";
  topbarLastLoginTime = "10 novembre 2020 à 10h52"

  bannerType = BannerType.ERROR;
  bannerMsg = 'Login incorrect!';
}
