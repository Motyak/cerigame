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
    // console.log("mail: " + this.mail + "\npwd: " + this.pwd);
    console.log(formValue);
  }

}
