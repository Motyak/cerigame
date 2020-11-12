import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

import { AuthentificationService } from '../authentification.service';

import { ConStatus } from '../structs/ConStatus';

@Component({
  selector: 'app-loginform',
  templateUrl: './loginform.component.html',
  styleUrls: ['./loginform.component.css']
})
export class LoginformComponent implements OnInit {

  attrMail: string;
  attrPwd: string;
  @Input() auth: AuthentificationService;

  @Output('authStatus')
  sendAuthStatusEmitter: EventEmitter<ConStatus> = new EventEmitter<ConStatus>();

  constructor() { }

  ngOnInit(): void {
  }

  onSubmit(): void {
    console.log(this.attrMail + ":" + this.attrPwd);

    // hasher le mdp puis envoyer requête ajax
    // POST /login avec en data l'identifiant + mdp hashé

    this.auth.verifyId(this.attrMail, this.attrPwd).subscribe(
      success => {
        if(success.valueOf)
          this.sendAuthStatusEmitter.emit(new ConStatus("success", "Connexion réussie!"));
        else
          this.sendAuthStatusEmitter.emit(new ConStatus("error", "Identifiants incorrects!"));
      },
      error => {
        this.sendAuthStatusEmitter.emit(new ConStatus("error", "Connexion échouée!"));
      }
    );
  }

}
