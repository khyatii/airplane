import { CanActivate } from '@angular/router';
import { Injectable, OnDestroy }  from '@angular/core';
import { Observable }  from 'rxjs/Rx';
import { SessionService } from './session.service'
import { ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { userInterface } from '../../shared/interfaces/interfaces'
import 'rxjs/add/operator/takeUntil';
import { Subject } from 'rxjs/Subject';

@Injectable()
export class EnsureLoggedInService implements CanActivate, OnDestroy {
  private ngUnsubscribe: Subject<void> = new Subject<void>();
  private username: userInterface;
  constructor(
    private session: SessionService,
  ) {
    this.session.getUserSubject()
      .takeUntil(this.ngUnsubscribe)
      .subscribe(
        user => this.username = user
      )
  }
  
  ngOnDestroy(): void {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot):Observable<boolean>|Promise<boolean>|boolean {
    if(this.username) return true
    else return false
  }
}
