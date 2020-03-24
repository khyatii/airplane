import { Component } from '@angular/core';
import { ClaimFormService } from '../../../shared/services/claim-form.service'

@Component({
  selector: 'app-checkbox',
  templateUrl: './checkbox.component.html',
  styleUrls: ['./checkbox.component.sass']
})
export class CheckboxComponent {
  private accepted: boolean = false;
  constructor(
    private claimService: ClaimFormService
  ) { }

  emit(): void {
    this.accepted = !this.accepted
    this.claimService.sendCheckBox(this.accepted)

  }

}
