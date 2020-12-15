import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

import { AuthentificationService } from '../authentification.service';

import { ConStatus } from '../structs/ConStatus';

@Component({
  selector: 'app-loginform',
  templateUrl: './loginform.component.html',
  styleUrls: ['./loginform.component.css']
})
export class LoginformComponent implements OnInit {

  attrNomUtilisateur: string;
  attrPwd: string;
  @Input() auth: AuthentificationService;

  @Output('authStatus')
  sendAuthStatusEmitter: EventEmitter<ConStatus> = new EventEmitter<ConStatus>();

  constructor() { }

  ngOnInit(): void {
  }


  onSubmit(): void {
    console.log(this.attrNomUtilisateur + ":" + this.attrPwd);

    this.auth.verifyId(this.attrNomUtilisateur, this.attrPwd).subscribe(
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
