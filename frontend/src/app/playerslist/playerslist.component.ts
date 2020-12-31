import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient, HttpParams } from '@angular/common/http';

@Component({
  selector: 'app-playerslist',
  templateUrl: './playerslist.component.html',
  styleUrls: ['./playerslist.component.css']
})
export class PlayerslistComponent implements OnInit {

  players: any[];

  @Output('challengedPlayer')
  sendChallengedPlayerEmitter: EventEmitter<string> = new EventEmitter<any>();

  constructor(private http: HttpClient) { }

  ngOnInit(): void {
    // récupérer la liste de joueurs connectés
    this.getPlayers();
  }

  getPlayers() : void {
    const username = localStorage.getItem('user');
    const user = JSON.parse(localStorage.getItem(username));
    const idDb = user.idDb;

    let params = new HttpParams().set("idDb", idDb);
    this.http.get<any>('http://localhost:3037/players', {params: params}).subscribe(
      response => {
        this.players = response;
        console.log(this.players);
      },
      error => {
        console.log("err: la liste des joueurs n'a pas pu être récupérée");
      }
    );
  }

  select(player : string) : void {
    console.log(player + ' clicked');

    this.sendChallengedPlayerEmitter.emit(player);
  }

}
