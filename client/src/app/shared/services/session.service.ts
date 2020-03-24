import { Injectable, NgZone, OnDestroy } from '@angular/core';
import { userInterface, authErrorInterface } from '../interfaces/interfaces'
import { AuthHttp } from 'angular2-jwt';
import { Response } from '@angular/http';
import { BehaviorSubject, Observable } from 'rxjs/Rx'
import { environment } from '../../../environments/environment';
import { Router } from "@angular/router";
import { ModalService } from './modal.service';
import { ClaimFormService } from './claim-form.service'
import 'rxjs/add/operator/takeUntil';
import { Subject } from 'rxjs/Subject';
///<reference path="../../../typings/gapi.auth2/gapi.auth2.d.ts" />

declare const gapi: any;
declare const FB: any;


@Injectable()
export class SessionService implements OnDestroy {

  private ngUnsubscribe: Subject<void> = new Subject<void>();
  private UserSubject = new BehaviorSubject<userInterface>(undefined);
  private modalClose = new BehaviorSubject<boolean>(undefined);
  //it refers to auth errors
  private errorSubject = new BehaviorSubject<authErrorInterface>(undefined);
  private googleErrorSubject = new BehaviorSubject<any>(undefined);
  private googleLoadSubject = new BehaviorSubject<boolean>(false);

  private accessToken: string;
  private modalId: string;
  private username: userInterface;
  private message: userInterface;
  private email: userInterface;
  private password: userInterface;
  private BASE_URL: string = `${environment.BASE_URL}`;

  private options = { withCredentials: true };
  constructor(
    private claimService: ClaimFormService,
    private zone: NgZone,
    private modalService: ModalService,
    private http: AuthHttp,
    private router: Router,
  ) {
    FB.init({
      appId: '726042150925672',
      status: false,
      cookie: true,
      xfbml: false,
      version: 'v2.8'
    });

  }

