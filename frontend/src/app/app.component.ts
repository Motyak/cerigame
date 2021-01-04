import { Component } from '@angular/core';

import { AuthenticationService } from './authentication.service';
import { WebsocketService } from './websocket.service';
import { HttpService } from './http.service';
import { PersistenceService } from './persistence.service';

import { ConStatus } from './ConStatus';
import { BannerType } from './BannerType';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  /* navigation between views */
  activeView : string;
  previousView : string;

  themes: string[];
  bannerType: BannerType;
  bannerMsg: string;
  bannerVisible = false;
  topbarVisible = false;

  constructor(public auth: AuthenticationService, private http: HttpService, private webSocket : WebsocketService, private persi : PersistenceService) {}

  ngOnInit() : void {
    if(this.auth.isLogged()) {
      this.getAvailableThemes();

      const user = this.persi.getConnectedUser();
      this.webSocket.emit('id', user.idDb);

      this.loadView('themeselection');
      this.topbarVisible = true;
    }
    else
      this.loadView('loginform');

    // // recevoir les socket id de tous les autres utilisateurs
    // this.webSocket.listen('ids').subscribe(
    //   (data) => {
    //     if(this.auth.isLogged())
    //       this.webSocket.setUsers(data);
    //   }
    // )

    // recevoir les défis
    this.webSocket.listen('defi').subscribe(
      (data) => {
        console.log(data);
      }
    )

    // recevoir les notifications du web socket
    this.webSocket.listen('notification').subscribe(
      (data) => {
        if(this.auth.isLogged())
          this.bannerPrint(BannerType.INFO, data)
      }
    );
  }

  loadView(component : string) { 
    this.previousView = this.activeView;
    this.activeView = component; 
  }

  loadPreviousView() {
    var tmp = this.activeView;
    this.activeView = this.previousView;
    this.previousView = tmp;
  }

  bannerPrint(type : BannerType, msg : string) {
    this.bannerVisible = true;
    this.bannerMsg = msg;
    this.bannerType = type;
    setTimeout(() => this.bannerVisible = false, 5000);
  }

  getAvailableThemes() : void {
    this.http.getThemes().subscribe(
      response => this.themes = response,
      error => this.bannerPrint(BannerType.ERROR, 'La récupération des thèmes a échouée!')
    );
  }

  fetchQuizz(theme : string) : void {
    this.http.postQuizz(theme).subscribe(
      response => {
        this.persi.setQuizz(response);
        this.persi.setTheme(theme);
      },
      error => this.bannerPrint(BannerType.ERROR, 'La récupération des données du quiz a échouée!')
    );
  }

  resetInterface() : void {
    if(this.auth.isLogged()) {
      this.topbarVisible = true;
      this.loadView('themeselection');
    }
    else {
      this.topbarVisible = false;
      this.loadView('loginform');
    }
  }

  cleanLocalStorage() : void {
    this.persi.deleteQuizz();
    this.persi.deleteTheme();
    this.persi.deleteDiff();
    this.persi.deleteScore();
  }

/* EVENT HANDLERS */

  onStatusChange = function(status: ConStatus) : void {
    console.log("onStatusChange called");
    const user = this.persi.getConnectedUser();

    // connexion réussie
    if(this.auth.isLogged()) {
      if(!this.themes)
        this.getAvailableThemes();
      this.topbarVisible = true;  
      this.webSocket.emit('id', user.idDb);
      this.loadView('themeselection');
      this.bannerPrint(BannerType.SUCCESS, status.msg);
    }
    // deconnexion réussie
    else if(status.status == 'info') {
      this.topbarVisible = false;
      this.loadView('loginform');
      this.bannerPrint(BannerType.INFO, status.msg);
    }
    // erreur connexion ou deconnexion
    else
      this.bannerPrint(BannerType.ERROR, status.msg);
  }

  onThemeSelected = function(theme: string) : void {
    console.log("onThemeSelected called");

    // enregistrer 10 questions aléatoires basées sur le theme
    this.fetchQuizz(theme);

    this.loadView('diffselection');
  }

  onDifficultySelected = function(diff: string) : void {
    if(diff == 'back')
      this.resetInterface();
    else {
      console.log('onDifficultySelected : ' + diff);
      this.persi.setDiff(diff);
      this.topbarVisible = false;
      this.loadView('quizz');
    }
  }

  onQuizzEnded = function() : void {
    console.log("onQuizzEnded called");
    this.cleanLocalStorage();
    this.resetInterface();
  }

  onPlayersListRequested = function() : void {
    console.log("onPlayersListRequested called");
    this.loadView('playerslist');
  }

  onPlayerChallenged = function(idDb: number) : void {
    console.log("onPlayerChallenged called with value " + idDb);
    const user = this.persi.getConnectedUser();

    /* Ajouter le defi a la collection */
    const defi = {};
    defi['idUserDefiant'] = user.idDb;
    defi['idUserDefie'] =  idDb;
    defi['scoreDefiant'] = this.persi.getScore();
    defi['diff'] = this.persi.getDiff();
    defi['theme'] = this.persi.getTheme();
    defi['quiz'] = this.persi.getQuizz();
    this.http.postDefi(defi).subscribe();

    // Envoyer un defi
    this.webSocket.emit('defi', defi);

    // ...

    /* retourner au menu et afficher banniere comme quoi défi bien envoyé */
    this.cleanLocalStorage();
    this.resetInterface();
    this.bannerPrint(BannerType.INFO, 'Défi bien envoyé !');
  }

  onBackToMenu = function() : void {
    console.log("onBackToMenu called");
    this.resetInterface();
  }

  onProfileToggled = function() : void {
    console.log("onProfileToggled called");
    this.loadView('profile');
  }

  onPreviousViewRequested = function() : void {
    console.log("onPreviousViewRequested called");
    this.loadPreviousView();
  }
}
