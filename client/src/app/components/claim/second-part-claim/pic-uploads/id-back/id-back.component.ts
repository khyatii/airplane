import { Component, OnInit, OnDestroy } from '@angular/core';
import { SessionService } from '../../../../../shared/services/session.service'
import { PicUploadService } from '../../../../../shared/services/pic-upload.service'
import { userInterface } from '../../../../../shared/interfaces/interfaces'
import 'rxjs/add/operator/takeUntil';
import { Subject } from 'rxjs/Subject';

@Component({
  selector: 'app-id-back',
  templateUrl: './id-back.component.html',
  styleUrls: ['../id-uploads.sass']
})
export class IdBackComponent implements OnInit, OnDestroy {
  private ngUnsubscribe: Subject<void> = new Subject<void>();
  private username: userInterface;
  public uploadedPic: string;
  public notLoaded: boolean = false;

  constructor(
    private picService: PicUploadService,
    private session: SessionService,
  ) {
  }

  ngOnInit(): void {
    this.session.getUserSubject()
      .takeUntil(this.ngUnsubscribe)
      .subscribe(
        user => {
          this.username = user;
          if(user) if(user.hasOwnProperty('idBack')) this.uploadedPic = user.idBack.originalName
        }
      )
  }

  ngOnDestroy(): void {
    this.notLoaded = false;
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  upload(): void {
    this.notLoaded = true;
    this.picService.idBack.onBuildItemForm = (item, form) => {
      form.append('id', this.username._id);
    };
    this.picService.idBack.uploadAll();
    this.picService.idBack.onCompleteItem = (item:any, response:any, status:any, headers:any) => {
      this.uploadedPic = item.file.name;
      this.notLoaded = false;
    };
  }
}
