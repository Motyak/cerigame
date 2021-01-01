import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { HttpService } from './http.service';
import { PersistenceService } from './persistence.service';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {

  constructor(private http : HttpService, private persi : PersistenceService) {}

  isLogged(): boolean {
    if(this.persi.getConnection())
      return true;
    return false;
  }

  // utilisé par le composant loginform au moment du submit
  verifyId(identifiant: string, pwd: string) : Observable<any> {
    return this.http.postLogin(identifiant, pwd);
  }

  logout(idDb : number) : Observable<any> {
    return this.http.postLogout(idDb);
  }
}
