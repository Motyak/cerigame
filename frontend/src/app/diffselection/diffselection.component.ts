import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-diffselection',
  templateUrl: './diffselection.component.html',
  styleUrls: ['./diffselection.component.css']
})
export class DiffselectionComponent implements OnInit {

  @Output('selectedDiff')
  sendSelectedDiffEmitter: EventEmitter<string> = new EventEmitter<string>();

  selectEasy(): void {
    this.sendSelectedDiffEmitter.emit('facile');
  }

  selectNormal(): void {
    this.sendSelectedDiffEmitter.emit('normal');
  }

  selectHard(): void {
    this.sendSelectedDiffEmitter.emit('difficile');
  }

  goBack(): void {
    this.sendSelectedDiffEmitter.emit('back');
  }

  constructor() { }

  ngOnInit(): void {
  }

}
