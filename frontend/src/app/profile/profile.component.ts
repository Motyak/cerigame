import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';

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

  @Input() player: boolean;

  @Output('backToMenu')
  sendBackToMenuEmitter: EventEmitter<string> = new EventEmitter<any>();

  diff : string[] = ['Facile', 'Normal', 'Difficile'];

  selectedTab : number = Tab.PROFILE;
  selectedHistoTab : number = HistoTab.SOLO;

  profile: any;
  identifiant: string;
  nom: string;
  prenom: string;
  avatar: string;
  humeur: string;
  date_naissance: Date;
  medailles: number;
  temps: string;

  historySolo: any[];
  historyDefis: any[];

  constructor(private http: HttpService, private persi: PersistenceService) { }

  ngOnInit(): void {
    if(this.player)
      this.profile = this.persi.getPlayer();
    else {/* utilisateur connecté */
      const user = this.persi.getConnectedUser();
      this.profile = user.profile;
      this.profile['identifiant'] = this.persi.getConnection();
      this.profile['idDb'] = user.idDb;
    }
    
    this.identifiant = this.profile.identifiant;
    this.nom = this.profile.nom;
    this.prenom = this.profile.prenom;
    this.avatar = this.profile.avatar;
    this.humeur = this.profile.humeur;
    this.date_naissance = this.profile.date_naissance; 

    this.getMedalsFromServer();
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

  getMedalsFromServer() : void {
    this.http.getMedals(this.profile.idDb).subscribe(
      response => this.medailles = response[0].count,
      error => {
        console.log("err: le nb de medailles n'a pas pu être récupéré");
      }
    )
  }

  getHistoryFromServer() : void {
    // Récupérer l'historique des parties solo
    this.http.getHistoSolo(this.profile.idDb).subscribe(
      response => {
        this.historySolo = response;
        console.log(this.historySolo);
      },
      error => {
        console.log("err: l'historique n'a pas pu être récupéré");
      }
    );

    // récupérer l'historique des défis
    this.http.getHistoDefis(this.profile.idDb).subscribe(
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
