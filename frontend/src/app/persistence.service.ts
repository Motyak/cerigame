import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class PersistenceService {

  constructor() { }

  getUser(identifiant : string) {
    return JSON.parse(localStorage.getItem(identifiant));
  }

  setUser(identifiant : string, user) {
    localStorage.setItem('user', identifiant);
    localStorage.setItem(identifiant, user);
  }
}
