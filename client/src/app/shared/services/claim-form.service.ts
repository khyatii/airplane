import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Observable } from 'rxjs/Rx';
import { environment }  from '../../../environments/environment';
import { BehaviorSubject } from 'rxjs';
import { claimInterface } from'../interfaces/interfaces'
import 'rxjs/add/operator/takeUntil';
import { Subject } from 'rxjs/Subject';

@Injectable()
export class ClaimFormService {
  private BASE_URL: string = `${environment.BASE_URL}`;
  private ClaimSubject = new BehaviorSubject<claimInterface>(undefined);
  private ClaimIdSubject = new BehaviorSubject<string>(undefined);
  private justClaimedSubject = new BehaviorSubject<boolean>(undefined);
  private CalculationSubject = new BehaviorSubject<claimInterface>(undefined);
  private picErrorSubject = new BehaviorSubject<boolean>(undefined);
  private checkBoxSubject = new BehaviorSubject<boolean>(false);
  private ngUnsubscribe: Subject<void> = new Subject<void>();
  private options = {withCredentials:true};

  constructor(
    private http: Http,
  ) {
  }

  new(formInfo: claimInterface) {
    return this.http.post(`${this.BASE_URL}/claim/new`, formInfo, this.options)
  }

  calculate(formClaim: claimInterface) {
    return this.http.post(`${this.BASE_URL}/claim/calculate`, formClaim)
  }

  update(formClaim: object) {
    return this.http.post(`${this.BASE_URL}/claim/update`, formClaim, this.options)
  }

  listUser() {
    return this.http.get(`${this.BASE_URL}/claim/userlist`, this.options)
  }

  findById(id: string) {
    return this.http.post(`${this.BASE_URL}/claim/findbyid`, {id: id}, this.options)
  }

  sendPicError(boolean: boolean){
    this.picErrorSubject.next(boolean);
  }

  getPicErrorSubject(): Observable<boolean> {
    return this.picErrorSubject.asObservable();
  }

  sendCheckBox(boolean: boolean){
    this.checkBoxSubject.next(boolean);
  }

  getCheckBoxSubject(): Observable<boolean> {
    return this.checkBoxSubject.asObservable();
  }

  sendCalculationSubject(calculation: claimInterface){
    this.CalculationSubject.next(calculation);
  }

  getCalculationSubject(): Observable<claimInterface> {
    return this.CalculationSubject.asObservable();
  }

  sendClaimSubject(claim: claimInterface){
    this.ClaimSubject.next(claim);
  }

  getClaimSubject(): Observable<claimInterface> {
    return this.ClaimSubject.asObservable();
  }

  sendClaimIdSubject(id: string){
    this.ClaimIdSubject.next(id);
  }

  getClaimIdSubject(): Observable<string> {
    return this.ClaimIdSubject.asObservable();
  }

  sendJustClaimedSubject(boolean: boolean){
    this.justClaimedSubject.next(boolean);
  }

  getJustClaimedSubject(): Observable<boolean> {
    return this.justClaimedSubject.asObservable();
  }
}
