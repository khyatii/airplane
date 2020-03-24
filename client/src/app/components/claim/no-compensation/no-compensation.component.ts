import { Component, HostListener, OnInit } from '@angular/core';

@Component({
  selector: 'app-no-compensation',
  templateUrl: './no-compensation.component.html',
  styleUrls: ['./no-compensation.component.sass']
})
export class NoCompensationComponent implements OnInit  {
  public gray: boolean = true

  constructor() { }

  ngOnInit(): void {
    window.scrollTo( 0, 0);
  }

  @HostListener("window:mousemove", ['$event'])
  hover(event: any): void {
    if(window.innerWidth >= 850){
      if(event.srcElement.id === "first-div") this.gray = true
      if(event.srcElement.id === "second-div") this.gray = false
    }
    else this.gray = true
  }

}
