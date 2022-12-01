import { CommonData } from '../bmfios-com-loan-application-view.module';

export class PreScreening {
  id;
  applicationId;
  loanAmount;
  purposeOfLoan;
  applicationDate;
  kycCompilance;
  bmRemarks;
  cibilReport;
  lmRecommendation;
  gmRecommendation;
  commonSanctionReportDataProxy = new CommonData();
}
