import { Component, OnInit, OnDestroy } from '@angular/core';
import { AdminFnService } from "../../shared/services/admin-fn.service"
import { claimInterface } from "../../shared/interfaces/interfaces"
import 'rxjs/add/operator/takeUntil';
import { Subject } from 'rxjs/Subject';

@Component({
  selector: 'app-admin-home',
  templateUrl: './admin-home.component.html',
  styleUrls: ['./admin-home.component.sass']
})
export class AdminHomeComponent implements OnInit, OnDestroy {
  private ngUnsubscribe: Subject<void> = new Subject<void>();
  //pending to change typing
  public Pending: Array<claimInterface> = [];
  public ClaimCompany: Array<claimInterface> = [];
  public PendingClaimAdmin: Array<claimInterface> = [];
  public ClaimAdmin1: Array<claimInterface> = [];
  public ClaimAdmin2: Array<claimInterface> = [];
  public WaitingPayment1: Array<claimInterface> = [];
  public WaitingPayment2: Array<claimInterface> = [];
  public Court: Array<claimInterface> = [];
  public CourtPayment: Array<claimInterface> = [];
  public PaymentReceived: Array<claimInterface> = [];
  public PaymentDone: Array<claimInterface> = [];
  public Rejected: Array<claimInterface> = [];
  public Abandoned: Array<claimInterface> = [];

  private claimId: string;
  private statusForm: object;
  private list: Array<claimInterface>;

  constructor(
    private adminService: AdminFnService
  ) {}

  ngOnInit(): void {
    this.getAllClaims();
  }

  getAllClaims(): void {
    this.adminService.list()
    .takeUntil(this.ngUnsubscribe)
    .subscribe(claims => {
      this.Pending = [];
      this.ClaimCompany = [];
      this.PendingClaimAdmin = [];
      this.ClaimAdmin1 = [];
      this.ClaimAdmin2 = [];
      this.WaitingPayment1 = [];
      this.WaitingPayment2  = [];
      this.Court = [];
      this.CourtPayment = [];
      this.PaymentReceived = [];
      this.PaymentDone = [];
      this.Rejected = [];
      this.Abandoned = [];
      this.list = claims;
      this.filterLists(claims)
    })
  }

  ngOnDestroy(): void {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  filterLists(list: Array<claimInterface>): void {
    list.forEach((e) => {
      switch (e.status) {
        case "Pending":
          this.Pending.push(e)
          break;
        case "ClaimCompany":
          this.ClaimCompany.push(e)
          break;
        case "PendingClaimAdmin":
          this.PendingClaimAdmin.push(e)
          break;
        case "ClaimAdmin1":
          this.ClaimAdmin1.push(e)
          break;
        case "ClaimAdmin2":
          this.ClaimAdmin2.push(e)
          break;
        case "WaitingPayment1":
          this.WaitingPayment1.push(e)
          break;
        case "WaitingPayment2":
          this.WaitingPayment2.push(e)
          break;
        case "Court":
          this.Court.push(e)
          break;
        case "CourtPayment":
          this.CourtPayment.push(e)
          break;
        case "PaymentReceived":
          this.PaymentReceived.push(e)
          break;
        case "PaymentDone":
          this.PaymentDone.push(e)
          break;
        case "Rejected":
          this.Rejected.push(e)
          break;
        case "Abandoned":
          this.Abandoned.push(e)
          break;
      }
    })
  }

  updateStatus(claimId: string, event: any): void {
    this.statusForm = { claimId, status: event.target.value }
    this.adminService.updateStatus(this.statusForm)
      .takeUntil(this.ngUnsubscribe)
      .subscribe(response => this.getAllClaims())
  }

}
