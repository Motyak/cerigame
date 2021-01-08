import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { HttpService } from '../http.service';

@Component({
  selector: 'app-topten',
  templateUrl: './topten.component.html',
  styleUrls: ['./topten.component.css']
})
export class ToptenComponent implements OnInit {

  classement: any[];

  @Output('backToMenu')
  sendBackToMenuEmitter: EventEmitter<void> = new EventEmitter<any>();

  constructor(private http: HttpService) { }

  ngOnInit(): void {
    this.getClassementFromServer();
  }

  getClassementFromServer() {
    this.http.getTopTen().subscribe(
      response => {
        this.classement = response;
        console.log(this.classement);
      },
      error => {
        console.log("err: le classement n'a pas pu être récupérée");
      }
    )
  }

  backToMenu() {
    this.sendBackToMenuEmitter.emit();
  }

}
