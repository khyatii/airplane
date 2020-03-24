import { Component, OnInit, OnDestroy } from '@angular/core';
import { ClaimFormService } from '../../../../../shared/services/claim-form.service'
import { PicUploadService } from '../../../../../shared/services/pic-upload.service'
import { claimInterface } from '../../../../../shared/interfaces/interfaces'
import 'rxjs/add/operator/takeUntil';
import { Subject } from 'rxjs/Subject';

@Component({
  selector: 'app-boarding-pass',
  templateUrl: './boarding-pass.component.html',
  styleUrls: ['../flight-uploads.sass']
})
export class BoardingPassComponent implements OnInit, OnDestroy {
  private ngUnsubscribe: Subject<void> = new Subject<void>();
  private claim: claimInterface;
  public uploadedPic: string;
  public notLoaded: boolean = false;

  constructor(
    private picService: PicUploadService,
    private claimService: ClaimFormService,
  ) { }

  ngOnInit(): void {
    this.claimService.getClaimSubject()
    .takeUntil(this.ngUnsubscribe)
    .subscribe(
      claim => {
        this.claim = claim;
        if(this.claim)
          this.claimService.findById(this.claim._id)
                  .takeUntil(this.ngUnsubscribe)
                  .subscribe(res => {
                    this.claim = res.json()
                    if(this.claim.hasOwnProperty('boardingPass')) this.uploadedPic = this.claim.boardingPass.originalName;
                  });
      }
    );

    this.claimService.getClaimIdSubject()
      .takeUntil(this.ngUnsubscribe)
      .subscribe( (id: string) => {
        if(id) this.claimService.findById(id)
                .takeUntil(this.ngUnsubscribe)
                .subscribe(res => {
                  this.claim = res.json()
                  if(this.claim.hasOwnProperty('boardingPass')) this.uploadedPic = this.claim.boardingPass.originalName;
                });
      })
  }

  ngOnDestroy(): void {
    this.notLoaded = false;
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  upload(): void {
    this.notLoaded = true;
    this.picService.boardingPass.onBuildItemForm = (item, form) => {
      form.append('id', this.claim._id);
    };
    this.picService.boardingPass.uploadAll();
    this.picService.boardingPass.onCompleteItem = (item:any, response:any, status:any, headers:any) => {
      this.uploadedPic = item.file.name;
      this.notLoaded = false;
      if(this.uploadedPic) this.claimService.sendPicError(false)
    };
  }
}
