import { CommonData } from '../bmfios-com-loan-application-view.module'

export class PreSanctionMemo {
    id;
    applicationId;
    unitSize;
    pan;
    udhyamRegNo;
    gstin;
    loanPurpose;
    cibilMsmeRank;
    dateOfRank;
    internalCreditRating;
    gradingOfProject;
    revenue;
    otherIncome;
    totalIncome;
    depreciation;
    netProfit;
    netWorth;
    securedLoans;
    unsecuredLoans;
    fixedAssets;
    creditors;
    stock;
    debtors;
    gstTotalMonths;
    gstTotalInvoiceValue;
    kycRiskCategorisation;
    unTerroristList;
    tncgsNoOfLoans;
    amountSanctioned;
    amountDisbursed;
    principalOutstanding;
    principalOverdue;
    interestOverdue;
    prOverdueOutstanding;
    enterpreneursMemorandum;
	buildingPlanApproval;
	tnpcbClearance;
    personalGuaranteesList = new Array<personalGuaranteesData>();
    repaymentScheduleDetailsList =  new Array<RepaymentScheduleDetails>();
    meansOfFinanceDetails =new meansOfFianceDetails();
    commonSanctionReportDataProxyList = new CommonData();
}

export class RepaymentScheduleDetails{
    id;
	applicationId;
	repaymentDate;
	repaymentAmout;
}
export class personalGuaranteesData{
    id;
    applicationId;
    nameOfGuarantor;
    guarantorResidentialAddress;
    guarantorOfficeAddress;
    guarantorGrossPayPerMonth;
    guarantorNetPayPerMonth;
    guarantorNetworth;
    isGuarantorProperty;
}
export class meansOfFianceDetails{
    id;
    applicationId;
    capitalValueBorrower;
    reservesValueBorrower;
    unsecuredLoansValueBorrower;
    promoterContributionPrValueBorrower;
    capitalValueBank;
    reservesValueBank;
    unsecuredLoansValueBank;
    promoterContributionPrValueBank;
    year;
}