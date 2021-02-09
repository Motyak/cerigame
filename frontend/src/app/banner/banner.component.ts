import { Component, OnInit, Input } from '@angular/core';
import { BannerType } from '../BannerType';

@Component({
  selector: 'app-banner',
  templateUrl: './banner.component.html',
  styleUrls: ['./banner.component.css']
})
export class BannerComponent implements OnInit {

  @Input() type: BannerType;
  @Input() msg: string;

  constructor() {}

  ngOnInit(): void {}

}
