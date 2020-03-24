import { SessionService } from './../../../shared/services/session.service';
import { Subject } from 'rxjs/Subject';
import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-resend-recovery',
  templateUrl: './resend-recovery.component.html',
  styleUrls: ['./resend-recovery.component.sass']
})
export class ResendRecoveryComponent implements OnInit {

  private ngUnsubscribe: Subject<void> = new Subject<void>();
  @Input() resendComponent: boolean
  @Output() goBack = new EventEmitter<boolean>();
  email: any;
  myItem;

  constructor(private session: SessionService) { }

  ngOnInit() {
    this.myItem = localStorage.getItem('email');
  }

  sendLink() {
    this.email = { email: this.myItem }
    this.session.forgotPassword(this.email, '/forgotPassword').subscribe(res => {
      if (res) {
        this.resendComponent = !this.resendComponent
      }
    }, (err) => {
      if (err.status == "404") {
        return;
      }
      this.session.errorRefactor(err);
    })
  }

  ngOnDestroy(): void {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

}
