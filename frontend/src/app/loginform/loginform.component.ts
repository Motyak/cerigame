import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

import { AuthentificationService } from '../authentification.service';

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
  sendAuthStatusEmitter: EventEmitter<string> = new EventEmitter<string>();

  constructor() { }

  ngOnInit(): void {
  }

  onSubmit(): void {
    console.log(this.attrMail + ":" + this.attrPwd);

    // hasher le mdp puis envoyer requête ajax
    // POST /login avec en data l'identifiant + mdp hashé

    this.auth.verifyId(this.attrMail, this.attrPwd).subscribe(
      success => {
        console.log("success");
        this.sendAuthStatusEmitter.emit("Connexion réussie!");
      },
      error => {
        console.log("error");
        this.sendAuthStatusEmitter.emit("Connexion échouée.");
      }
    );
  }

}
