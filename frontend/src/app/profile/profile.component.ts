import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';

enum Tab {
  PROFILE,
  HISTORY
};

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

  identifiant: string;
  nom: string;
  prenom: string;
  avatar: string;
  humeur: string;
  date_naissance: Date;
  temps: string;

  history: any[];

  constructor(private http: HttpClient) { }

  ngOnInit(): void {
    const username = localStorage.getItem('user');
    const user = JSON.parse(localStorage.getItem(username));
    const profile = user.profile;

    this.identifiant = username;
    this.nom = profile.nom;
    this.prenom = profile.prenom;
    this.avatar = profile.avatar;
    this.humeur = profile.humeur;
    this.date_naissance = profile.date_naissance; 

    this.getHistoryFromServer();
  }

  isSelected(tab: number) : boolean {
    return this.selectedTab == tab;
  }

  selectProfile() : void {
    this.selectedTab = Tab.PROFILE;
  }

  selectHistory() : void {
    this.selectedTab = Tab.HISTORY;
  }

  backToMenu() : void {
    // envoi msg au composant principal
    this.sendBackToMenuEmitter.emit();
  }

  getHistoryFromServer() : void {
    const username = localStorage.getItem('user');
    const user = JSON.parse(localStorage.getItem(username));
    const idDb = user.idDb;

    let params = new HttpParams().set("idDb", idDb);
    this.http.get<any>('http://localhost:3037/histo', {params: params}).subscribe(
      response => {
        this.history = response;
        console.log(this.history);
      },
      error => {
        console.log("err: l'historique n'a pas pu être récupéré");
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
