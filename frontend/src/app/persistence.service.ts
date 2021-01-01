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
    return this.getUser(this.getConnection());
  }

  getUser(identifiant : string) : any {
    return JSON.parse(localStorage.getItem(identifiant));
  }

  getTheme() : string {
    return localStorage.getItem('thème');
  }

  getDiff() : string {
    return localStorage.getItem('diff');
  }

  getQuizz() : any {
    return JSON.parse(localStorage.getItem('quiz'));
  }

  setUser(identifiant : string, user) {
    localStorage.setItem('user', identifiant);
    localStorage.setItem(identifiant, user);
  }

  setScore(score : number) {
    localStorage.setItem('score', score.toString());
  }

  deleteConnection() {
    localStorage.removeItem('user');;
  }

  
}
