import { DatePipe } from "@angular/common";

export class SearchFilterJson {
      paginationFrom;
      paginationTO;
      searchEmail;
      searchMobile;
      searchName;
      searchBankName;
      searchStatus;
      consentInitiatedFromDate;
}

export class DownLoadDataJson {
    // searchFilterJson = new SearchFilterJson();
    constructor(private datePipe: DatePipe) { }

    public getJsonData(excelData, index) {
        const data = {
            'Sr no': index,
            'Name Of Unit': excelData.entityName,
            'Email Id': excelData.email,
            'Mobile No': excelData.mobile,
            'Status': excelData.statusName,
            'Name Of Bank': excelData.bankName,
            'Consent initiated Date': this.getFormatedDate(excelData.consentInitiatedDate),
        };
        return data;
    }

    getFormatedDate(date): any {
        return this.datePipe.transform(date, 'dd MMM yyyy');
    }

}