import { Component, ElementRef, OnDestroy, OnInit } from '@angular/core';
import { AirportAutocompleteService } from '../../../shared/services/airport-autocomplete.service'
import { AirlineAutocompleteService } from '../../../shared/services/airline-autocomplete.service'
import { ClaimFormService } from '../../../shared/services/claim-form.service'
import { SessionService } from '../../../shared/services/session.service'
import { TranslateService } from '../../../shared/services/translate.service'
import { claimInterface, userInterface } from '../../../shared/interfaces/interfaces'
import 'rxjs/add/operator/takeUntil';
import { Subject } from 'rxjs/Subject';

@Component({
  selector: 'app-first-part-claim',
  templateUrl: './first-part-claim.component.html',
  styleUrls: ['./first-part-claim.component.sass'],
  host: {
    '(document:click)': 'handleClick($event)',
  },
})
export class FirstPartClaimComponent implements OnDestroy, OnInit {
  private ngUnsubscribe: Subject<void> = new Subject<void>();
  private username: userInterface;
  public conexionsArray: Array<any> = [{
    fromCounter: 0,
    toCounter: 1,
  }];
  private counter: number = 0;

  private i = "0";

  private airportSearch: Array<any> = [
    {name: undefined}, {name: undefined},
    {name: undefined}, {name: undefined},
    {name: undefined}, {name: undefined},
    {name: undefined}, {name: undefined},
    {name: undefined}, {name: undefined},
    {name: undefined}, {name: undefined},
    {name: undefined}, {name: undefined},
    {name: undefined}, {name: undefined},
    {name: undefined}, {name: undefined},
    {name: undefined}, {name: undefined},
  ];
  private airportsArray: Array<any> = [
    [], [],
    [], [],
    [], [],
    [], [],
    [], [],
    [], [],
    [], [],
    [], [],
    [], [],
    [], [],
  ];
  public airlinesArray = [];
  public airlineSearch = {
    name: undefined
  };

  public multiple: boolean;
  public claimType: string;
  private calculation: claimInterface;
  public ulClaimDisplay: boolean = false;

  public invalidForm: boolean;
  public checkedBox: boolean;

  private From: string;
  private To: string;

  //css
  private notAllowed: object;
  private add: object;

  constructor(
    private session: SessionService,
    private claimService: ClaimFormService,
    private airlineComplete: AirlineAutocompleteService,
    private airportComplete: AirportAutocompleteService,
    private elementRef: ElementRef,
    private translate: TranslateService,
  ) {
  }

  ngOnInit(): void {
    window.scrollTo( 0, 0);

    this.claimService.getCheckBoxSubject()
      .takeUntil(this.ngUnsubscribe)
      .subscribe(checked => {
        this.checkedBox = checked
      })
  }

