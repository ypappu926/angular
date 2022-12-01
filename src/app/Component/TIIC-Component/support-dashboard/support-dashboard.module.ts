import { DatePipe } from "@angular/common";

export class SearchFilterJson {
    searchBorrowerName;
    searchMobileNo;
    searchAlternateMobileNo;
    searchCreatedDate;
    searchRemarks;
}

export class DownLoadDataJson {
    // searchFilterJson = new SearchFilterJson();
    constructor(private datePipe: DatePipe) { }

    public getJsonData(excelData, index) {
        const data = {
            'Sr no': index,
            'Borrower Name': excelData.borrowerName,
            'Register Mobile No': excelData.mobileNo,
            'Alt Mobile No': excelData.alternateMobileNo,
            'Created Date': this.getFormatedDate(excelData.createdDate),
            'Remarks': excelData.remarks,
        };
        return data;
    }

    getFormatedDate(date): any {
        return this.datePipe.transform(date, 'dd MMM yyyy');
    }

}