import { Component, OnInit, Output, EventEmitter } from '@angular/core';

import { AuthenticationService } from '../authentication.service';
import { WebsocketService } from '../websocket.service';
import { PersistenceService } from '../persistence.service';

import { ConStatus } from '../ConStatus';

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

  constructor(private auth : AuthenticationService, private webSocket : WebsocketService, private persi : PersistenceService) {}

  ngOnInit(): void {}

  onSubmit(): void {
    this.auth.verifyId(this.attrUsername, this.attrPwd).subscribe(
      response => {
        if(response.auth) {
          const prev = this.persi.getUser(response.user.identifiant);

          var user = {};
          if(prev)
            user["lastLogin"] = prev.currentLogin;
          else
            user["lastLogin"] = '';
          user["currentLogin"] = response.user.currentLogin;
          user["idDb"] = response.user.idDb;
          user["profile"] = response.user.profile;

          this.persi.setUser(response.user.identifiant, JSON.stringify(user));
          this.webSocket.emit('login', this.attrUsername);
          this.sendAuthStatusEmitter.emit(new ConStatus("success", "Connexion réussie!"));
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
