import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
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

  getDefiTmp(idUserDefiant: number, idUserDefie: number) : Observable<any> {
    let params = new HttpParams().set("idUserDefiant", idUserDefiant.toString()).set("idUserDefie", idUserDefie.toString());
    return this.http.get<any>('http://localhost:3037/defiTmp', {params: params});
  }

  postDefiTmp(defi) : Observable<any> {
    return this.http.post<any>('http://localhost:3037/defiTmp', defi);
  }

  postQuizz(theme : string) : Observable<any> {
    return this.http.post<any>('http://localhost:3037/quiz', {theme: theme});
  }

  getThemes() : Observable<any> {
    return this.http.get<any>('http://localhost:3037/themes');
  }

  getHistoSolo(idDb: string) : Observable<any> {
    let params = new HttpParams().set("idDb", idDb);
    return this.http.get<any>('http://localhost:3037/histo', {params: params});
  }

  getHistoDefis(idDb: string) : Observable<any> {
    let params = new HttpParams().set("idDb", idDb);
    return this.http.get<any>('http://localhost:3037/defis', {params: params});
  }

  getPlayersList(idDb: string) : Observable<any> {
    let params = new HttpParams().set("idDb", idDb);
    return this.http.get<any>('http://localhost:3037/players', {params: params});
  }

  delTmpQuizz(idUserDefiant: number, idUserDefie: number) : Observable<any> {
    let options = {
      headers: new HttpHeaders({'Content-Type': 'application/json'}),
      body: {
        idUserDefiant: idUserDefiant,
        idUserDefie: idUserDefie
      }
    };
    return this.http.delete<any>('http://localhost:3037/defi', options);
  }
}
