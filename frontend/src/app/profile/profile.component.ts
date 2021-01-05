import { Component, OnInit, Output, EventEmitter } from '@angular/core';

import { HttpService } from '../http.service';
import { PersistenceService } from '../persistence.service';

enum Tab {
  PROFILE,
  HISTORY
};

enum HistoTab {
  SOLO,
  DEFIS
}

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {

  @Output('backToMenu')
  sendBackToMenuEmitter: EventEmitter<string> = new EventEmitter<any>();

  diff : string[] = ['Facile', 'Normal', 'Difficile'];

  selectedTab : number = Tab.PROFILE;
  selectedHistoTab : number = HistoTab.SOLO;

  identifiant: string;
  nom: string;
  prenom: string;
  avatar: string;
  humeur: string;
  date_naissance: Date;
  temps: string;

  historySolo: any[];
  historyDefis: any[];

  constructor(private http: HttpService, private persi: PersistenceService) { }

  ngOnInit(): void {
    const username = this.persi.getConnection();
    const user = this.persi.getConnectedUser();
    const profile = user.profile;

    this.identifiant = username;
    this.nom = profile.nom;
    this.prenom = profile.prenom;
    this.avatar = profile.avatar;
    this.humeur = profile.humeur;
    this.date_naissance = profile.date_naissance; 

    this.getHistoryFromServer();
  }

  isSelected(tab: number) : boolean { return this.selectedTab == tab; }
  isSelectedHisto(tab: number) : boolean { return this.selectedHistoTab == tab; }

  selectProfile() : void { this.selectedTab = Tab.PROFILE; }
  selectHistory() : void { this.selectedTab = Tab.HISTORY; }
  selectSolo() : void { this.selectedHistoTab = HistoTab.SOLO; }
  selectDefis() : void { this.selectedHistoTab = HistoTab.DEFIS; }

  backToMenu() : void {
    // envoi msg au composant principal
    this.sendBackToMenuEmitter.emit();
  }

  getHistoryFromServer() : void {
    const user = this.persi.getConnectedUser();

    // Récupérer l'historique des parties solo
    this.http.getHistoSolo(user.idDb).subscribe(
      response => {
        this.historySolo = response;
        console.log(this.historySolo);
      },
      error => {
        console.log("err: l'historique n'a pas pu être récupéré");
      }
    );

    // récupérer l'historique des défis
    this.http.getHistoDefis(user.idDb).subscribe(
      response => {
        this.historyDefis = response;
        console.log(this.historyDefis);
      },
      error => {
        console.log("err: l'historique des défis n'a pas pu être récupéré");
      }
    );
  }

  printTime(seconds : number) : string {
    const temps_min = Math.floor(seconds / 60);
    const temps_sec = seconds - temps_min * 60;
    if(temps_sec < 10)
      return temps_min.toString() + ':0' + temps_sec.toString();
    else
    return temps_min.toString() + ':' + temps_sec.toString();
    
  }
}
