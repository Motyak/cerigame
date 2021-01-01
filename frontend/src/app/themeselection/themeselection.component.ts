import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-themeselection',
  templateUrl: './themeselection.component.html',
  styleUrls: ['./themeselection.component.css']
})
export class ThemeselectionComponent implements OnInit {

  @Input() themes: string[];

  @Output('selectedTheme')
  sendSelectedThemeEmitter: EventEmitter<string> = new EventEmitter<string>();

  constructor() { }

  ngOnInit(): void {}

  onThemeSelected = function(theme: string) : void {
    this.sendSelectedThemeEmitter.emit(theme);
  }

}
