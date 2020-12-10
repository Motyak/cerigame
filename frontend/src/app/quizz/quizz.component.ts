import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-quizz',
  templateUrl: './quizz.component.html',
  styleUrls: ['./quizz.component.css']
})
export class QuizzComponent implements OnInit {

  quizz: any[];
  theme: string;
  diff: string;
  questionNb : number = 0;

  constructor() { }

  ngOnInit(): void {
    this.quizz = JSON.parse(localStorage.getItem('quiz'));
    this.theme = localStorage.getItem('thème');
    this.diff = localStorage.getItem('diff');
  }

}
