import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { environment }  from '../../../environments/environment';
import { ClaimFormService } from './claim-form.service'
import 'rxjs/add/operator/takeUntil';
import { Subject } from 'rxjs/Subject';
import { BehaviorSubject, Observable } from 'rxjs/Rx'

@Injectable()
export class PromoCodeService {
  private BASE_URL: string = `${environment.BASE_URL}`;
  private ngUnsubscribe: Subject<void> = new Subject<void>();
  private promoCodeSubject = new BehaviorSubject<number>(undefined);
  private errorPromoCode = new BehaviorSubject<string>(undefined)
  private options = {withCredentials:true};

  constructor(
    private http: Http
  ) {
  }

  checkPromoCode(promoCode: string, userId: string, claim: any){
    return this.http.post(`${this.BASE_URL}/promocode/checkpromocode`, {
      promoCode: promoCode.toUpperCase(),
      userId: userId,
      claim: claim
    }, this.options)
      .takeUntil(this.ngUnsubscribe)
      .subscribe(
        res => {
          if(res.json().message == 'you just won 10€') this.promoCodeSubject.next(10)
        },
        error => this.errorPromoCode.next(error.json().message)
      )
  }

  listUserCodes(){
    return this.http.get(`${this.BASE_URL}/promocode/listuser`, this.options)
  }

  getPromoCodeSubject(): Observable<number> {
      return this.promoCodeSubject.asObservable();
  }

  getErrorPromoCodeSubject(): Observable<string> {
      return this.errorPromoCode.asObservable();
  }

}
