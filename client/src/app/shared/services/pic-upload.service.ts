import { Injectable } from '@angular/core';
import { environment }  from '../../../environments/environment';
import { FileUploader } from 'ng2-file-upload'

@Injectable()
export class PicUploadService {
  public idFront: FileUploader = new FileUploader({
    url: `${environment.BASE_URL}/user/idfront`
  });

  public idBack: FileUploader = new FileUploader({
    url: `${environment.BASE_URL}/user/idback`
  });

  public companyClaim: FileUploader = new FileUploader({
    url: `${environment.BASE_URL}/claim/companyclaim`
  });
  public reservationOrTicket: FileUploader = new FileUploader({
    url: `${environment.BASE_URL}/claim/reservationorticket`
  });
  public boardingPass: FileUploader = new FileUploader({
    url: `${environment.BASE_URL}/claim/boardingpass`
  });
  constructor() { }

}
