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

  constructor() { }

  ngOnInit(): void {
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
