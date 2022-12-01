export interface Customers {
    Id: string;
    ProductName: string;
    ProductType: string;
    Version: string;
    LastModified: string;
}

export interface liveMonitors {
    Id: string;
    BorrowerName: string;
    ApplicationID: string;
    TotalDisbursedAmount: string;
    Sales: string;
    BankStatementCredit: string;
    Chequeissuedbounced: string;
    MarketValueOfEligibleStocks: string;
    MarketValueOfEligibleDebtors: string;
    Source: string;
    LastUpdatedOn: string;
    IconTrendingUp: string;
    IconTrendingDown: string;
    IconTrendingFlat: string;
}
export interface Disbursedthroughplatforms {
    Id: string;
    BorrowerName: string;
    ApplicationID: string;
    PAN: string;
    TypeOfFacility: string;
    Total_Disbursed: string;
    AmountTillNow: string;
    FirstDisbursement: string;
    LastDisbursement: string;
    BranchName: string;
    BranchCode: string;
    BranchCity: string;
    BranchState: string
}
export interface AddedBorrowersHistorys {
    Id: string;
    FileName: string;
    UploadedOn: string;
    SuccessfulEntries: string;
    FailedEntries: string;
    TotalEntries: string;
}

export interface RequestsFromBorrowers {
    Id: string;
    BorrowerName: string;
    PAN: string;
    EmailID: string;
    MobileNumber: string;
    TypeOfFacility: string;
    TotalDisbursedAmount: string;
    DateOfFirstDisbursement: string;
    BranchCode: string;
    DateOfRequest: string;
}

export interface RequestssentToBorrowers {
    Id: string;
    BorrowerName: string;
    ApplicationID: string;
    PAN: string;
    TypeOfFacility: string;
    TotalDisbursedAmount: string;
    BranchName: string;
    BranchCode: string;
    DateOfRequest: string;
}

export interface CustomerWiseBreakUps {
    Id: string,
    CustomerName: string,
    State: string,
    TaxableValue: string,
    InTaxableValue: string,
}

export interface MonitoringdownloadReportes {
    Id: string;
    FileName: string;
    Month: string;
    UpdateOn: string;
    Status: string;
}


export interface InPrincipleApplications {
    Id: string,
    OrganizationName: string,
    ApplicationCode: string,
    Email: string,
    Mobile: string,
    PAN: string,
    Status: string,
    InprincipleDate: string,
    Inprinciple: string,
}
export interface ProposalDetailsInPrinciples {
    ProductName: string,
    ProductStatus: string,
    TypeofLoan: string,
    ApplicationType: string,
    EMI: string,
    Tenure: string,
    ROI: string,
    Processingfee: string,
}

export interface ProposalStatusInPrinciples {
    HoldDate: string,
    SanctionDate: string,
    SanctionAmount: string,
    LastDisbursementsDate: string,
    LastDisbusementsAmount: string,
    TotalDisbusementsAmount: string,
    RejectedDateReason: string,
    HoldDateReason: string,
}

export interface BankUserDatas {
    Id: string,
    UserName: string,
    UserEmail: string,
    MobileNo: string,
    UserRole: string,
    City: string,
    State: string,
    Status: string  
}
export interface BranchDetailsInPrinciples {
    ZonalOffice: string,
    RegionalOffice: string,
    BranchName: string,
    BranchCode: string,
    BranchAddress: string,
    MakerEmailid: string,
    MakerMobileNo: string,
    CheckerEmailid: string,
    CheckerMobileNo: string,
}
export interface Constitutioncharttables {
    Id: string,
    Constitution: string,
    Amount: string,
    Applications: string,
}

export interface StateDatas {
    Id: string,
    StateName: string,
    Amount: string,
    Applications: string,
}


export interface SearchResult {
    tables: liveMonitors[];
    total: number;
}

export interface FoStatusDetails {
    consentInitiatedDate: string,
    consentReceivedDate: string,
    email: string,
    entityName: string,
    mobile: string,
    notificationStatus: string,
    status: string,
    totalCount: string,
    district: string,
    digitalSignatureStatus: string,
}