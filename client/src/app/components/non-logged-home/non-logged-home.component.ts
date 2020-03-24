import { Component, Input, OnInit, OnDestroy, HostListener, ViewChild, ElementRef } from '@angular/core';
import { HeaderObservablesService } from '../../shared/services/header-observables.service';
import {animate, state, style, transition, trigger} from '@angular/animations';


@Component({
  selector: 'app-non-logged-home',
  templateUrl: './non-logged-home.component.html',
  styleUrls: ['./non-logged-home.component.sass'],
  animations:
    [trigger(
      'animation',
      [
        state('displayed', style({display: 'block', 'transform':'translateX(0)'})),
        state('notDisplayedLeft1', style({display: 'none', 'transform':'translateX(400px)'})),
        state('notDisplayedRight1', style({display: 'none', 'transform':'translateX(-400px)'})),
        state('leftNotDisplayed1', style({display: 'none', 'transform':'translateX(-400px)'})),
        state('rightNotDisplayed1', style({display: 'none', 'transform':'translateX(400px)'})),
        state('web', style({display: 'flex', 'transform':'none'})),

        transition('* => *', [animate('200ms ease-in-out')]),
        transition('* => web', [animate('0ms ease-in-out')]),
      ],
    )],

})
export class NonLoggedHomeComponent implements OnInit, OnDestroy {
  @Input() loginComponent: boolean;
  @ViewChild('claim')
  private claimButton : ElementRef;
  private scrolled: boolean = false;
  private secondDivPosition: number;
  public firstPadding: boolean;
  public secondPadding: boolean;
  public thirdPadding: boolean;

  //css
  public firstC: object;
  public secondC: object;
  public thirdC: object;
  public firstArrow: object;
  public secondArrow: object;

  //animations
  public animationForm : string;
  public animationExperts : string;
  public animationMoney: string;

  constructor(
    private header: HeaderObservablesService,
  ) {
  }

  ngOnInit(): void {
    window.scrollTo( 0, 0);
    this.padding();
    this.scrolled = false
    this.header.claimButtonBoolean(false);
    this.secondDivPosition = 1;
  }

  ngOnDestroy(): void {
    this.header.claimButtonBoolean(true)
  }

  @HostListener("window:scroll", [])
  onWindowScroll(): void {
    (this.claimButton.nativeElement.offsetTop < window.pageYOffset - 40) ? this.header.claimButtonBoolean(true) : this.header.claimButtonBoolean(false);
  }

  @HostListener("touchmove", [])
  onTouchMove(): void {
    (this.claimButton.nativeElement.offsetTop < window.pageYOffset - 40) ? this.header.claimButtonBoolean(true) : this.header.claimButtonBoolean(false);
  }

  divLeft(): void {
    if(this.secondDivPosition > 1) {
      this.secondDivPosition --;
      this.moveSecondDivLeft();
      this.circleBackground();
    }
  }

  divRight(): void {
    if(this.secondDivPosition < 3) {
      this.secondDivPosition ++;
      this.moveSecondDivRight();
      this.circleBackground();
    }
  }

  moveSecondDivRight(): void {
    if(window.innerWidth < 850) {
      switch(this.secondDivPosition) {
        case 1:
        this.animationForm = 'displayed';
        this.animationExperts = 'notDisplayedLeft1';
        break;
        case 2:
        this.animationForm = 'leftNotDisplayed1';
        this.animationMoney = 'notDisplayedLeft1';
        break;
        default:
        this.animationExperts = 'leftNotDisplayed1';
      }
    }
  }

  moveSecondDivLeft(): void {
    if(window.innerWidth < 850) {
      switch(this.secondDivPosition) {
        case 1:
          this.animationExperts = 'rightNotDisplayed1';
          break;
        default:
          this.animationMoney = 'rightNotDisplayed1';
      }
    }
  }

  animationDone(event: any): void {
    if(this.animationForm && this.animationExperts && this.animationExperts !== 'web'){
      if(window.innerWidth < 850) {
        switch(this.secondDivPosition) {
          case 1:
            this.animationForm = 'displayed';
            break;
          case 2:
            this.animationExperts = 'displayed';
            break;
          default:
            this.animationMoney = 'displayed';
            this.animationExperts = 'notDisplayedRight1';
        }
      }
    }
  }

  circleBackground(): void {
    if (window.innerWidth < 850) {
      switch(this.secondDivPosition) {
        case 1:
          this.firstC = {'background-color': '#293855'};
          this.secondC = {'background-color': '#C7D5E7'};
          this.thirdC = {'background-color': '#C7D5E7'};
          this.firstArrow = {'opacity': '0.5'};
          break;
        case 2:
          this.firstC = {'background-color': '#C7D5E7'};
          this.secondC = {'background-color': '#293855'};
          this.thirdC = {'background-color': '#C7D5E7'};
          this.firstArrow = {'opacity': '1'};
          this.secondArrow = {'opacity': '1'}
          break;
        default:
          this.firstC = {'background-color': '#C7D5E7'};
          this.secondC = {'background-color': '#C7D5E7'};
          this.thirdC = {'background-color': '#293855'};
          this.secondArrow = {'opacity': '0.5'}
      }
    }
  }

  @HostListener('window:resize', [''])
  onResize(): void {
    if (window.innerWidth > 849) {
      if(this.animationForm !== 'web') this.animationForm = 'web';
      if(this.animationExperts !== 'web') this.animationExperts = 'web';
      if(this.animationMoney !== 'web') this.animationMoney = 'web';
    }else{
      this.secondDivPosition = 1
      this.firstC = {'background-color': '#293855'};
      this.secondC = {'background-color': '#C7D5E7'};
      this.thirdC = {'background-color': '#C7D5E7'};
      this.firstArrow = {'opacity': '0.5'};
      this.secondArrow = {'opacity': '1'}
      this.animationForm = 'displayed';
      if(window.innerWidth < 600){
        this.animationExperts = 'notDisplayedLeft1';
        this.animationMoney = 'notDisplayedLeft1';
      }else{
        this.animationExperts = 'notDisplayedLeft2';
        this.animationMoney = 'notDisplayedLeft2';
      }
    }
    this.padding()
  }

  padding(): void {
    if(window.innerWidth < 849) {
      (window.innerHeight < 368 + 100) ? this.firstPadding = true : this.firstPadding = false;
      (window.innerHeight < 467 + 150) ? this.secondPadding = true : this.secondPadding = false;
      (window.innerHeight < 467 + 150) ? this.thirdPadding = true : this.thirdPadding = false;
    }else{
      (window.innerHeight < 511 + 200) ? this.firstPadding = true : this.firstPadding = false;
      (window.innerHeight < 406 + 200) ? this.secondPadding = true : this.secondPadding = false;
      (window.innerHeight < 470 + 200) ? this.thirdPadding = true : this.thirdPadding = false;
    }
  }

}
