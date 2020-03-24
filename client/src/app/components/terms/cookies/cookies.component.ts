import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-cookies',
  templateUrl: './cookies.component.html',
  styleUrls: ['../terms.component.sass']
})
export class CookiesComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
    window.scrollTo( 0, 0);

  }

}
