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
  
  interval;
  timer : string = '0:00';
  timerSec : number = 0;
  timerMin : number = 0;

  constructor() { }

  ngOnInit(): void {
    this.quizz = JSON.parse(localStorage.getItem('quiz'));
    this.theme = localStorage.getItem('thème');
    this.diff = localStorage.getItem('diff');
    this.answers = new Array(10);
    this.interval = setInterval(() => { 
      this.timerSec++;
      if(this.timerSec == 60)
      {
        this.timerMin++;
        this.timerSec = 0;
      }
      if(this.timerSec < 10)
        this.timer = this.timerMin.toString() + ':' + '0' + this.timerSec.toString();
      else
        this.timer = this.timerMin.toString() + ':' + this.timerSec.toString();
    }, 1000);
  }

  select(i : number) : void {
    console.log(i + ' clicked');
      this.answers[this.questionNb] = i;
      ++this.questionNb;
      if(this.questionNb == 10)
      {
        this.stopTimer();

        // envoi des résultats à la bdd
      }
  }

  backToMenu() : void {
    // envoi msg au composant principal
    this.sendQuizzEndedEmitter.emit();
  }

  stopTimer() : void {
    clearInterval(this.interval);
  }
}
