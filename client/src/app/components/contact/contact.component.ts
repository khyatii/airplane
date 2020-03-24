import { Component, HostListener } from '@angular/core';

@Component({
  selector: 'app-contact',
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.sass']
})
export class ContactComponent {
  public gray: boolean = true

  constructor(
  ) { }

  @HostListener("window:mousemove", ['$event'])
  hover(event: any): void {
    if(window.innerWidth >= 850){
      if(event.srcElement.id === "first-div") this.gray = true
      if(event.srcElement.id === "second-div") this.gray = false
    }
    else this.gray = true
  }






}
