import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-topbar',
  templateUrl: './topbar.component.html',
  styleUrls: ['./topbar.component.css']
})
export class TopbarComponent implements OnInit {

  @Input() username: string;
  @Input() lastLoginTime: string;

  constructor() { }

  ngOnInit(): void {
  }

}
