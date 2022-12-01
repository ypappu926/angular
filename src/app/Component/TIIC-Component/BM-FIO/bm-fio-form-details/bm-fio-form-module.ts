import { AddressMasterModel } from 'src/app/Component/TIIC-Component/Ho-Bo/ho-bo-datafields/ho-bo-datafields-model';
export class ApplicantDetals {
    applicantDetailsProxy = new ApplicantDetailsProxy();
    businessDetailsProxy = new BusinessDetailsProxy();
    assetDetailsProxies = new Array<AssetDetailsProxy>();
    majorCustomerDetailsProxies = new Array<MajorCustomerDetailsProxy>();
    rawMaterialProxies = new Array<RawMaterialProxy>();

}

export class ApplicantDetailsProxy {
    id;
    borrowerProposalId;
    nameOfUnit;
    constitution;
    dateOfEstablishment;
    isActive;
    typeOfIndustry;
    typeOfProduct;
    otherConstitution;
    campOrgId;
    registeredAddress = new AddressMasterModel();
    factoryAddressList = new Array<AddressMasterModel>();
    correspondenceAddress = new AddressMasterModel();
    promoterDetailsList = new Array<PromoterDetailsProxy>();
    isSameAsFactoryAddress;
    isSameAsRegisterFactoryAddress;
}

// export class AddressMasterProxy {
//     id;
//     address;
//     cityOrTown;
//     pincode;
//     email;
//     website;
//     phoneNo;
//     isPrimary;
// }

export class PromoterDetailsProxy {
    id;
    name;
    qualification;
    emailId;
    mobileNo;
    address;
    aadhaarNo;
    pan;
    dateOfBirth;
    sector;
    networth;
    age;
}

export class BusinessDetailsProxy {
    constructor() { }
    id;
    unitRunning;
    borrowerProposalId;
    facilitiesAdequate;
    production;
    totalAssets;
    sanctionedLoad;
    connectedLoad;
    scNo;
    connectionDate;
    existingRequirement;
    waterAdequate;
    source;
    admin: Number;
    skilled: Number;
    unskilled: Number;
    labourTechnicalTotal: Number;
    inspectedBy;
    dateOfInspection;
    inspectionRemarks;
    noOfShifts;
    noOfWorkingDays;
    negativeReason;
    inspectionRemarksBm;
    dateOfInspectionBm;
    inspectedByBm;
    rejectReason;
    statusId;
    buttonStatusId;
    reason;
    proposalMappingId;
    statusName;
    branchName;
}

export class AssetDetailsProxy {
    constructor() { }
    id;
    borrowerProposalId;
    description;
    amount;
}

export class MajorCustomerDetailsProxy {
    constructor() { }
    id;
    borrowerProposalId;
    name;
    yearlySales;
}

export class RawMaterialProxy {
    constructor() { }
    id;
    borrowerProposalId;
    description;
    difficultyProcurement;
}