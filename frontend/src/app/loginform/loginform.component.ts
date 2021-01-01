import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';

import { AuthentificationService } from '../authentification.service';
import { WebsocketService } from '../websocket.service';

import { ConStatus } from '../structs/ConStatus';

@Component({
  selector: 'app-loginform',
  templateUrl: './loginform.component.html',
  styleUrls: ['./loginform.component.css']
})
export class LoginformComponent implements OnInit {

  attrUsername: string;
  attrPwd: string;

  @Output('authStatus')
  sendAuthStatusEmitter: EventEmitter<ConStatus> = new EventEmitter<ConStatus>();

  constructor(private router : Router, private auth : AuthentificationService, private webSocket : WebsocketService) {}

  ngOnInit(): void {}

  onSubmit(): void {
    this.auth.verifyId(this.attrUsername, this.attrPwd).subscribe(
      response => {
        if(response.auth) {
          const prev = JSON.parse(localStorage.getItem(response.user.identifiant));
          var user = {};
          if(prev)
            user["lastLogin"] = prev.currentLogin;
          else
            user["lastLogin"] = '';
          user["currentLogin"] = response.user.currentLogin;
          user["idDb"] = response.user.idDb;
          user["profile"] = response.user.profile;
          localStorage.setItem(response.user.identifiant, JSON.stringify(user));
          localStorage.setItem('user', response.user.identifiant);

          this.webSocket.emit('login', this.attrUsername);
          this.sendAuthStatusEmitter.emit(new ConStatus("success", "Connexion réussie!"));
          this.router.navigate(['/theme-selection']);
        }
        else
          this.sendAuthStatusEmitter.emit(new ConStatus("error", "Identifiants incorrects!"));
      },
      error => {
        this.sendAuthStatusEmitter.emit(new ConStatus("error", "Connexion échouée!"));
      }
    );
  }
}
