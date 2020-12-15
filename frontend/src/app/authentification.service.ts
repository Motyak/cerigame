import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError, Subscriber } from 'rxjs';

// import { catchError, retry } from 'rxjs/operators';


@Injectable({
  providedIn: 'root'
})
export class AuthentificationService {

  constructor(private http: HttpClient) {}

  isLogged(): boolean {
    if(localStorage.getItem('user'))
      return true;
    return false;
  }

  // utilisé par le composant loginform au moment du submit
  verifyId(identifiant: string, pwd: string) : Observable<any> {

    return this.http.post<any>('http://pedago.univ-avignon.fr:3037/login', {identifiant: identifiant, pwd: pwd});

  }

  // logout() : void {
  //   // send req but dont wait for response
  //   this.http.post('http://localhost:3037/logout', {}).subscribe();
  // }
}
