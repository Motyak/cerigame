import { Component, Input, OnInit } from '@angular/core';

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

  @Input() identifiantDefiant: string;
  @Input() theme: string;
  @Input() diff: Difficulte;

  constructor() { }

  ngOnInit(): void {
    console.log(this.theme + ";" + this.diff);
  }

}
