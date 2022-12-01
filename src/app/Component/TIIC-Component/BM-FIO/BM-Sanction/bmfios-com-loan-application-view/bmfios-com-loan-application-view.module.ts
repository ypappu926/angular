export class CommonData {
    id :number;
    applicationId: number;
    unitName;
    registeredOfficeAddress;
    correspondenceAddress;
    constitution;
    constitutionId;
    typeOfIndustry;
    typeOfIndustryId;
    typeOfProductId;
    typeOfProduct;
    inspectedBy;
    enquiryDate;
    establishmentDate;
    sanctionedLoad;
    connectedLoad;
    scNo;
    connectionDate;
    existingRequirement;
    whetherAdequate;
    source;
    factoryAddress=new Array<FactoryAddrress>();
	partnerList = new Array<partnerData>(); 
    majorCustomers = new Array<majorCustomerData>();
	rawMaterialDetails = new Array<RawMaterialData>();
    landDetails = new Array<landData>();
	buildingDetails = new Array<buildingData>();
    plantDetails = new Array<plantData>();
	otherAssetDetails = new Array<otherAssets>();
    existingLoansDetails = new Array<ExistingLoanData>();
    collateralList = new Array<collateralData>();
    appProdMatchesDataResponses = new Array<appProdMatchesData>();
}
export class FactoryAddrress{
    id :number;
    applicationId: number;
    factoryAddress;
}
export class partnerData{	
    id;
	applicationId;
	partnerId;
	name;
	address;
    bureauScore;
    dateOfBureauScore;
	academicDetails = new Array<academicDetails>();
}
export class academicDetails{
    id;
    partnerId;
    applicationId;
    nameOfCollege;
    qualification;
    yearOfPassing;
}

export class majorCustomerData{
    id :number;
    applicationId: number;
	name;
    yearlySales;
}

export class RawMaterialData{
    id :number;
    applicationId: number;
    description;
    procurementDifficulty;
}

export class landData{
    id;	
    applicationId;
    description;
    purchaseCost;
    percentOwnership;
    village;
    subRegistrarOffice;
    guidelineValue;
    marketValue;
    hypothecated;
}
export class buildingData{
	id;
	applicationId;
	description;
	typeOfRoof;
	plinthArea;
	costOfConstruction;
	remarks;
	hypothecated;
}
export class plantData{
    id;
	applicationId;
	description;
	yearOfPurchase;
	purchaseValue;
	currentValue;
	underCharge;
	remarks;
}
export class otherAssets{
    id;
	applicationId;
	description;
	yearOfPurchase;
	purchaseValue;
	currentValue;
	underCharge;
	remarks;
}
export class ExistingLoanData{
    id :number;
    userId;
    applicationId: number;
	nameOfLender;
    sanctionDate;
    sanctionDisplayDate;
	sanctionedLoanAmt;
	outstandingDate;
	outstandingDisplayDate;
	outstandingPrincipalAmt;
	outstandingInterestAmt;
	interestPrincipalAmt;
	isSecured;
	loanType;
	collateralAmt;
}

export class collateralData{
    id;
    applicationId;
    location;
    typeOfPropertyId;
    otherTypeOfProperty; 
    guideLineValue;
    marketValue;
    nameOfOwner;
    isEncumbered;
    isPropertyEncumbered;
    typeOfPropertyName;
    encumberedName;
}
export class sanctionReportStatus{
    applicationId;
    preScreeningStatus = false;
    preSanctionStatus = false;
    bankSanctionStatus = false;
    branchManagerRemarks = false;
    sanctionLetter = false;
}
export class appProdMatchesData{
    id;
    applicationId;
    proposalId;
    fpProductId;
    paramterId;
    parameterName;
    isMatched;
    fsValue;
    fpValue;
    modifiedDate;
    createdDate;
    isActive;
    isCoApplicant;
    isMandatory;
    isSet;
    paramterType;
    isConsider;
    public
}