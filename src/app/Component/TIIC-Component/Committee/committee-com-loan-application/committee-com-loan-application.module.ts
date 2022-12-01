import { DatePipe } from '@angular/common';
import * as _ from 'lodash';


export class CountsData {
    meetingCount: number;
    pendingCount: number;
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
    bmName: string;
    meetingDate: string;
    status: string;
    statusId: number;
    proposalDate;
    sanctionedDate;
    disbursedDate;
    disbursedAmount: number;
    reason: string;
    rejectHoldDate;
}

export class SearchFilterJson {
    searchApplicantName;
    searchEmailOrMobile;
    searchbm;
    meetingDate;
    proposalDate;
    statusId;
    sanctionedDate;
    disbursedDate;
    disbursedAmount;
    reason;
    rejectHoldDate;
    statusList = [];
}

export class DownLoadDataJson {
    searchFilterJson = new SearchFilterJson();
    constructor(private datePipe: DatePipe) {}

    public getJsonData(excelData, index, tabId, isBMLogin) {
        const data = {
            'Sr no': index,
            'Applicant Name': excelData.applicantName,
            'Email': excelData.email,
            'Mobile': excelData.mobile,
            'BM Assigned': excelData.bmName
        };
        if (tabId == 1) {
            data['Meeting Details'] = excelData.meetingDate ? this.getFormatedDate(excelData.meetingDate) :  '';
            data['Date of Proposal'] = excelData.proposalDate ? this.getFormatedDate(excelData.proposalDate) :  '';
        } else if (tabId == 2) {
            data['Status'] = excelData.status || '';
            data['Date of Proposal'] = excelData.proposalDate ? this.getFormatedDate(excelData.proposalDate) :  '';
        } else if (tabId == 3) {
            data['Status'] = excelData.status || '';
            data['Date of Proposal'] = excelData.proposalDate ? this.getFormatedDate(excelData.proposalDate) :  '';
            data['Date of Sanction'] = excelData.sanctionedDate ? this.getFormatedDate(excelData.sanctionedDate) :  '';
        } else if (tabId == 4) {
            data['Date of Disbursed'] = excelData.disbursedDate ? this.getFormatedDate(excelData.disbursedDate) :  '';
            data['Amount of Disbursed'] = excelData.disbursedAmount;
            data['Date of Proposal'] = excelData.proposalDate ? this.getFormatedDate(excelData.proposalDate) :  '';
        } else if (tabId == 5) {
            data['Reason'] = excelData.reason;
            data['Date of Hold'] = excelData.rejectHoldDate ? this.getFormatedDate(excelData.rejectHoldDate) :  '';
        } else if (tabId == 6) {
            data['Reason'] = excelData.reason;
            data['Date of Reject'] = excelData.rejectHoldDate ? this.getFormatedDate(excelData.rejectHoldDate) :  '';
        }
        return data;
    }

    getFormatedDate(date): any {
        return this.datePipe.transform(date, 'dd MMM yyyy');
      }
}

export class TitleChange {
    public static changeTitle(tabId) {
        let title = '';
        let subTitle = '';
        switch (tabId) {
            case 1:
                title = 'Scheduled Meeting';
                subTitle = 'Scheduled Meeting';
                break;
            case 2:
                title = 'Pending Proposals';
                subTitle = 'Pending Proposals';
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