import { Component, OnInit } from '@angular/core';

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

  selectedTab : number = Tab.PROFILE;

  identifiant: string;
  nom: string;
  prenom: string;
  avatar: string;
  humeur: string;
  date_naissance: Date;

  constructor() { }

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
  }

  isSelected(tab: number) : boolean {
    return this.selectedTab == tab;
  }

  loadProfile() : void {
    this.selectedTab = Tab.PROFILE;
  }

  loadHistory() : void {
    this.selectedTab = Tab.HISTORY;
  }

}
