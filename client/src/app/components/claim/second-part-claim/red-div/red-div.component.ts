import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-red-div',
  templateUrl: './red-div.component.html',
  styleUrls: ['./red-div.component.sass']
})
export class RedDivComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
    window.scrollTo( 0, window.outerHeight);
  }

}
