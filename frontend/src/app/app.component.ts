import { Component, OnInit } from '@angular/core';

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

  constructor(auth: AuthentificationService) {
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
}
