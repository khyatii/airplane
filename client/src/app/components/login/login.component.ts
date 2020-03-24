import { Component, OnInit, OnDestroy, Input, NgZone } from '@angular/core';
import { SessionService } from "../../shared/services/session.service"
import { HeaderObservablesService } from '../../shared/services/header-observables.service';
import { RouterModule, Router, Routes } from "@angular/router";
import 'rxjs/add/operator/takeUntil';
import { Subject } from 'rxjs/Subject';
///<reference path="../../../typings/gapi.auth2/gapi.auth2.d.ts" />

declare const gapi: any;

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.sass'],
})

export class LoginComponent implements OnInit, OnDestroy {
  @Input() scrollToTop: boolean;
  private ngUnsubscribe: Subject<void> = new Subject<void>();
  public registerComponent: boolean = false
  public forgotPasswordComponent: boolean = false
  private formInfo = {
    email: undefined,
    password: undefined
  }
  private loading: boolean = false
  public trick: boolean = false

  private invalidForm: boolean;
  public mailError: boolean;
  private passwordError: boolean;

  public incognitoString: string;
  public googleError: boolean = false;

  public socialGoogleErrorString: string;
  public socialGoogleError: boolean = false;
  public socialFBErrorString: string;
  public socialFBError: boolean = false;

  constructor(
    private zone: NgZone,
    private session: SessionService,
    private header: HeaderObservablesService,
    private router: Router,
  ) {
  }

  ngOnInit(): void {
    if (this.scrollToTop) {
      window.scrollTo(0, 0);
    }

    this.header.getValidateSubject()
      .takeUntil(this.ngUnsubscribe)
      .subscribe(boolean => this.invalidForm = boolean)

    this.session.getModalClose()
      .takeUntil(this.ngUnsubscribe)
      .subscribe(success => this.registerComponent = success)

    this.session.getModalClose()
      .takeUntil(this.ngUnsubscribe)
      .subscribe(success => this.forgotPasswordComponent = success)

    this.session.getGoogleLoadSubject()
      .takeUntil(this.ngUnsubscribe)
      .subscribe(boolean => this.loading = boolean)

    this.session.getErrorSubject()
      .takeUntil(this.ngUnsubscribe)
      .subscribe(error => {
        if (error) {
          if (error.message == 'Unauthorised User') this.mailError = true;
          else if (error.message == 'Incorrect Password') this.passwordError = true;
          else if (error.message == 'E-mail, google login, already exists') {
            this.socialGoogleError = true;
            this.socialGoogleErrorString = "Ya existe una cuenta con esta dirección de correo electrónico proporcionada por Google"
          }
          else if (error.message == 'E-mail, fb login, already exists') {
            this.zone.run(() => {
              this.socialFBError = true;
              this.socialFBErrorString = "Ya existe una cuenta con esta dirección de correo electrónico proporcionada por Facebook";
            })
          }
        }
      })

    this.header.getCleanLoginErrors()
      .takeUntil(this.ngUnsubscribe)
      .subscribe(boolean => {
        if (boolean) {
          this.invalidForm = false;
          this.socialGoogleError = false;
          this.socialFBError = false;
          this.googleError = false;
        }
      })

    this.session.getGoogleErrorSubject()
      .takeUntil(this.ngUnsubscribe)
      .subscribe(error => {
        if (error) {
          if (error.error === "popup_closed_by_user") {
            let fs = window.RequestFileSystem || window.webkitRequestFileSystem;
            if (!fs) {
            } else fs(window.TEMPORARY,
              100,
              () => this.incognitoNull(),
              () => this.incognitoError()
            )
          }
        }
      })

  }

  ngOnDestroy(): void {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  incognitoError(): void {
    let isChrome = !!window.chrome && !!window.chrome.webstore;
    if (isChrome) {
      this.zone.run(() => {
        this.incognitoString = "Disabilita el modo incógnito para iniciar sesión con Google";
      })
    }
    else this.incognitoString = undefined
  }

  incognitoNull(): void {
    this.incognitoString = undefined
  }

  removeMailError(): void {
    this.mailError = false
  }

  removePasswordError(): void {
    this.passwordError = false
  }

  login(form: any): void {
    this.invalidForm = true
    if (form.form._status == 'VALID') {
      if (this.router.url !== '/claim') {
        this.session.login(this.formInfo, '/user').subscribe(res => {
          if (res) {
            this.session.signRefactor(res, '/user')
          }
        }, (err) => {
          if (err.status == "401") {
            this.session.errorRefactor(err)
            return;
          }
          this.session.errorRefactor(err)
        })
      }
      else {
        this.session.login(this.formInfo, this.router.url).subscribe(res => {
          if (res) {
            this.session.signRefactor(res, this.router.url)
          }
        }, (err) => {

          if (err.status == "401") {
            this.session.errorRefactor(err)
            return;
          }
          this.session.errorRefactor(err)
        })
      }
    }
  }

  registerClick(): void {
    this.registerComponent = !this.registerComponent
  }

  forgotPassword(): void {
    this.forgotPasswordComponent = !this.forgotPasswordComponent
  }

  showLogin(event): void {
    this.registerComponent = event
    this.forgotPasswordComponent = event
  }

  fbLogin(): void {
    if (this.router.url !== '/claim') this.session.fbLogin('/user')
    else this.session.fbLogin(this.router.url);
  }

  googleLogin(): void {
    this.googleError = true
    //remove to true
    this.trick = false
    if (this.loading && !this.incognitoString) {
      if (this.router.url !== '/claim') this.session.googleSignup('/user')
      else this.session.googleSignup(this.router.url);
    }
  }

}
