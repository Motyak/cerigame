import { Component, OnInit, Output, EventEmitter } from '@angular/core';

import { HttpService } from '../http.service';
import { PersistenceService } from '../persistence.service';

@Component({
  selector: 'app-playerslist',
  templateUrl: './playerslist.component.html',
  styleUrls: ['./playerslist.component.css']
})
export class PlayerslistComponent implements OnInit {

  players: any[];

  @Output('challengedPlayer')
  sendChallengedPlayerEmitter: EventEmitter<string> = new EventEmitter<any>();

  @Output('quizzEnded')
  sendQuizzEndedEmitter: EventEmitter<string> = new EventEmitter<any>();

  constructor(private http: HttpService, private persi: PersistenceService) { }

  ngOnInit(): void {
    // récupérer la liste de joueurs connectés
    this.getPlayers();
  }

  getPlayers() : void {
    const user = this.persi.getConnectedUser();

    this.http.getPlayersList(user.idDb).subscribe(
      response => {
        this.players = response;
        console.log(this.players);
      },
      error => {
        console.log("err: la liste des joueurs n'a pas pu être récupérée");
      }
    );
  }

  select(player : string) {
    console.log(player + ' clicked');

    this.sendChallengedPlayerEmitter.emit(player);
  }

  backToMenu() {
    this.sendQuizzEndedEmitter.emit();
  }

}
