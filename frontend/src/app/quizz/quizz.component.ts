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

  answers : number[];

  constructor() { }

  ngOnInit(): void {
    this.quizz = JSON.parse(localStorage.getItem('quiz'));
    this.theme = localStorage.getItem('thème');
    this.diff = localStorage.getItem('diff');
    this.answers = new Array(10);
  }

  select(i : number) : void {
    console.log(i + ' clicked');
    // if(this.questionNb >= 9)
    // {
      // dire au composant principal que le quizz ne
      // devrait plus s'afficher ?
      // et afficher les résultats
    // }

    // if(this.questionNb < 9)
    // {
      this.answers[this.questionNb] = i;
      ++this.questionNb;
    // }
  }
}
