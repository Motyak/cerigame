import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-themecard',
  templateUrl: './themecard.component.html',
  styleUrls: ['./themecard.component.css']
})
export class ThemecardComponent implements OnInit {

  @Input() name: string;

  @Output('selectedTheme')
  sendSelectedThemeEmitter: EventEmitter<string> = new EventEmitter<string>();

  constructor() { }

  ngOnInit(): void {
  }

  select() : void {
    console.log(this.name + ' clicked');
    this.sendSelectedThemeEmitter.emit(this.name);
  }
}
