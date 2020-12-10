import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-quizz',
  templateUrl: './quizz.component.html',
  styleUrls: ['./quizz.component.css']
})
export class QuizzComponent implements OnInit {

  @Input() quizz: string[];

  constructor() { }

  ngOnInit(): void {
  }

}
