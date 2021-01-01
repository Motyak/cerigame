import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';

import { AuthenticationService } from './authentication.service';
import { WebsocketService } from './websocket.service';

import { ConStatus } from './ConStatus';
import { BannerType } from './BannerType';



@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'frontend';

  bannerVisible = false;
  profileToggled = false;
  playersListVisible = false;

  themeSelected = false;
  diffSelected = false;

  topbarUsername: string;
  topbarLastLoginTime: string;

  themes: string[];

  constructor(public auth: AuthenticationService, private http: HttpClient, private webSocket : WebsocketService) {
  }

  ngOnInit() : void {
    if(this.auth.isLogged()) {
      // récupérer infos utilisateur connecté
      const username = localStorage.getItem('user');
      const user = JSON.parse(localStorage.getItem(username));
      this.topbarUsername = username;
      this.topbarLastLoginTime = user.lastLogin;

      // récupérer les themes dispos
      this.getAvailableThemes();
    }

    // recevoir les notifications du web socket
    this.webSocket.listen('notification').subscribe(
      (data) => {
        if(this.auth.isLogged())
          this.bannerPrint(data, BannerType.INFO)
      }
    );
  }

  bannerPrint = function(msg : String, type : BannerType) {
    this.bannerVisible = true;
    this.bannerMsg = msg;
    this.bannerType = type;
    setTimeout(() => this.bannerVisible = false, 5000);
  }

  getAvailableThemes() : void {
    this.sendThemeReq().subscribe(
      response => this.themes = response,
      error => this.onStatusChange(new ConStatus("error", "La récupération des thèmes a échouée!"))
    );
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
    this.playersListVisible = false;
  }

  cleanLocalStorage() : void {
    localStorage.removeItem('quiz');
    localStorage.removeItem('thème');
    localStorage.removeItem('diff');
    localStorage.removeItem('score');
  }

  shouldAppear(element: string) : boolean {
    if(element == 'topbar')
      return this.auth.isLogged() && !this.profileToggled && !this.diffSelected && !this.playersListVisible;
    if(element == 'themeselection')
      return this.auth.isLogged() && !this.themeSelected && !this.profileToggled && !this.playersListVisible;
    if(element == 'diffselection')
      return this.auth.isLogged() && this.themeSelected && !this.diffSelected && !this.profileToggled && !this.playersListVisible;
    if(element == 'quizz')
      return this.auth.isLogged() && this.diffSelected && !this.profileToggled && !this.playersListVisible;
  }

  onStatusChange = function(status: ConStatus) : void {
    console.log("onStatusChange called");
    if(this.auth.isLogged()) {
      const username = localStorage.getItem('user');
      const user = JSON.parse(localStorage.getItem(username));
      this.topbarUsername = username;
      this.topbarLastLoginTime = user.lastLogin;

      // on récupère les themes dispos si ça n'est pas déjà fait
      if(!this.themes)
        this.getAvailableThemes();
    }
    this.bannerPrint(status.msg, status.status);
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
    this.cleanLocalStorage();
    this.resetInterface();
  }

  onPlayersListRequested = function() : void {
    console.log("onPlayersListRequested called");
    this.resetInterface();
    this.playersListVisible = true;
  }

  onPlayerChallenged = function(idDb: number) : void {
    console.log("onPlayerChallenged called with value " + idDb);
    const username = localStorage.getItem('user');
    const user = JSON.parse(localStorage.getItem(username));

    /* Ajouter le defi a la collection */
    const data = {};
    data['idUserDefiant'] = user.idDb;
    data['idUserDefie'] =  idDb;
    data['scoreDefiant'] = localStorage.getItem('score');
    data['diff'] = localStorage.getItem('diff');
    data['quiz'] = JSON.parse(localStorage.getItem('quiz'));
    this.http.post('http://localhost:3037/defi', data).subscribe();

    // Envoyer une notification au joueur défié

    // ...

    /* retourner au menu et afficher banniere comme quoi défi bien envoyé */
    this.cleanLocalStorage();
    this.resetInterface();
    this.bannerPrint('Défi bien envoyé !', BannerType.INFO);
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
