import { Component, OnInit, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-quizz',
  templateUrl: './quizz.component.html',
  styleUrls: ['./quizz.component.css']
})
export class QuizzComponent implements OnInit {

  @Output('quizzEnded')
  sendQuizzEndedEmitter: EventEmitter<string> = new EventEmitter<any>();

  quizz: any[];
  theme: string;
  diff: string;
  questionNb : number = 0;

  answers : number[];
  timer : number = 0;

  constructor() { }

  ngOnInit(): void {
    this.quizz = JSON.parse(localStorage.getItem('quiz'));
    this.theme = localStorage.getItem('thème');
    this.diff = localStorage.getItem('diff');
    this.answers = new Array(10);
    setInterval(() => { ++this.timer; }, 1000);
  }

  select(i : number) : void {
    console.log(i + ' clicked');
      this.answers[this.questionNb] = i;
      ++this.questionNb;
  }

  backToMenu() : void {
    // envoi msg au composant principal
    this.sendQuizzEndedEmitter.emit();
  }
}
