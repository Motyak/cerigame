import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';

import { HttpService } from '../http.service';
import { PersistenceService } from '../persistence.service';

@Component({
  selector: 'app-playerslist',
  templateUrl: './playerslist.component.html',
  styleUrls: ['./playerslist.component.css']
})
export class PlayerslistComponent implements OnInit {

  players: any[];

  @Input() challenge: boolean;

  @Output('challengedPlayer')
  sendChallengedPlayerEmitter: EventEmitter<string> = new EventEmitter<any>();

  @Output('quizzEnded')
  sendQuizzEndedEmitter: EventEmitter<void> = new EventEmitter<any>();

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
    if(this.challenge)
      this.sendChallengedPlayerEmitter.emit(player);
    else
      console.log('afficher profil de ' + player);
  }

  backToMenu() {
    this.sendQuizzEndedEmitter.emit();
  }

}
