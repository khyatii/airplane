import { Component, OnInit, OnDestroy } from '@angular/core';
import { SessionService } from "../../shared/services/session.service"
import 'rxjs/add/operator/takeUntil';
import { Subject } from 'rxjs/Subject';
import { userInterface } from '../../shared/interfaces/interfaces'
import { Router } from "@angular/router";
import { HeaderObservablesService } from '../../shared/services/header-observables.service';

@Component({
  selector: 'app-share-promo',
  templateUrl: './share-promo.component.html',
  styleUrls: ['./share-promo.component.sass']
})
export class SharePromoComponent implements OnInit, OnDestroy {
  private ngUnsubscribe: Subject<void> = new Subject<void>();
  private username: userInterface;

  constructor(
    private session: SessionService,
    private router: Router,
    private header: HeaderObservablesService
  ) { }

  ngOnInit(): void {
    window.scrollTo( 0, 0);
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

  yourPromoCode(): void {
    if(this.username) this.router.navigate(['/promo']);
    else this.header.openLoginModal()

  }

}
