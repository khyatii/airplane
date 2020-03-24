import { Router } from '@angular/router';
import { SessionService } from './../../../shared/services/session.service';
import { Component, Input, Output, EventEmitter, OnInit, OnDestroy } from '@angular/core';
import { HeaderObservablesService } from '../../../shared/services/header-observables.service';
import { Subject } from 'rxjs/Subject';

@Component({
  selector: 'app-resend-forgot-password',
  templateUrl: './resend-forgot-password.component.html',
  styleUrls: ['./resend-forgot-password.component.sass']
})
export class ResendForgotPasswordComponent implements OnInit, OnDestroy {
  public invalidForm: boolean;
  public mailError: boolean;
  private ngUnsubscribe: Subject<void> = new Subject<void>();
  public formInfo = {
    email: undefined
  }
  constructor(
    private header: HeaderObservablesService,
    private session: SessionService,
    private route: Router
  ) { }

  ngOnInit(): void {
    this.header.getCleanLoginErrors()
      .takeUntil(this.ngUnsubscribe)
      .subscribe(boolean => {
        if (boolean) {
          this.invalidForm = false;
        }
      })
    this.session.getErrorSubject()
      .takeUntil(this.ngUnsubscribe)
      .subscribe(error => {
        if (error) {
          if (error.message == 'Not Found') this.mailError = true;
        }
      })
  }

  ngOnDestroy(): void {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  sendLink(form): void {
    this.invalidForm = true
    if (form.form._status == 'VALID') {
      this.session.forgotPassword(form.value, '/forgotPassword').subscribe(res => {
        if (res) {
          this.route.navigate(['/home'])
        }
      }, (err) => {
        if (err.status == "404") {
          this.session.errorRefactor(err)
          return;
        }
        this.session.errorRefactor(err);
      })
    }


  }

  removeMailError(): void {
    this.invalidForm = false
    this.mailError = false
  }



}
