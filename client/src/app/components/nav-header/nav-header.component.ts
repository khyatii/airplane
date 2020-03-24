import { Component, OnInit, HostListener, OnDestroy, NgZone } from '@angular/core';
import { SessionService } from "../../shared/services/session.service"
import { ModalService } from '../../shared/services/modal.service';
import { userInterface } from '../../shared/interfaces/interfaces'
import { HeaderObservablesService } from '../../shared/services/header-observables.service';
import { ScrollEventService } from '../../shared/services/scroll-event.service';
import 'rxjs/add/operator/takeUntil';
import { Subject } from 'rxjs/Subject';
import { Router } from '@angular/router'

@Component({
  moduleId: module.id,
  selector: 'app-nav-header',
  templateUrl: './nav-header.component.html',
  styleUrls: ['./nav-header.component.sass']
})
export class NavHeaderComponent implements OnInit, OnDestroy {
  private ngUnsubscribe: Subject<void> = new Subject<void>();
  public username: userInterface;
  private loginComponent: boolean = false
  public buttonDisplay: boolean = false
  public finishButton : boolean = false
  public arrowUp: boolean;
  public mobile: boolean;

  constructor(
    private zone: NgZone,
    private modalService: ModalService,
    private session: SessionService,
    private header: HeaderObservablesService,
    private scroll: ScrollEventService,
    private router: Router
    ) {
  }

  ngOnInit(): void {
    this.windowWidth();

    this.session.getUserSubject()
      .takeUntil(this.ngUnsubscribe)
      .subscribe(user => {
        this.scroll.enableScroll();
        this.username = user
      })

    this.header.getButtonSubject()
      .takeUntil(this.ngUnsubscribe)
      .subscribe(boolean => {
          this.zone.run(() => {
            this.buttonDisplay = boolean;
          });
      })

    this.header.getFinishSubject()
      .takeUntil(this.ngUnsubscribe)
      .subscribe(boolean => this.finishButton = boolean)

    this.router.events
      .takeUntil(this.ngUnsubscribe)
      .subscribe((a: any) => {
        if(a.url !== '/claim') this.finishButton = false;
      })

    this.header.getOpenLogin()
    .takeUntil(this.ngUnsubscribe)
    .subscribe(boolean => {
      if(boolean) this.openModal('custom-modal-1')
    })

    this.header.getArrowUpSubject()
      .takeUntil(this.ngUnsubscribe)
      .subscribe(boolean => this.arrowUp = boolean)
  }

  ngOnDestroy(): void {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  logo(): void {
    window.innerWidth > 1019 ? this.router.navigate(['/']) : this.arrowUp = !this.arrowUp
  }

  @HostListener('window:resize', [''])
  windowWidth(): void {
    window.innerWidth > 1019 ? this.mobile = false : this.mobile = true
  }

  logout(): void {
    this.session.logout();
   }

  openModal(id: string): void {
    this.session.openModal(id);
    this.scroll.disableScroll();
  }

  closeModal(id: string): void {
    this.header.validate();
    this.session.closeModal(id);
    this.header.sendCleanLoginErrors(true)
    this.scroll.enableScroll();
  }

  finishClaim(): void {
    this.header.finishClaim(true);
  }

}
