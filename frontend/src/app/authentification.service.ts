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
    // if(localStorage.getItem('accessToken'))
    //   return true;
    // return false;

    return false;
  }

  verifyId(user: string, pwd: string) : Observable<boolean> {
    var trueId: boolean = false;

    return Observable.create((observer: Subscriber<boolean>) => {
      this.http.post<any>('api/endpoint', {user: user, pwd: pwd}).subscribe(
        response => {
          if(response.statusResp) {
            localStorage.setItem('user', JSON.stringify(response.data.user));
            trueId = true;
          }
        },
        error => {
          console.error('une erreur est survenue!', error);
          trueId = false;
        },
        () => { observer.next(trueId); }
      );
    });
  }
}
