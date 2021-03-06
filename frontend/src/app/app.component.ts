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

  /* Inputs for sub components */
  themes: string[];
  bannerType: BannerType;
  bannerMsg: string;
  defi: any;
  player: boolean = false;
  challenge: boolean = false;

  /* flags for stackable components */
  bannerVisible = false;
  topbarVisible = false;
  defiVisible = false;

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

    // recevoir les défis
    this.webSocket.listen('defi').subscribe(
      (data) => {
        this.defi = data;
        this.defiVisible = true;
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
      this.challenge = true; //playerslist permet de défier
      this.loadView('quizz');
    }
  }

  onQuizzEnded = function() : void {
    console.log("onQuizzEnded called");
    this.cleanLocalStorage();
    this.defi = undefined;
    this.challenge = false; //playerslist permet de check profil
    this.resetInterface();
  }

  onPlayersListRequested = function() : void {
    console.log("onPlayersListRequested called");
    this.loadView('playerslist');
  }

  OnSelectedPlayer = function() : void {
    // on avertit qu'il s'agit d'un profil joueur et non du notre
    this.player = true;
    this.loadView('profile');
  }

  onPlayerChallenged = function(idDb: number) : void {
    console.log("onPlayerChallenged called with value " + idDb);
    const user = this.persi.getConnectedUser();

    /* Ajouter le defi a la collection */
    const defi = {};
    defi['idUserDefiant'] = user.idDb;
    defi['idUserDefie'] =  idDb;
    defi['diff'] = this.persi.getDiff();
    defi['theme'] = this.persi.getTheme();
    defi['scoreDefiant'] = this.persi.getScore();
    // Envoyer un defi
    this.webSocket.emit('defi', defi);

    defi['quiz'] = this.persi.getQuizz();
    // Stockage du défi avec quiz
    this.http.postDefiTmp(defi).subscribe();

    /* retourner au menu et afficher banniere comme quoi défi bien envoyé */
    this.cleanLocalStorage();
    this.resetInterface();
    this.bannerPrint(BannerType.INFO, 'Défi bien envoyé !');
  }

  onChallengeResponse = function(accept: boolean): void {
    console.log('onChallengeResponse called');
    this.defiVisible = false;

    // si defi accepté => lancer le quiz
    if(accept) {
      // charger le quiz de mongodb
      this.http.getDefiTmp(this.defi.idUserDefiant, this.defi.idUserDefie).subscribe(
        response => {
          this.defi = response;
          this.topbarVisible = false;
          this.loadView('quizz');
        },
        error => this.bannerPrint(BannerType.ERROR, 'La récupération du défi a échouée!')
      );
    }
    else /* rejected */
      this.defi = undefined;

    // envoyer requete http pour delete le quiz dans mongodb
    this.http.delTmpQuizz(this.defi.idUserDefiant, this.defi.idUserDefie).subscribe();
  }

  onBackToMenu = function() : void {
    console.log("onBackToMenu called");
    this.resetInterface();
  }

  onMenuItemSelected = function(selection: string) : void {
    console.log("onMenuItemSelected called");
    if(selection == 'profile')
      this.player = false;
    this.loadView(selection);
  }

  onPreviousViewRequested = function() : void {
    console.log("onPreviousViewRequested called");
    this.loadPreviousView();
  }
}
