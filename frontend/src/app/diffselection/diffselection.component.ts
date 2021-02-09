import { Component, OnInit, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-diffselection',
  templateUrl: './diffselection.component.html',
  styleUrls: ['./diffselection.component.css']
})
export class DiffselectionComponent implements OnInit {

  @Output('selectedDiff')
  sendSelectedDiffEmitter: EventEmitter<string> = new EventEmitter<string>();

  selectEasy(): void { this.sendSelectedDiffEmitter.emit('Facile'); }

  selectNormal(): void { this.sendSelectedDiffEmitter.emit('Normal'); }

  selectHard(): void { this.sendSelectedDiffEmitter.emit('Difficile'); }

  goBack(): void { this.sendSelectedDiffEmitter.emit('back'); }

  constructor() { }

  ngOnInit(): void { }

}
