import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-themeselection',
  templateUrl: './themeselection.component.html',
  styleUrls: ['./themeselection.component.css']
})
export class ThemeselectionComponent implements OnInit {

  themes: string[];

  @Output('selectedTheme')
  sendSelectedThemeEmitter: EventEmitter<string> = new EventEmitter<string>();

  constructor(private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.route.snapshot.paramMap.get('themes');
  }

  onThemeSelected = function(theme: string) : void {
    this.sendSelectedThemeEmitter.emit(theme);
  }

}
