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
  profileToggled = false;

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
    return this.http.get<any>('http://localhost:3037/themes');
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

  resetInterface() : void {
    this.themeSelected = false;
    this.diffSelected = false;
    this.profileToggled = false;
  }

  shouldAppear(element: string) : boolean {
    if(element == 'topbar')
      return this.auth.isLogged() && !this.profileToggled && !this.diffSelected;
    if(element == 'themeselection')
      return this.auth.isLogged() && !this.themeSelected && !this.profileToggled;
    if(element == 'diffselection')
      return this.auth.isLogged() && this.themeSelected && !this.diffSelected && !this.profileToggled;
    if(element == 'quizz')
      return this.auth.isLogged() && this.diffSelected && !this.profileToggled;
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

  onQuizzEnded = function() : void {
    console.log("onQuizzEnded called");

    // clean up local storage
    localStorage.removeItem('quiz');
    localStorage.removeItem('thème');
    localStorage.removeItem('diff');

    this.resetInterface();
  }

  onBackToMenu = function() : void {
    console.log("onBackToMenu called");
    this.resetInterface();
  }

  onProfileToggled = function(toggled: boolean) : void {
    console.log("onProfileToggled called");

    if(toggled) {
      this.resetInterface();
      this.profileToggled = true;
    }
    else
      this.profileToggled = false;
  }
}
