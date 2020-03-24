import { Component, OnInit, OnDestroy } from '@angular/core';
import { SessionService } from '../../shared/services/session.service'
import { PromoCodeService } from '../../shared/services/promo-code.service'
import { ClaimFormService } from '../../shared/services/claim-form.service'
import { claimInterface, userInterface } from '../../shared/interfaces/interfaces'
import { HeaderObservablesService } from '../../shared/services/header-observables.service';
import 'rxjs/add/operator/takeUntil';
import { Subject } from 'rxjs/Subject';

@Component({
  selector: 'app-claim',
  templateUrl: './claim.component.html',
  styleUrls: ['./claim.component.sass'],

})
export class ClaimComponent implements OnInit, OnDestroy {
  private ngUnsubscribe: Subject<void> = new Subject<void>();
  public username: userInterface;
  public calculation: claimInterface;
  private promoCode: number;

  constructor(
    private promoCodeService: PromoCodeService,
    private session: SessionService,
    private claimService: ClaimFormService,
    private header: HeaderObservablesService,

  ) {
  }

  ngOnInit(): void {
    window.scrollTo( 0, 0);

    this.claimService.getClaimIdSubject()
      .takeUntil(this.ngUnsubscribe)
      .subscribe( (id: string) => {
        if(id) this.claimService.findById(id)
                .takeUntil(this.ngUnsubscribe)
                .subscribe(res => this.calculation = res.json());
      })

    this.claimService.getCalculationSubject()
      .takeUntil(this.ngUnsubscribe)
      .subscribe(calculation => this.calculation = calculation)

    this.session.getUserSubject()
      .takeUntil(this.ngUnsubscribe)
      .subscribe(user => this.username = user);

    this.header.claimButtonBoolean(false)

    this.promoCodeService.getPromoCodeSubject()
      .takeUntil(this.ngUnsubscribe)
      .subscribe(promo => this.promoCode = promo)
  }

  ngOnDestroy(): void {
    this.claimService.sendClaimIdSubject(undefined);
    this.claimService.sendCalculationSubject(undefined);
    this.header.claimButtonBoolean(true);
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }




}
