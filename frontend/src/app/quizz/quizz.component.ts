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

  nbGoodAnswers : number = 0;
  score : number = 0;

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
        this.calculateScore();

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

  calculateScore() : void {
    const MAX_SCORE = 10000;

    // 15s de temps de réponse en moyenne
    const MAX_TIME = 150;

    const MIN_TIME = {
      'Facile': 100,    // 10s de temps de réponse en moyenne
      'Normal': 40,     // 4s de temps de réponse en moyenne
      'Difficile': 20   // 2s de temps de réponse en moyenne
    };

    // calcul nb de bonnes réponses
    for(var i = 0 ; i < 10 ; ++i)
    {
      var a = this.answers[i];
      if(this.quizz[i].quizz.réponse == this.quizz[i].quizz.propositions[a])
        this.nbGoodAnswers++;
    }

    // calcul score par bonne réponse
    var unitScore;

    const TOTAL_TIME = this.timerMin * 60 + this.timerSec;

    if(TOTAL_TIME < MIN_TIME[this.diff])
      unitScore = MAX_SCORE / 10;
    else
    {
      const SPEED_COEF = (TOTAL_TIME - MAX_TIME) 
                      / (MIN_TIME[this.diff] - MAX_TIME);

      unitScore = SPEED_COEF * (MAX_SCORE / 10);
    }

    this.score = Math.floor(this.nbGoodAnswers * unitScore);
  }
}
