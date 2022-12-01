import { DatePipe } from '@angular/common';
import { Component, HostListener, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import alasql from 'alasql';
import * as _ from 'lodash';
import { CommonMethods } from 'src/app/CommoUtils/common-services/common-methods';
import { CommonService } from 'src/app/CommoUtils/common-services/common.service';
import { SendSuccessfullyLinkPopupComponent } from 'src/app/Popup/send-successfully-link-popup/send-successfully-link-popup.component';
import { TnService } from 'src/app/services/tn.service';
import { DownLoadDataJson, SearchFilterJson } from './sa-consent-link-resend.module';
@Component({
  selector: 'app-sa-consent-link-resend',
  templateUrl: './sa-consent-link-resend.component.html',
  styleUrls: ['./sa-consent-link-resend.component.scss']
})
export class SAConsentLinkResendComponent implements OnInit {

  breadCrumbItems: Array<{}>;
  tab: number;
  totalCount = 0;
  startIndex = 0;
  pageSize = 10;
  page = 1;
  typeId: any;
  selectValue: any;
  applicationList: any = [];
  pageSelectNumber: number[];
  searchFilterJson = new SearchFilterJson();
  checked: any = [];
  debounceEventForFilter = _.debounce(() => this.getStatusForSA(), 500, {});

  constructor(private commonService: CommonService, private modalService: NgbModal, private tnService: TnService, private commonMethod: CommonMethods, private datePipe: DatePipe) { }

  ngOnInit(): void {
    this.breadCrumbItems = [{ label: 'Dashboard', path: '/Status-list' }, { label: 'My Application', path: '/', active: true }];
    this.selectValue = [
      { id: 1, value: 'Consent Pending', className: 'warning-dot' },
      { id: 3, value: 'Consent Received - Yes', className: 'green-dot' },
      { id: 4, value: 'Consent Received - No', className: 'red-dot' },
      { id: 6, value: 'Link Expired', className: 'red-dot' },
    ];
    this.pageSelectNumber = [2, 5, 10, 25, 50, 100];
    this.getStatusForSA();
  }


  getStatusForSA(onPageChangeFlag?, isDownloadData?) {
    if (!onPageChangeFlag) {
      this.resetStartIndex();
    }
    const filterJSON: any = _.cloneDeep(this.searchFilterJson);
    ['searchEmail', 'searchMobile', 'searchName', 'searchBankName', 'searchStatus'].forEach(element => {
      if (filterJSON[element] == null || filterJSON[element] == undefined || filterJSON[element] == "") {
        filterJSON[element] = undefined;
      }
    });
    filterJSON.consentInitiatedFromDate = filterJSON.consentInitiatedFromDate ? this.getFormatedDate(filterJSON.consentInitiatedFromDate) : undefined;
    filterJSON.paginationFrom = this.startIndex;
    filterJSON.paginationTO = isDownloadData ? this.totalCount : this.pageSize;
    // filterJSON.searchStatus = this.typeId ? this.typeId : undefined;
    this.tnService.getGetStatusForSA(filterJSON).subscribe(res => {
      if (res && res.data && res.status == 200) {
        this.applicationList = res.data;
        if (isDownloadData) {
          this.downloadDataInExcel(res.data);
        } else {
          this.applicationList = res.data;
          this.totalCount = res.data[0]?.totalCount || 0;
        }
      } else {
        this.applicationList = [];
        this.totalCount = 0;
      }
    });
  }

  checkboxClicked(id: Number) {
    if (!this.checked.includes(id)) {
      this.checked.push(id);
    }
    else {
      const index = this.checked.findIndex((checked) => checked === id);
      if (index != -1) {
        this.checked.splice(index, 1);
      }
    }
  }

  downloadDataInExcel(excelData) {
    let downloadData = [];
    const fileName = 'Application_List.xlsx';
    excelData.forEach((element, i) => {
      downloadData = downloadData.concat(new DownLoadDataJson(this.datePipe).getJsonData(element, (i + 1)));
    });
    alasql('SELECT * INTO XLSX("' + fileName + '",{headers:true}) FROM ?', [downloadData]);
  }

  resetStartIndex(): void {
    this.startIndex = 0;
    this.page = 1;
  }

  onPageChange(page: any): void {
    this.startIndex = (page - 1) * this.pageSize;
    // this.endIndex = (page - 1) * this.pageSize + this.pageSize;
    this.getStatusForSA(true);
  }

  lockUnlockUser(userId, isLock) {
    const data = {
      userId: userId,
      isLocked: isLock,
    };
    this.tnService.isUserLocked(data).subscribe(res => {
      if (res) {
        this.getStatusForSA();
        this.commonService.successSnackBar(res.message);
      } else {
        this.commonService.warningSnackBar(res.message);
      }
    });
  }
  getFormatedDate(date): any {
    if (date.toString().includes("-")) {
      const dateParts = date.split('-');
      const dateObj = new Date(+dateParts[2], dateParts[1] - 1, +dateParts[0]);
      return this.datePipe.transform(dateObj, 'y-MM-dd');
    } else {
      return this.datePipe.transform(date, 'y-MM-dd');
    }
  }

  reSendAll() {
    if (this.checked.length == 0) {
      return this.commonService.warningSnackBar("Please Select atleast one application");
    }
    this.updateMultipleNotificationStatus(this.checked, true);
  }

  sendSingle(id) {
    const list = [id];
    this.updateMultipleNotificationStatus(list, false);
  }

  updateMultipleNotificationStatus(data, isResendMulitple) {
    this.tnService.updateMultipleNotificationStatus(data).subscribe(res => {
      if (res && res.status == 200 && res.flag == true) {
        if (isResendMulitple) {
          this.checked = [];
        }
        // this.commonService.successSnackBar(res.message);
        data.forEach(element => {
          const index = _.findIndex(this.applicationList, { id: element });
          if (index != -1) {
            if(this.searchFilterJson.searchStatus != null && this.searchFilterJson.searchStatus != undefined 
              && this.searchFilterJson.searchStatus != this.selectValue[0].id) {
              this.applicationList.splice(index, 1);
            } else {
              this.applicationList[index].status = this.selectValue[0].id;
              this.applicationList[index].statusName = this.selectValue[0].value;
              this.applicationList[index].className = this.selectValue[0].className;  
            }
          }
          this.SendSuccessfullyLink_Popup();
        });

      } else {
        this.commonService.warningSnackBar(res.message);
      }

    })

  }

  userResetPassword(userId) {
    const data = {
      userId: userId,
    };
    this.tnService.isUserResetPassword(data).subscribe(res => {
      if (res) {
        this.commonService.successSnackBar(res.message);
      } else {
        this.commonService.warningSnackBar(res.message);
      }
    });
  }

  //  This js On Window Scroll Top set Cont Dont Remove @Nikul
  changeTab(tabId: number) {
    this.tab = tabId;
  }

  SendSuccessfullyLink_Popup() {
    const config = {
      windowClass: 'popup-380',
    };
    const modalRef = this.modalService.open(SendSuccessfullyLinkPopupComponent, config);
    setTimeout(function(){
      modalRef.close();
    },3000);
    // return modalRef;
  }
}
