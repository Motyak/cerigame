import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class PersistenceService {

  constructor() { }

  getConnection() : string { return localStorage.getItem('user'); }
  getUser(identifiant : string) : any { return JSON.parse(localStorage.getItem(identifiant)); }
  getConnectedUser() : any { return this.getUser(this.getConnection()); }
  getTheme() : string { return localStorage.getItem('thème'); }
  getDiff() : string { return localStorage.getItem('diff'); }
  getQuizz() : any { return JSON.parse(localStorage.getItem('quiz')); }
  getScore() : string { return localStorage.getItem('score'); }
  
  setUser(identifiant : string, user) {
    localStorage.setItem('user', identifiant);
    localStorage.setItem(identifiant, user);
  }
  setTheme(theme : string) { localStorage.setItem('thème', theme); }
  setDiff(diff : string) { localStorage.setItem('diff', diff); }
  setQuizz(quizz) { localStorage.setItem('quiz', JSON.stringify(quizz)); }
  setScore(score : number) { localStorage.setItem('score', score.toString()); }


  deleteConnection() { localStorage.removeItem('user'); }
  deleteQuizz() { localStorage.removeItem('quiz'); }
  deleteTheme() { localStorage.removeItem('thème'); }
  deleteDiff() { localStorage.removeItem('diff'); }
  deleteScore() { localStorage.removeItem('score'); }

  
}
