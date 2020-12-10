import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';

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

  themeSelected = false;
  diffSelected = false;

  topbarUsername: string;
  topbarLastLoginTime: string;

  themes: string[];

  constructor(auth: AuthentificationService, private http: HttpClient) {
    this.auth = auth;
  }

  ngOnInit() : void {
    if(this.auth.isLogged()) {
      // récupérer infos utilisateur connecté
      const username = localStorage.getItem('user');
      const user = JSON.parse(localStorage.getItem(username));
      this.topbarUsername = username;
      this.topbarLastLoginTime = user.lastLogin;

      // récupérer les themes dispos
      this.sendThemeReq().subscribe(
        response => {
          this.themes = response;
        },
        error => {
          this.onStatusChange(new ConStatus("error", "La récupération des thèmes a échouée!"));
        }
      )
    }
  }

  sendThemeReq() : Observable<any> {
    return this.http.post<any>('http://localhost:3037/themes', {});
  }

  sendQuizzReq(theme : string) : Observable<any> {
    return this.http.post<any>('http://localhost:3037/quiz', {theme: theme});
  }

  saveQuizzData(theme : string) : void {
    this.sendQuizzReq(theme).subscribe(
      response => {
        localStorage.setItem('quiz', JSON.stringify(response));
        localStorage.setItem('thème', theme);
      },
      error => {
        this.onStatusChange(new ConStatus("error", "La récupération des données du quiz a échouée!"));
      }
    );
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

    setTimeout(() => {
      this.bannerVisible = false;
    }, 5000);
  }

  onThemeSelected = function(theme: string) : void {
    console.log("onThemeSelected called");

    // enregistrer 10 questions aléatoires basées sur le theme
    this.saveQuizzData(theme);

    // cacher le choix du quizz et afficher le choix de la diff
    this.themeSelected = true;
  }

  onDifficultySelected = function(diff: string) : void {
    if(diff == 'back')
      this.themeSelected = false;
    else {
      console.log('onDifficultySelected : ' + diff);
      this.diffSelected = true;
      localStorage.setItem('diff', diff);
    }
  }
}
