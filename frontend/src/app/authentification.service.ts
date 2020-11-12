import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthentificationService {

  isLogged(): boolean {
    // if(localStorage.getItem('accessToken'))
    //   return true;
    // return false;

    return false;
  }

  constructor() { }
}
