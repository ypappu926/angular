import { FactoryAddrress } from "../bmfios-com-loan-application-view.module";

export class SanctionDetails {
    id;
    applicationId;
    amountSanctionedLoan;
    dateOfSanction;
    noOfInstallment;
    totalLoanAmount;
    monthlyPrincipalRepayment;
    rateOfIntrest;
    moratoriumPeriod;
    location;
    collateralExtent;
    collateralOwnedBy;
    unitName;
    registeredOfficeAddress;
    factoryAddress = new Array<FactoryAddrress>();
}