import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs/Rx'

@Injectable()
export class HeaderObservablesService {
  private claimButton = new BehaviorSubject<boolean>(true);
  private finishButton = new BehaviorSubject<boolean>(undefined);
  private finishForm = new BehaviorSubject<boolean>(undefined);
  private arrowUp = new BehaviorSubject<boolean>(false);
  private loginValidate = new BehaviorSubject<boolean>(false);
  private openLogin = new BehaviorSubject<boolean>(false);
  private cleanLoginError = new BehaviorSubject<boolean>(false);

  constructor() { }

  finishBoolean(boolean: boolean): void {
    this.finishButton.next(boolean);
  }

  getFinishSubject(): Observable<boolean> {
    return this.finishButton.asObservable();
  }

  finishClaim(boolean: boolean): void {
    this.finishForm.next(boolean);
  }

  getFinishClaimSubject(): Observable<boolean> {
    return this.finishForm.asObservable();
  }

  claimButtonBoolean(boolean: boolean): void {
    this.claimButton.next(boolean);
  }

  getButtonSubject(): Observable<boolean> {
    return this.claimButton.asObservable();
  }

  arrowBoolean(boolean: boolean): void {
    this.arrowUp.next(boolean);
  }

  getArrowUpSubject(): Observable<boolean> {
    return this.arrowUp.asObservable();
  }

  validate(): void {
    this.loginValidate.next(false);
  }

  getValidateSubject(): Observable<boolean> {
    return this.loginValidate.asObservable();
  }

  openLoginModal(): void {
    this.openLogin.next(true);
  }

  getOpenLogin(): Observable<boolean> {
    return this.openLogin.asObservable();
  }

  sendCleanLoginErrors(boolean: boolean): void {
    this.cleanLoginError.next(boolean);
  }

  getCleanLoginErrors(): Observable<boolean> {
    return this.cleanLoginError.asObservable();
  }
}
