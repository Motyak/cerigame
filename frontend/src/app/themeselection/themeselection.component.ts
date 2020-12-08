import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-themeselection',
  templateUrl: './themeselection.component.html',
  styleUrls: ['./themeselection.component.css']
})
export class ThemeselectionComponent implements OnInit {

  @Input() themes: string[];

  constructor() { }

  ngOnInit(): void {
  }

}
