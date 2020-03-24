import { Component, OnInit, OnDestroy, HostListener, ViewChild, ElementRef } from '@angular/core';
import { PromoCodeService } from '../../../shared/services/promo-code.service'
import { SessionService } from "../../../shared/services/session.service"
import { userInterface } from '../../../shared/interfaces/interfaces'
import 'rxjs/add/operator/takeUntil';
import { Subject } from 'rxjs/Subject';

@Component({
  selector: 'app-my-promo',
  templateUrl: './my-promo.component.html',
  styleUrls: ['./my-promo.component.sass']
})
export class MyPromoComponent implements OnInit, OnDestroy {
  @ViewChild('activity')
  private activity : ElementRef;
  private ngUnsubscribe: Subject<void> = new Subject<void>();
  public firstPadding: boolean;
  public scrolled: boolean;
  public promosTotal: number = 0;
  public pendingEuros: number = 0;
  public earnedEuros: number = 0;
  public failedPromos: number = 0;
  public username: userInterface;

  constructor(
    private promo: PromoCodeService,
    private session: SessionService,
  ) { }

  ngOnInit(): void {
    window.scrollTo( 0, 0);
    this.padding();
    this.promo.listUserCodes()
      .takeUntil(this.ngUnsubscribe)
      .subscribe(
        res => {
          this.promosTotal = res.json().length;
          let pending = [];
          let earned = [];
          let failed = [];
          res.json().forEach(e => {
            if(e.status === "PaymentDone") earned.push(e)
            else if(e.status === "Rejected") failed.push(e)
            else pending.push(e)
          })
          if(pending.length >= 1) this.pendingEuros = pending.length * 10;
          if(earned.length >= 1) this.earnedEuros = earned.length * 10;
          if(failed.length >= 1) this.failedPromos = failed.length;
        },
      )

    this.session.getUserSubject()
      .takeUntil(this.ngUnsubscribe)
      .subscribe(user => {
        this.username = user
      })
  }

  ngOnDestroy(): void {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  @HostListener('window:resize', [''])
  padding(): void {
    this.activityPosition()
    if(window.innerWidth < 1250) {
      (window.innerHeight < 368 + 100) ? this.firstPadding = true : this.firstPadding = false;
    }else this.firstPadding = false
  }

  @HostListener('window:touchmove', [''])
  activityPosition(): void {
    (window.innerHeight + window.pageYOffset > this.activity.nativeElement.offsetTop)? this.scrolled = true : this.scrolled = false
  }

  scrollToActivity(): void {
    window.scrollTo( 0, this.activity.nativeElement.offsetTop - 55);
    this.scrolled = true
  }

}
