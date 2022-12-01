export class ApplicantDetailsModel {
    id;
    borrowerProposalId;
    nameOfUnit;
    constitution;
    dateOfEstablishment;
    sma;
    cif;
    pan;
    udyamRegistration;
    gstNo;
    natureOfBusiness;
    size;
    businessTypeId;
    created;
    isActive;
    registeredAddress = new AddressMasterModel();
    factoryAddressList = new Array<AddressMasterModel>();
    correspondenceAddress = new AddressMasterModel();
    promoterDetailsList = new Array<PromoterDetailsModel>();
    creditDetailsList = new Array<CreditDetailsModel>();;
    boId;
    typeOfIndustry;
    typeOfProduct;
    isNewAdded=false;
    boDetailsProxy = new BoDetailsProxy();
    isSelectExistingDetails=false;
    isSameAsRegisterFactoryAddress=false;
    registerCopyAddressId;
    correspondenceCopyAddressId;
    isSameAsFactoryAddress=false;
    otherConstitution;
    isSendToBo;
    userId;
    campOrgId;
    correspondenceCopyFrom;
}

export class AddressMasterModel {
    id;
    block;
    nameOfBuilding;
    streetName;
    pincode;
    districtId;
    blockId;
    stateId;
    cityId;
    email;
    website;
    phone;
    isPrimary;
}

export class PromoterDetailsModel {

    id;
    name;
    qualification;
    emailId;
    mobileNo;
    address;
    aadhaarNo;
    pan;
    dateOfBirth;
    networth;
}

export class CreditDetailsModel {
    id;
    mobileNo;
    emailId;
    loanAccNo;
    loanValue;
    sanctionDate;
    disbursementDate;
    ltv;
    outStandingAmount;
    overDuePrincipleAmount;
    overDueInterestAmount;
    typeOfCollateral;
    location;
    valueAtSanctionTime;
    currentValue;
    alreadyEncumbered;
    nameOfFinancialInstitution;
    isCollateral=false;
    minDDate;
}

export class BoDetailsModel{

    id;
    branchName;
    firstName;
    middleName;
    lastName;
    mobileNo;
    pincode;

}

export class BoDetailsProxy{
    id;
    officeName;
    firstName;
    middleName;
    lastName;
    emailId;
    mobileNo;
    createdDate;
    isActive;
    orgId;
    userId;
    zoEmailId;
    isSendCopy=false;

}