  ngOnDestroy(): void {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  forgotPassword(email: userInterface, route: string) {
    return this.http.post(`${this.BASE_URL}/forgotPassword`, email, this.options)
      .takeUntil(this.ngUnsubscribe)
  }

  setPassword(password: userInterface, route: string) {
    return this.http.post(`${this.BASE_URL}/setPassword/` + password.id, password, this.options)
      .takeUntil(this.ngUnsubscribe)
  }

  // confirmLogin(email: userInterface, route: string) {
  //   return this.http.post(`${this.BASE_URL}/confirmLogin/` + email.id, email, this.options)
  //     .takeUntil(this.ngUnsubscribe)
  // }

  checkTokenExpire(checkTokenExpire: userInterface, route: string) {
    return this.http.post(`${this.BASE_URL}/checkTokenExpire/` + checkTokenExpire.id, checkTokenExpire, this.options)
      .takeUntil(this.ngUnsubscribe)
  }

  checkTokenExpireLogin(checkTokenExpireLogin: userInterface, route: string) {
    console.log("checkhi",route)
    return this.http.post(`${this.BASE_URL}/checkTokenExpireLogin/` + checkTokenExpireLogin.id, checkTokenExpireLogin, this.options)
      .takeUntil(this.ngUnsubscribe)
  }

  signup(username: userInterface, route: string) {
    return this.http.post(`${this.BASE_URL}/signup`, username, this.options)
      .takeUntil(this.ngUnsubscribe)
  }

  login(username: userInterface, route: string) {
    return this.http.post(`${this.BASE_URL}/login`, username, this.options)
      .takeUntil(this.ngUnsubscribe)
  }

  logout() {
    return this.http.get(`${this.BASE_URL}/logout`, this.options)
      .takeUntil(this.ngUnsubscribe)
      .subscribe(
        res => {
          this.claimService.sendClaimSubject(undefined);
          this.username = null;
          this.UserSubject.next(this.username)
          this.router.navigate(['../']);
        }
      )
  }

  isLoggedIn(route: string) {
    return this.http.get(`${this.BASE_URL}/loggedin`, this.options)
      .takeUntil(this.ngUnsubscribe)
      .subscribe(
        res => this.signRefactor(res, route)
      )
  }

  currentUser() {
    return this.http.get(`${this.BASE_URL}/loggedin`, this.options)
  }

  googleLoad() {
    return new Promise(function (resolve, reject) {
      window.onload = resolve;
    });
  }

  handleGoogleClientLoad(): void {
    this.googleLoad().then(() => {
      gapi.load('client:auth2', () => this.initClient())
    });
  }

  initClient(): void {
    let that = this
    gapi.client.init({
      'clientId': '766486881645-j0g1rttu1t8obljmmdmrqf96l664ou9g.apps.googleusercontent.com',
      'scope': 'email'
    })
      .then(() => {
        this.googleLoadSubject.next(true)
      })
  }

  googleSignup(route: string): void {
    return gapi.auth2.getAuthInstance().signIn().then((signedUsername) => {
      console.log("sfjsf",signedUsername)
      return this.http.post(`${this.BASE_URL}/googlesignup`, { access_token: signedUsername.Zi.access_token }, this.options)
        .takeUntil(this.ngUnsubscribe)
        .subscribe(
          res => {
            this.zone.run(() => {
              this.username = res.json();
              this.UserSubject.next(this.username)
              this.modalClose.next(false)
              if (this.modalId) this.modalService.close(this.modalId)
              this.router.navigate([`${route}`]);
            });
          },
          error => {
            this.zone.run(() => {
              this.errorRefactor(error);
            });
          }
        )
    }, (error) => {
      this.zone.run(() => {
        this.googleErrorSubject.next(error)
      });
    })
  }

  fbLogin(route: string): void {
    FB.login(res => {
      return this.http.post(`${this.BASE_URL}/fbsignup`, { access_token: res.authResponse.accessToken }, this.options)
        .takeUntil(this.ngUnsubscribe)
        .subscribe(
          res => this.signRefactor(res, route),
          error => this.errorRefactor(error),
      )
    }, { scope: 'email, public_profile' })
  }

  addressUpload(form: object) {
    return this.http.post(`${this.BASE_URL}/user/address`, form, this.options)
  }

  openModal(id: string): void {
    this.modalId = id
    this.modalService.open(this.modalId);
  }

  closeModal(id: string): void {
    if (this.modalId) {
      this.modalService.close(this.modalId);
      this.modalClose.next(false)
      return this.modalId = undefined
    }
  }

  signRefactor(res: Response, route: string): void {
    this.username = res.json();
    this.UserSubject.next(this.username)
    this.modalClose.next(false)
    if (this.modalId) this.modalService.close(this.modalId)
    if (this.username.role == 'ADMIN') {
      this.router.navigate(['/admin']);
    } else {
      this.router.navigate([`${route}`]);
    }
  }

  notsignRefactor(res: Response, route: string): void {
    // this.username = res.json();
    // this.UserSubject.next(this.username)
    this.modalClose.next(false)
    if (this.modalId) this.modalService.close(this.modalId)
    if (this.username.role == 'ADMIN') {
      this.router.navigate(['/admin']);
    } else {
      this.router.navigate([`${route}`]);
    }
  }

  errorRefactor(error: Response): void {
    this.errorSubject.next(error.json())
  }

  getGoogleLoadSubject(): Observable<boolean> {
    return this.googleLoadSubject.asObservable();
  }

  sendUserSubject(user: userInterface): void {
    this.UserSubject.next(user)
  }

  getUserSubject(): Observable<userInterface> {
    return this.UserSubject.asObservable();
  }

  getConfirmEmailMessage(): Observable<userInterface> {
    return this.UserSubject.asObservable();
  }

  getErrorSubject(): Observable<authErrorInterface> {
    return this.errorSubject.asObservable();
  }

  getModalClose(): Observable<boolean> {
    return this.modalClose.asObservable();
  }

  getGoogleErrorSubject(): Observable<any> {
    return this.googleErrorSubject.asObservable();
  }
}
