import { Component, Input, Output, EventEmitter, OnInit, NgZone } from '@angular/core';
import { SessionService } from "../../../shared/services/session.service"
import { HeaderObservablesService } from '../../../shared/services/header-observables.service';
import { RouterModule, Router, Routes } from "@angular/router";
import 'rxjs/add/operator/takeUntil';
import { Subject } from 'rxjs/Subject';
///<reference path="../../../typings/gapi.auth2/gapi.auth2.d.ts" />

declare const gapi: any;

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.sass']
})
export class RegisterComponent implements OnInit {
  private ngUnsubscribe: Subject<void> = new Subject<void>();
  @Input() registerComponent: boolean
  @Output() goBack = new EventEmitter<boolean>();
  private register: string
  public formInfo = {
    firstName: undefined,
    email: undefined,
    password: undefined
  }
  private loading: boolean = false
  public trick: boolean = false

  public invalidForm: boolean;
  public mailError: boolean;

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
    this.header.getValidateSubject()
      .takeUntil(this.ngUnsubscribe)
      .subscribe(boolean => this.invalidForm = boolean)

    this.session.getGoogleLoadSubject()
      .takeUntil(this.ngUnsubscribe)
      .subscribe(boolean => this.loading = boolean)

    this.session.getErrorSubject()
      .takeUntil(this.ngUnsubscribe)
      .subscribe(error => {
        if (error) {
          if (error.message == 'This e-mail already exists') this.mailError = true;
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
    } else this.incognitoString = undefined
  }

  incognitoNull(): void {
    this.incognitoString = undefined
  }

  removeMailError(): void {
    this.mailError = false
  }

  signup(form: any): void {
    this.invalidForm = true
    if (form.form._status == 'VALID') {
      if (this.router.url !== '/claim') {
        this.session.signup(form.value, '/user').subscribe(res => {
          if (res) {
            if (res.status == 200) {
              // this.session.notsignRefactor(res, '/user')
              this.session.signRefactor(res, '/user')
            }
          }
        }, (err) => {
          if (err.status == "404") {
            this.session.errorRefactor(err)
            return;
          }
          this.session.errorRefactor(err)
        })
      }
      else this.session.signup(form.value, this.router.url).subscribe(res => {
        if (res.status == 200) {
          this.session.signRefactor(res, '/user')
        }
      }, (err) => {
        if (err.status == "404") {
          this.session.errorRefactor(err)
          return;
        }
        this.session.errorRefactor(err)
      })
    }
  }

  registerClick(): void {
    this.goBack.emit(false)
  }

  fbRegister(): void {
    if (this.router.url !== '/claim') this.session.fbLogin('/user')
    else this.session.fbLogin(this.router.url);
  }

  googleRegister(): void {
    this.googleError = true
    this.trick = true
    if (this.loading && !this.incognitoString) {
      if (this.router.url !== '/claim') this.session.googleSignup('/user')
      else this.session.googleSignup(this.router.url);
    }
  }

}
