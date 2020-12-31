import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-quizz',
  templateUrl: './quizz.component.html',
  styleUrls: ['./quizz.component.css']
})
export class QuizzComponent implements OnInit {

  @Output('quizzEnded')
  sendQuizzEndedEmitter: EventEmitter<string> = new EventEmitter<any>();

  @Output('playersListRequested')
  sendPlayersListRequestedEmitter: EventEmitter<string> = new EventEmitter<any>();

  nbOfProp : any = {
    'Facile':     2,
    'Normal':     3,
    'Difficile':  4
  };

  quizz: any[];
  theme: string;
  diff: string;
  questionNb : number = 0;
  // answers : number[];
  answers : string[];

  interval;
  timer : string = '0:00';
  timerSec : number = 0;
  timerMin : number = 0;

  nbGoodAnswers : number = 0;
  score : number = 0;

  constructor(private http: HttpClient) { }

  ngOnInit(): void {
    this.theme = localStorage.getItem('thème');
    this.diff = localStorage.getItem('diff');
    this.quizz = JSON.parse(localStorage.getItem('quiz'));
    this.setupQuizz();
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

  setupQuizz() : void {
    /* USEFUL FUNCTIONS */
    const getIndex = (arr, solution) => {
      for(var i = 0 ; i < 4 ; ++i)
        if(arr[i] == solution)
          return i;
      return -1;
    };
    var swap = (arr, i1, i2) => {
      const tmp = arr[i1];
      arr[i1] = arr[i2];
      arr[i2] = tmp;
    };
    var shuffle = (array) => {
      for(var i = array.length - 1 ; i > 0 ; --i) {
          const j = Math.floor(Math.random() * (i + 1));
          [array[i], array[j]] = [array[j], array[i]];
      }
    };

    var quiz = JSON.parse(localStorage.getItem('quiz'));
    for(var z = 0 ; z < 10 ; ++z)
    {
      const réponse = quiz[z].quizz.réponse;

      // on swap index solution avec index 0
      swap(quiz[z].quizz.propositions, 0, getIndex(quiz[z].quizz.propositions, réponse));

      // on créé les propositions en fonction de la diff
      var newProp = new Array(this.nbOfProp[this.diff]);
      for(var i = 0 ; i < newProp.length ; ++i)
        newProp[i] = quiz[z].quizz.propositions[i];

      // on randomize l'ordre des propositions
      shuffle(newProp);

      // on remplace les anciennes propositions par les nouvelles
      this.quizz[z].quizz.propositions = newProp;
    }
  }

  select(prop : string) : void {
    console.log(prop + ' clicked');
      this.answers[this.questionNb] = prop;
      ++this.questionNb;
      if(this.questionNb == 10)
      {
        this.stopTimer();
        this.calculateScore();
        this.sendResultToServer();
      }
  }

  sendResultToServer() : void {
    const diffInt = {'Facile':0,'Normal':1,'Difficile':2};
    const user = JSON.parse(localStorage.getItem(localStorage.getItem('user')));

    this.http.post<any>('http://localhost:3037/histo', {
      id_user: user.idDb, 
      date_jeu: new Date(), 
      niveau_jeu: diffInt[this.diff], 
      nb_reponses_corr: this.nbGoodAnswers, 
      temps: this.timerMin * 60 + this.timerSec, 
      score: this.score
    }).subscribe();
  }

  backToMenu() : void {
    // envoi msg au composant principal
    this.sendQuizzEndedEmitter.emit();
  }

  showPlayersList() : void {
    // dire au composant principal que la liste doit etre visible
    this.sendPlayersListRequestedEmitter.emit();
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
      if(this.quizz[i].quizz.réponse == this.answers[i])
        this.nbGoodAnswers++;

    // calcul score par bonne réponse
    var unitScore;

    const TOTAL_TIME = this.timerMin * 60 + this.timerSec;

    if(TOTAL_TIME < MIN_TIME[this.diff])
      unitScore = MAX_SCORE / 10;
    else if(TOTAL_TIME > MAX_TIME)
      unitScore = 0;
    else
    {
      const SPEED_COEF = (TOTAL_TIME - MAX_TIME) 
                      / (MIN_TIME[this.diff] - MAX_TIME);

      unitScore = SPEED_COEF * (MAX_SCORE / 10);
    }

    this.score = Math.floor(this.nbGoodAnswers * unitScore);
  }
}
