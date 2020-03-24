import { HeaderObservablesService } from './../../../shared/services/header-observables.service';
import { SessionService } from './../../../shared/services/session.service';
import { Component, OnInit } from '@angular/core';
import { Subject } from 'rxjs/Subject';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-confirm-login',
  templateUrl: './confirm-login.component.html',
  styleUrls: ['./confirm-login.component.sass']
})
export class ConfirmLoginComponent implements OnInit {
  id;
  public invalidForm: boolean;
  errorMsg: string;
  isError: boolean = true;
  value: any;
  private ngUnsubscribe: Subject<void> = new Subject<void>();

  public formInfo = {
    password: undefined,
    confirmpassword: undefined
  }
  constructor(
    private session: SessionService,
    private router: ActivatedRoute,
    private header: HeaderObservablesService,
    private route:Router
  ) { }

  ngOnInit(): void {

    this.header.getValidateSubject()
      .takeUntil(this.ngUnsubscribe)
      .subscribe(boolean => this.invalidForm = boolean)

    if (this.router.snapshot.queryParams['link'] != undefined) {
      this.value = { id: this.router.snapshot.queryParams['link'] }
    }

    this.session.checkTokenExpireLogin(this.value, '/confirmLogin/' + this.value.id).subscribe(res => {
      if (res) {
        this.session.signRefactor(res, '/user')
       }
    }, (err) => {
      if (err.status == "404") {
        this.route.navigate(['/home'])
        // this.errorMsg = "Email token is invalid or has expired";
        // this.showError();
        return;
      } else {
        this.route.navigate(['/home'])
        // this.errorMsg = "Some Error Occured";
        // this.showError();
      }
    })
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
