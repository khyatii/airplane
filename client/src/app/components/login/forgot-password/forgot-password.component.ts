import { SessionService } from './../../../shared/services/session.service';
import { Component, Input, Output, EventEmitter, OnInit, OnDestroy } from '@angular/core';
import { HeaderObservablesService } from '../../../shared/services/header-observables.service';
import { Subject } from 'rxjs/Subject';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.sass']
})
export class ForgotPasswordComponent implements OnInit, OnDestroy {
  public invalidForm: boolean;
  public resendComponent: boolean = false
  public mailError: boolean;
  @Input() forgotPasswordComponent: boolean
  @Output() goBack = new EventEmitter<boolean>();
  private ngUnsubscribe: Subject<void> = new Subject<void>();
  public formInfo = {
    email: undefined
  }
  constructor(
    private header: HeaderObservablesService,
    private session: SessionService
  ) { }

  ngOnInit(): void {
    this.session.getModalClose()
      .takeUntil(this.ngUnsubscribe)
      .subscribe(success => this.resendComponent = success)

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
      localStorage.setItem("email", form.value.email)
      this.session.forgotPassword(form.value, '/forgotPassword').subscribe(res => {
        if (res) {
          this.resendComponent = !this.resendComponent
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
  showLogin(event): void {
    this.resendComponent = event
  }

  removeMailError(): void {
    this.invalidForm = false
    this.mailError = false
  }

  forgotPassword(): void {
    this.goBack.emit(false)
  }

}
