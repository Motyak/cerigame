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

      // récupérer les themes dispos pour la construction des cartes
      this.themes = [
          'Actu people : août 2018 (Ils ont fait l\'actualité)', 
          'Animaux célèbres',
          'Culture générale',
          'Culture générale 4 (La culture, c\'est l\'expression du vivant)',
          'Héros Marvel',
          'Linux',
          'Musée du Louvre',
          'Russia 2018 (Coupe du monde de football 2018)',
          'Star Wars',
          'Tintin',
          'Trouvez le nombre'
      ];
    }
  }

  sendQuizzReq(theme : string) : Observable<any> {
    return this.http.post<any>('http://localhost:3037/quiz', {theme: theme});
  }

  saveQuizzData(theme : string) : void {
    this.sendQuizzReq(theme).subscribe(
      response => {
        localStorage.setItem('quiz', JSON.stringify(response));
      },
      error => {
        this.onStatusChange(new ConStatus("error", "La récupération des données du quiz a échoué!"));
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
  }

  onThemeSelected = function(theme: string) : void {
    console.log("onThemeSelected called");

    // enregistrer 10 questions aléatoires basées sur le theme
    this.saveQuizzData(theme);

    // charger le quiz avec les questions
  }
}
