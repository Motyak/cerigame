import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class PersistenceService {

  constructor() { }

  getConnection() : string {
    return localStorage.getItem('user');
  }

  getConnectedUser() : any {
    this.getUser(this.getConnectedUsername());
  }

  getUser(identifiant : string) : any {
    return JSON.parse(localStorage.getItem(identifiant));
  }

  setUser(identifiant : string, user) {
    localStorage.setItem('user', identifiant);
    localStorage.setItem(identifiant, user);
  }

  deleteConnection() {
    localStorage.removeItem('user');;
  }
}
