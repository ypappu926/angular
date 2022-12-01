import { CommonData } from "../bmfios-com-loan-application-view.module";

export class preSanction{
    id;
	applicationId;
	loanAmount;
	loanPurpose;
	productsManufactured;
	isUnitRunning;
	noOfShifts;
	noOfWorkingDays;
	technicalEmp;
	supervisoryEmp;
	skilledWorker;
	unSkilledWorker;
	adminWorker;
	totalEmployment;
	suitabilityOfLocation;
	infrastructureAvailability;
	managerialCapacity;
	financialCapability;
	applicantReputation;
	bmRemarks;
	isUdyamReg;
	displayIsUdyamReg
	isGst;
	displayIsGst;
	tnpcbClearance;
	tnpcbClearanceId;
	firmRegistration;
	others;
    commonSanctionReportDataProxy= new CommonData();
}

