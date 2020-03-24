import { Component, NgZone, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { ClaimFormService } from "../../shared/services/claim-form.service"
import { HeaderObservablesService } from '../../shared/services/header-observables.service';
import { SessionService } from '../../shared/services/session.service'
import { claimInterface, userInterface } from '../../shared/interfaces/interfaces'
import 'rxjs/add/operator/takeUntil';
import { Subject } from 'rxjs/Subject';


@Component({
  selector: 'app-logged-home',
  templateUrl: './logged-home.component.html',
  styleUrls: ['./logged-home.component.sass']
})
export class LoggedHomeComponent implements OnInit, OnDestroy {
  private ngUnsubscribe: Subject<void> = new Subject<void>();
  public username: userInterface;
  public message: userInterface;
  public pendings: Array<claimInterface> = [];
  public completeds: Array<claimInterface> = [];
  public claimsTotal: number = 0;
  public pendingTotal: number = 0;
  public completedTotal: number = 0;
  public justClaimed: boolean = false;
  constructor(
    private zone: NgZone,
    private router: Router,
    private claimService: ClaimFormService,
    private session: SessionService,
    private header: HeaderObservablesService
  ) {
  }

  ngOnInit(): void {
    window.scrollTo( 0, 0);

    this.session.getUserSubject()
      .takeUntil(this.ngUnsubscribe)
      .subscribe(user => this.username = user);

    this.session.getUserSubject()
      .takeUntil(this.ngUnsubscribe)
      .subscribe(user => this.message = user);

    this.claimService.listUser()
      .takeUntil(this.ngUnsubscribe)
      .subscribe(res => {
        let claims = res.json();
        this.claimsTotal = res.json().length;
        this.claimButton();
        claims.forEach(e => {
          if(e.username.hasOwnProperty('idFront') && e.username.hasOwnProperty('address') && e.hasOwnProperty('incidentAirport')
          && e.hasOwnProperty('year') && (e.hasOwnProperty('flightTicketOrReservation') || e.hasOwnProperty('boardingPass'))) {
            if(e.username.address.hasOwnProperty('address') && e.username.address.hasOwnProperty('postalCode')
            && e.username.address.hasOwnProperty('city') && e.username.address.hasOwnProperty('country')) this.completeds.push(e)
          } else this.pendings.push(e)
        })
        this.pendingTotal = this.pendings.length;
        this.completedTotal = this.completeds.length;
      })

      this.claimService.getJustClaimedSubject()
        .takeUntil(this.ngUnsubscribe)
        .subscribe(boolean => this.justClaimed = boolean)
  }

  ngOnDestroy(): void {
    this.header.claimButtonBoolean(true);
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  claimButton(): void {
    if(this.claimsTotal === 0) this.header.claimButtonBoolean(false);
    else this.header.claimButtonBoolean(true);
  }

  complete(claimId: string): void {
    this.claimService.sendClaimIdSubject(claimId)
    this.router.navigate(['/claim'])
  }


}
