import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { HttpService } from './http.service';


@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {

  constructor(private http : HttpService) {}

  isLogged(): boolean {
    if(localStorage.getItem('user'))
      return true;
    return false;
  }

  // utilisé par le composant loginform au moment du submit
  verifyId(identifiant: string, pwd: string) : Observable<any> {
    return this.http.postLogin(identifiant, pwd);
  }

  // logout() : void {
  //   // send req but dont wait for response
  //   this.http.post('http://localhost:3037/logout', {}).subscribe();
  // }
}
