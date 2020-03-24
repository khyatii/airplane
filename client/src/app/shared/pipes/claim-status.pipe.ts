import { Pipe, PipeTransform } from '@angular/core';
import { TranslateService } from '../services/translate.service'

@Pipe({
  name: 'claimStatus'
})
export class ClaimStatusPipe implements PipeTransform {

  constructor(
    private translate: TranslateService
  ){}

  transform(value: string): string {
    switch (value) {
      case "Pending":
        return "Processing the claim.";
      case "ClaimCompany":
        return "Claiming to the airline.";
      case "PendingClaimAdmin":
        return "Administrative procedures, the waiting time lasts up to 4 months.";
      case "ClaimAdmin1":
        return "Administrative procedures, the waiting time lasts up to 4 months.";
      case "ClaimAdmin2":
        return "Seconds administrative procedures, the waiting time lasts up to a maximum of one month.";
      case "WaitingPayment1":
        return "Term of payment by the airline, the waiting time lasts up to a maximum of one month.";
      case "WaitingPayment2":
        return "Term of payment by the airline, the waiting time lasts up to a maximum of one month.";
      case "Court":
        return "Legal proceedings.";
      case "CourtPayment":
        return "Judicial order of payment in process.";
      case "PaymentReceived":
        return "Compensation paid.";
      case "PaymentDone":
        return "Compensation paid.";
      case "Rejected":
        return "Claim without right to compensation.";
      case "Abandoned":
        return "Abandoned.";
    }
  }

}
