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
  verifyId(mail: string, pwd: string) : Observable<boolean> {
    var trueId: boolean = false;

    return Observable.create((observer: Subscriber<boolean>) => {
        this.http.post<any>('http://localhost:3037/login', {mail: mail, pwd: pwd}).subscribe(
        response => {
          // login réussi
          if(response.auth) {
            const prev = JSON.parse(localStorage.getItem(response.user.name));
            var user = {};
            if(prev)
              user["lastLogin"] = prev.currentLogin;
            else
              user["lastLogin"] = '';
            user["currentLogin"] = response.user.currentLogin;
            localStorage.setItem(response.user.name, JSON.stringify(user));
            localStorage.setItem('user', response.user.name);
            trueId = true;
          }
          else
            trueId = false;
        },
        error => {
          console.error('une erreur est survenue!', error);
          trueId = false;
        },
        () => { observer.next(trueId); }
      );
    });
  }

  // logout() : void {
  //   // send req but dont wait for response
  //   this.http.post('http://localhost:3037/logout', {}).subscribe();
  //   localStorage.removeItem('user');
  // }
}
