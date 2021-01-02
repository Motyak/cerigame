import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class HttpService {

  constructor(private http: HttpClient) { }

  postLogin(identifiant : string, pwd : string) : Observable<any> {
    return this.http.post<any>('http://localhost:3037/login', {identifiant: identifiant, pwd: pwd});
  }

  postLogout(idDb : number) : Observable<any> {
    return this.http.post('http://localhost:3037/logout', {idDb: idDb});
  }

  postHisto(id_user: number, date_jeu: Date, niveau_jeu: number, nb_reponses_corr: number, temps: number, score: number) : Observable<any> {
    return this.http.post<any>('http://localhost:3037/histo', {
      id_user: id_user, 
      date_jeu: date_jeu, 
      niveau_jeu: niveau_jeu, 
      nb_reponses_corr: nb_reponses_corr, 
      temps: temps, 
      score: score
    });
  }

  postDefi(defi) : Observable<any> {
    return this.http.post('http://localhost:3037/defi', defi);
  }

  postQuizz(theme : string) : Observable<any> {
    return this.http.post<any>('http://localhost:3037/quiz', {theme: theme});
  }

  getThemes() : Observable<any> {
    return this.http.get<any>('http://localhost:3037/themes');
  }

  getHisto(idDb: string) : Observable<any> {
    let params = new HttpParams().set("idDb", idDb);
    return this.http.get<any>('http://localhost:3037/histo', {params: params});
  }

  getPlayersList(idDb: string) : Observable<any> {
    let params = new HttpParams().set("idDb", idDb);
    return this.http.get<any>('http://localhost:3037/players', {params: params});
  }
}
