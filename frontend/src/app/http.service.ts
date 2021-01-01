import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class HttpService {

  constructor(private http: HttpClient) { }

  postLogin(identifiant : string, pwd : string) : Observable<any> {
    return this.http.post<any>('http://localhost:3037/login', {identifiant: identifiant, pwd: pwd});
  }
}
