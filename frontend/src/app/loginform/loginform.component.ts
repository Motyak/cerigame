import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-loginform',
  templateUrl: './loginform.component.html',
  styleUrls: ['./loginform.component.css']
})
export class LoginformComponent implements OnInit {

  email: string;
  hashedPwd: string;

  constructor() { }

  ngOnInit(): void {
  }

}
