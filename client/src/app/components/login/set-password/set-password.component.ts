import { HeaderObservablesService } from './../../../shared/services/header-observables.service';
import { Router } from '@angular/router';
import { SessionService } from './../../../shared/services/session.service';
import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { Subject } from 'rxjs/Subject';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-set-password',
  templateUrl: './set-password.component.html',
  styleUrls: ['./set-password.component.sass']
})
export class SetPasswordComponent implements OnInit {
  id;
  value;
  public invalidForm: boolean;
  errorMsg: string;
  isError: boolean = true;
  @Input() forgotPasswordComponent: boolean
  @Output() goBack = new EventEmitter<boolean>();
  private ngUnsubscribe: Subject<void> = new Subject<void>();

  public formInfo = {
    password: undefined,
    confirmpassword: undefined
  }
  constructor(
    private session: SessionService,
    private router: ActivatedRoute,
    private route: Router,
    private header: HeaderObservablesService,
  ) { }

  ngOnInit(): void {
    this.header.getValidateSubject()
      .takeUntil(this.ngUnsubscribe)
      .subscribe(boolean => this.invalidForm = boolean)

    if (this.router.snapshot.queryParams['link'] != undefined) {
      this.value = { id: this.router.snapshot.queryParams['link'] }
    }

    this.session.checkTokenExpire(this.value, '/setPassword/' + this.value.id).subscribe(res => {
      if (res) { }
    }, (err) => {
      if (err.status == "404") {
        this.errorMsg = "Password reset token is invalid or has expired.";
        this.showError();
        return;
      } else {
        this.errorMsg = "Some Error Occured";
        this.showError();
      }
    })
  }

  updatePassword(form) {
    this.invalidForm = true
    if (form.form._status == 'VALID') {
      form.value.id = this.value.id;
      this.session.setPassword(form.value, '/setPassword/' + form.value.id).subscribe(res => {
        if (res) {
          this.session.signRefactor(res, '/user');
        }
      }, (err) => {
        if (err.status == "404") {
          this.errorMsg = "Password reset token is invalid or has expired.";
          this.showError();
          this.route.navigate(['/forgotPassword'])
        } else {
          this.errorMsg = "Some Error Occured";
          this.showError();
        }
      })
    }
  }

  ngOnDestroy(): void {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }
  showError() {
    window.scrollTo(500, 0);
    this.isError = false;
    
  }

}
