import { DatePipe } from '@angular/common';
import * as _ from 'lodash';


export class CountsData {
    pendingCount: number;
    pendingPreSanctionCount: number;
    pendingSanctionedCount: number;
    preSanctionedCount: number;
    sanctionedCount: number;
    disbursedCount: number;
    onHoldCount: number;
    rejectedCount: number;
    dropdownList;
}

export class ProposalDetails {
    applicantName: string;
    email: string;
    mobile: number;
    status: string;
    statusId: number;
    fioName: string;
    lbmName: string;
    gmName: string;
    proposalDate;
    pendingWithId: number;
    pendingWith: string;
    disbursedDate;
    disbursedAmount: number;
    reason: string;
    rejectHoldDate;
}

export class SearchFilterJson {
    searchApplicantName;
    searchEmailOrMobile;
    statusId;
    searchFio;
    searchLbm;
    searchGm;
    proposalDate;
    pendingWithId;
    disbursedDate;
    disbursedAmount;
    reason;
    rejectHoldDate;
    statusList = [];
    pendingWithList = [];
}

export class DownLoadDataJson {
    searchFilterJson = new SearchFilterJson();
    constructor(private datePipe: DatePipe) { }

    public getJsonData(excelData, index, tabId, isBMLogin) {
        const data = {
            'Sr no': index,
            'Applicant Name': excelData.applicantName,
            'Email': excelData.email,
            'Mobile': excelData.mobile,
        };
        if (tabId == 2) {
            data['Pending With'] = excelData?.pendingWith;
            data['Status'] = excelData?.status;
            if(isBMLogin) {
                data['FIO Assigned'] = excelData.fioName;
                data['LBM Assigned'] = excelData.lbmName;
                data['GM Assigned'] = excelData.gmName;
            }
            data['Date of Proposal'] = excelData.proposalDate ? this.getFormatedDate(excelData.proposalDate) : undefined;
        } else if (tabId == 3) {
            data['Pending With'] = excelData?.pendingWith;
            data['Status'] = excelData?.status;
            data['FIO Assigned'] = excelData.fioName;
            data['Date of Proposal'] = excelData.proposalDate ? this.getFormatedDate(excelData.proposalDate) : undefined;
        } else if (tabId == 4) {
            if(isBMLogin) {
                data['FIO Assigned'] = excelData.fioName;
            }
            data['Date of Disbursed'] = excelData.disbursedDate ? this.getFormatedDate(excelData.disbursedDate) : undefined;
            data['Amount of Disbursed'] = excelData.disbursedAmount;
            data['Date of Proposal'] = excelData.proposalDate ? this.getFormatedDate(excelData.proposalDate) : undefined;
        } else if (tabId == 5) {
            if(isBMLogin) {
                data['FIO Assigned'] = excelData.fioName;
                data['LBM Assigned'] = excelData.lbmName;
                data['GM Assigned'] = excelData.gmName;
            }
            data['Reason'] = excelData.reason;
            data['Date of Hold'] = excelData.rejectHoldDate ? this.getFormatedDate(excelData.rejectHoldDate) : undefined;
        } else if (tabId == 6) {
            if(isBMLogin) {
                data['FIO Assigned'] = excelData.fioName;
                data['LBM Assigned'] = excelData.lbmName;
                data['GM Assigned'] = excelData.gmName;
            }
            data['Reason'] = excelData.reason;
            data['Date of Reject'] = excelData.rejectHoldDate ? this.getFormatedDate(excelData.rejectHoldDate) : undefined;
        } else if (tabId == 7) {
            if(isBMLogin) {
                data['FIO Assigned'] = excelData.fioName;
            }
            data['Status'] = excelData?.status;
            data['Date of Proposal'] = excelData.proposalDate ? this.getFormatedDate(excelData.proposalDate) : undefined;
        } else if (tabId == 8) {
            data['Status'] = excelData?.status;
            if(isBMLogin) {
                data['FIO Assigned'] = excelData.fioName;
                data['LBM Assigned'] = excelData.lbmName;
                data['GM Assigned'] = excelData.gmName;
            }
            data['Date of Proposal'] = excelData.proposalDate ? this.getFormatedDate(excelData.proposalDate) : undefined;
        } 
        return data;
    }

    getFormatedDate(date): any {
        return this.datePipe.transform(date, 'dd MMM yyyy');
        // if (date.toString().includes("-")) {
        //   const dateParts = date.split('-');
        //   const dateObj = new Date(+dateParts[2], dateParts[1] - 1, +dateParts[0]);
        // } else {
        //   return this.datePipe.transform(date, 'y-MM-dd');
        // }
    }
}

export class TitleChange {
    public static changeTitle(tabId) {
        let title = '';
        let subTitle = '';
        switch (tabId) {
            case 1:
                title = 'Pending Proposals';
                subTitle = 'Pending Proposals';
                break;
            case 2:
                title = 'Pre Sanction';
                subTitle = 'Pre Sanction';
                break;
            case 3:
                title = 'Sanctioned';
                subTitle = 'Sanctioned';
                break;
            case 4:
                title = 'Disbursed';
                subTitle = 'Disbursed';
                break;
            case 5:
                title = 'On-Hold';
                subTitle = 'On-Hold';
                break;
            case 6:
                title = 'Rejected';
                subTitle = 'Rejected';
                break;

            default:
                break;
        }

        return { title, subTitle };
    }
}