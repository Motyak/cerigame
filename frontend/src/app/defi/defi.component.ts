import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';

enum Difficulte {
  FACILE,
  NORMAL,
  DIFFICILE
}

@Component({
  selector: 'app-defi',
  templateUrl: './defi.component.html',
  styleUrls: ['./defi.component.css']
})
export class DefiComponent implements OnInit {

  @Input() defi: any;

  @Output('challengeResponse')
  sendChallengeResponse: EventEmitter<boolean> = new EventEmitter<any>();

  constructor() { }

  ngOnInit(): void {
    
  }

  response(accept : boolean) {
    this.sendChallengeResponse.emit(accept);
  }

}
