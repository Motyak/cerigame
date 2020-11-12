import { Component } from '@angular/core';
// import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';

import { BannerType } from './enums/BannerType';

import { AuthentificationService } from './authentification.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  auth: AuthentificationService;
  // http: HttpClient;
  title = 'frontend';
  bannerVisible = false;

  topbarUsername = "Motyak";
  topbarLastLoginTime = "10 novembre 2020 à 10h52"

  bannerType = BannerType.ERROR;
  bannerMsg = 'Login incorrect!';

  // constructor(auth: AuthentificationService, http: HttpClient) {
    constructor(auth: AuthentificationService) {
    this.auth = auth;
    // this.http = http;
  }
}
