import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-loginform',
  templateUrl: './loginform.component.html',
  styleUrls: ['./loginform.component.css']
})
export class LoginformComponent implements OnInit {

  attrMail: string;
  attrPwd: string;

  constructor() { }

  ngOnInit(): void {
  }

  onSubmit(formValue: any): void {
    console.log(formValue);

    // hasher le mdp puis envoyer requête ajax
    // POST /login avec en data l'identifiant + mdp hashé
  }

}