  ngOnDestroy(): void {
    this.claimService.sendCheckBox(false)
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  focusOutAirport(event: any): void {
    this.airportComplete.find(event.target.value)
      .takeUntil(this.ngUnsubscribe)
      .subscribe(
        airport => {
          if(airport.length < 1) this.airportSearch.splice(event.target.parentNode.id, 1, {name: undefined});
        },
        error => this.airportSearch.splice(event.target.parentNode.id, 1, {name: undefined})
      )
    // this leaves the ul blank
    this.airportsArray.splice(event.target.parentNode.id, 1, []);
  }

  focusOutAirline(event: any): void {
    this.airlineComplete.find(event.target.value)
      .takeUntil(this.ngUnsubscribe)
      .subscribe(
        airline => {
          if(airline.length < 1) this.airlineSearch = {name: undefined};
        },
        error => this.airlineSearch = {name: undefined}
      )
    this.airlinesArray = [];
  }

  displayClaimList(): void {
    this.ulClaimDisplay = !this.ulClaimDisplay
  }

  checkClaimList(event: any): void {
    switch(event.target.value) {
      //english
      case 'Delay less than 3 hours': break;
      case 'Delay greater than 3 hours': break;
      case 'Cancellation':                break;
      case 'Overbooking':                break;
      //spanish
      case 'Retraso inferior a 3 horas': break;
      case 'Retraso superior a 3 horas': break;
      case 'Cancelación':                break;
      case 'Overbooking':                break;
      default:                           this.claimType = '';
    }
    this.ulClaimDisplay = !this.ulClaimDisplay
  }

  addConexions(): void {
    if(this.counter > 15){
      this.add = {
        "cursor": "not-allowed",
      }
    }else{
      this.counter +=2
      this.conexionsArray.push({
        fromCounter: this.counter,
        toCounter: this.counter + 1,
      })
    }
  }

  filterAirport(event: any): void {
    if (event.target.value !== "") {
      this.airportComplete.new(event.target.value)
        .takeUntil(this.ngUnsubscribe)
        .subscribe(
          airports => {
            if(airports.length > 0) this.airportsArray.splice(event.target.parentNode.id, 1, airports)
            else this.airportsArray.splice(event.target.parentNode.id, 1, [{name: 'Tu búsqueda no coincide con ningún aeropuerto, prueba a buscar introduciendo el código de tres letras del aeropuerto'}]);
          },
          error => {
            this.airportsArray.splice(event.target.parentNode.id, 1, [{name: 'Tu búsqueda no coincide con ningún aeropuerto, prueba a buscar introduciendo el código de tres letras del aeropuerto'}]);
          }
        )
    } else this.airportsArray.splice(event.target.parentNode.id, 1, []);

  }

  filterAirline(event: any): void {
    if (event.target.value !== "") {
      this.airlineComplete.new(event.target.value)
        .takeUntil(this.ngUnsubscribe)
        .subscribe(
          airlines => {
            if(airlines.length > 0) this.airlinesArray = airlines;
            else this.airlinesArray = [{name: 'Tu búsqueda no coincide con ninguna aerolínea'}]
          },
          error => this.airlinesArray = [{name: 'Tu búsqueda no coincide con ninguna aerolínea'}]
        )
    } else this.airlinesArray = [];
  }

  selectAirport(airport: any, event: any): void {
    this.airportSearch.splice(event.target.parentNode.parentNode.id, 1, airport);
    this.airportsArray.splice(event.target.parentNode.parentNode.id, 1, []);
  }

  selectAirline(airline: any, event: any): void {
    this.airlineSearch = airline
    this.airlinesArray = [];
  }

  selectClaimType(event: any): void {
    this.claimType = event.target.innerText || event.target.innerHTML || event.target.outerText
  }

  handleClick(event: any): void {
    var clickedComponent = event.target;
    var inside = false;
    do {
      if (clickedComponent === this.elementRef.nativeElement) {
        inside = true;
      }
      clickedComponent = clickedComponent.parentNode;
    } while (clickedComponent);
    if (!inside) {
      if(event.target.parentNode) this.airlinesArray = [];
    }
  }

  multipleConexions(): void {
      this.notAllowed = {
        "display": "inherit"
      }
      this.addConexions();
  }

  direct(): void {
      this.notAllowed = {
        "display": "none"
      }
      this.add = {
        "cursor": "pointer",
      }
      this.counter = 1
      this.conexionsArray = [{
        fromCounter: 0,
        toCounter: 1,
      }];
  }

  quitConexions(): void {
    this.add = {
      "cursor": "pointer"
    }
    if(this.counter > 2) this.conexionsArray.pop()
    this.counter -= 2
    if(this.counter < 2){
      this.notAllowed = {
        "cursor": "not-allowed",
        "display": "inherit"
      }
    }
  }

  newCalculation(form: any): void {
    //let validation errors appear with invalidForm=true
    this.invalidForm = true
    //first formal control if form is valid, then a more extensive control if fields are real  airports or so
    if(form.form._status== 'VALID' && this.checkedBox){
      this.checkAirportsAirline().then(
        boolean => {
          if(boolean) {
            let calculationForm = {
              airline: this.airlineSearch,
              airports: [],
              claimType: this.translate.englishInstant(this.claimType),
            }
            let filledAirportsFirst = this.airportSearch.filter(airport => airport.hasOwnProperty('name'));
            let filledAirports = filledAirportsFirst.filter(airport => airport.name !== undefined);
            filledAirports.forEach((e) => {if(e !== '') calculationForm.airports.push(e)})
            this.claimService.calculate(calculationForm)
              .takeUntil(this.ngUnsubscribe)
              .subscribe(
                res => {
                  this.calculation = res.json();
                  this.claimService.sendCalculationSubject(this.calculation);
                },
                error => {
                  this.calculation = {
                    companyMoney: 0,
                    claimType: 'error',
                    airline: {error: 'error'},
                    airports: [{error: 'error'}],
                  }
                  this.claimService.sendCalculationSubject(this.calculation);
              });
          }
        }
      )
    }
  }

  checkAirportsAirline(): Promise<boolean> {

    return new Promise((resolve, reject) => {
      this.airlineComplete.find(this.airlineSearch.name)
        .takeUntil(this.ngUnsubscribe)
        .subscribe(
          airline => {
            if(airline.length < 1) resolve(false);
          },
          error => resolve(false)
        )
      //here remove other airports in case direct flight
      if(!this.multiple) {
        for(let i = 0; i < this.airportSearch.length; i++) {
        if(i>1) this.airportSearch[i] = ""
        }
      }
      let filledAirportsFirst = this.airportSearch.filter(airport => airport.hasOwnProperty('name'))
      let filledAirports = filledAirportsFirst.filter(airport => airport.name !== undefined)
      filledAirports.forEach((e, i) => {
        this.airportComplete.find(e.name)
            .takeUntil(this.ngUnsubscribe)
            .subscribe(
              airport => {
                if(airport.length < 1) resolve(false)
                else if((i === filledAirports.length - 1) && (airport.length >= 1)) resolve(true)
              },
              error => resolve(false)
            )
      })
    })
  }
}
