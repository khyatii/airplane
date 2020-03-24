import { Component, OnInit, OnDestroy, HostListener, ViewChild, ElementRef } from '@angular/core';
import { SessionService } from '../../../shared/services/session.service'
import { PromoCodeService } from '../../../shared/services/promo-code.service'
import { ClaimFormService } from '../../../shared/services/claim-form.service'
import { HeaderObservablesService } from '../../../shared/services/header-observables.service'
import { claimInterface, userInterface } from '../../../shared/interfaces/interfaces'
import { Router } from "@angular/router";
import 'rxjs/add/operator/takeUntil';
import { Subject } from 'rxjs/Subject';

@Component({
  selector: 'app-second-part-claim',
  templateUrl: './second-part-claim.component.html',
  styleUrls: ['./second-part-claim.component.sass']
})
export class SecondPartClaimComponent implements OnInit, OnDestroy{
  @ViewChild('finishClaim')
  private finishButton : ElementRef;
  @ViewChild('form')
  private form : ElementRef;

  private ngUnsubscribe: Subject<void> = new Subject<void>();
  private username: userInterface;
  private claim: claimInterface;
  public promoCodeError: string;
  public invalidForm: boolean = false
  public picError: boolean = false
  public dniError: boolean = false
  private airports: Array<any>;
  public ulClaimDisplay: boolean = false;
  public formInfo = {
    promoCode: undefined,
    address: undefined,
    postalCode: undefined,
    city: undefined,
    country: undefined,
  }
  public formClaim = {
    id: undefined,
    incidentAirport: undefined,
    year: undefined,
    description: undefined,
  }
  public companyClaim: boolean
  public flightTicket: boolean
  public boardingPass: boolean

  constructor(
    private promoCodeService: PromoCodeService,
    private header: HeaderObservablesService,
    private session: SessionService,
    private claimService: ClaimFormService,
    private router: Router,
  ) {
  }

  ngOnInit(): void {
    window.scrollTo( 0, 0);
    this.finishButtonPosition();

    this.claimService.getClaimIdSubject()
      .takeUntil(this.ngUnsubscribe)
      .subscribe( (id: string) => {
        if(id) this.claimService.findById(id)
                .takeUntil(this.ngUnsubscribe)
                .subscribe(res => {
                  this.claim = res.json();
                  this.organiseClaimPics();
                  this.removeDuplicateAirports();
                });
      })

    this.claimService.getCalculationSubject()
      .takeUntil(this.ngUnsubscribe)
      .subscribe(
        calculation => {
          this.claim = calculation;
          if(this.claim){
            this.submitClaim();
            this.removeDuplicateAirports();
          }
        }
      )
    this.claimService.getPicErrorSubject()
      .takeUntil(this.ngUnsubscribe)
      .subscribe(boolean => this.picError = boolean)

    this.session.getUserSubject()
      .takeUntil(this.ngUnsubscribe)
      .subscribe(
        user => {
          this.username = user;
          if(user) {
            if(user.address){
              this.formInfo.address = user.address.address;
              this.formInfo.postalCode = user.address.postalCode;
              this.formInfo.city = user.address.city;
              this.formInfo.country = user.address.country;
            }
          }
        }
      );

    this.promoCodeService.getErrorPromoCodeSubject()
      .takeUntil(this.ngUnsubscribe)
      .subscribe(
        error => {
          if(error){
            this.formInfo.promoCode = undefined
            if(error == "invalid promoCode") this.promoCodeError = 'Código promocional inválido'
            if(error == "promoCode is only valid for the first claim") this.promoCodeError = 'Has usado un código antes'
            if(error == "you cannot user your own promoCode") this.promoCodeError = 'No puedes usar tu código'
          }
        })

    this.header.getFinishClaimSubject()
      .takeUntil(this.ngUnsubscribe)
      .subscribe(boolean => {
        if(boolean) this.finish(this.form)
      })

  }

  removeDuplicateAirports(): void {
    this.airports = this.claim.airports.filter((airport: any, index, self) =>
      index === self.findIndex((a: any) => (
        a.place === airport.place && a.name === airport.name
      ))
    )
  }

  organiseClaimPics(): void {
    if(this.claim.hasOwnProperty('companyClaim')) this.companyClaim = true;
    if(this.claim.hasOwnProperty('flightTicketOrReservation')) this.flightTicket = true;
    if(this.claim.hasOwnProperty('boardingPass')) this.boardingPass = true;
  }

  ngOnDestroy(): void {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  @HostListener("window:click", [])
  onClick(): void {
    this.finishButtonPosition();
  }

  @HostListener("window:scroll", [])
  onScroll(): void {
    this.finishButtonPosition();
  }

  finishButtonPosition(): void {
    (this.finishButton.nativeElement.offsetTop > window.pageYOffset + window.innerHeight - 65) ? this.header.finishBoolean(true) : this.header.finishBoolean(false)
  }

  displayClaimList(): void {
    this.ulClaimDisplay = !this.ulClaimDisplay
  }

  checkClaimList(event: any): void {
    for(let i=0; i<this.airports.length; i++) {
      if(this.airports[i].name == event.target.value) break;
      if(i == this.airports.length-1 && this.airports[i].name !== event.target.value) {
        this.formClaim.incidentAirport = undefined
      }
    }
    this.ulClaimDisplay = !this.ulClaimDisplay
  }

  selectAirport(airport): void {
    this.formClaim.incidentAirport = airport.name
  }

  submitClaim(): void {
    this.claimService.new(this.claim)
    .takeUntil(this.ngUnsubscribe)
      .subscribe(
        res => {
          this.claim = res.json();
          this.claimService.sendClaimSubject(this.claim);
        },
        error => {
          this.claim = {
            companyMoney: 0,
            claimType: 'error',
            airline: {error: 'error'},
            airports: [{error: 'error'}],
          }
          this.claimService.sendClaimSubject(this.claim);
        });
  }

  finish(form: any): void {
    this.claimService.findById(this.claim._id)
      .takeUntil(this.ngUnsubscribe)
      .subscribe(claim => {
        this.claimService.sendClaimSubject(claim.json())
        if(!claim.json().flightTicketOrReservation && !claim.json().boardingPass) this.picError = true;
        else this.picError = false
      })
    this.session.currentUser()
      .takeUntil(this.ngUnsubscribe)
      .subscribe(res => {
        if(!res.json().idFront) this.dniError = true
      })
    //let validation errors appear with invalidForm=true
    this.invalidForm = true
    if((form.form.controls.address._status== 'VALID') && (form.form.controls.city._status== 'VALID')
    && (form.form.controls.country._status== 'VALID') && (form.form.controls.incidentAirport._status== 'VALID')
    && (form.form.controls.postalCode._status== 'VALID') && (form.form.controls.year._status== 'VALID') && !this.picError && !this.dniError){
      this.formClaim.id = this.claim._id
      this.session.addressUpload(this.formInfo)
        .takeUntil(this.ngUnsubscribe)
        .subscribe(
          res => {
            this.claimService.update(this.formClaim)
              .takeUntil(this.ngUnsubscribe)
              .subscribe(() => {
                this.claimService.sendJustClaimedSubject(true)
                this.router.navigate(['/user']);
              })
          }
        )
    }else if(!this.picError && !this.dniError) window.scrollTo( 0, 0);
  }

  checkPromoCode(): void {
    if(this.formInfo.promoCode) this.promoCodeService.checkPromoCode(this.formInfo.promoCode, this.username._id, this.claim)
  }

  scrollToBottom(): void {
    window.scrollTo( 0, window.innerHeight);
  }


}
