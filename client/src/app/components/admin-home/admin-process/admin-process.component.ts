import { Component, Input } from '@angular/core';
import { AdminFnService } from "../../../shared/services/admin-fn.service"

@Component({
  selector: 'app-admin-process',
  templateUrl: './admin-process.component.html',
  styleUrls: ['./admin-process.component.sass'],
})
export class AdminProcessComponent {
  @Input() claimProcess: any;
  public message: string;
  public deletePassword: string;

  constructor(
    private admin: AdminFnService,
  ) {
  }

  deleteClaim(id: string, deletePassword: string): void {
    this.admin.deleteClaim({id, deletePassword})
      .subscribe(res => {
        if(res.json()._id === id) this.message = "Borrado";
      }, err => {
        if(err.json().message === 'Incorrect password to delete this document') this.message = "Incorrect password to delete this document";
      })
  }

}
