import { Component } from '@angular/core';
import { BannerType } from './enums/BannerType';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'frontend';

  bannerType = BannerType.ERROR;
  bannerMsg = 'Login incorrect!';
}
