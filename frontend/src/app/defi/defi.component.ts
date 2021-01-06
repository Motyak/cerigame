import { Component, OnInit } from '@angular/core';

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

  identifiantDefiant: string;
  theme: string;
  diff: Difficulte;

  constructor() { }

  ngOnInit(): void {
  }

}
