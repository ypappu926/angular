import { Component, OnInit, ViewChild, HostListener } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AdvancedService } from 'src/app/CommoUtils/common-services/advanced.service';
import { TnService } from 'src/app/services/tn.service';
import { DatePipe } from '@angular/common';
import * as _ from 'lodash';
import alasql from 'alasql';
import { BMFIOReasonComponent } from 'src/app/Popup/BM-FIO/bm-fio-reason/bm-fio-reason.component';
import { BMFIOCommonProposalComponent } from 'src/app/Popup/BM-FIO/bm-fio-common-proposal/bm-fio-common-proposal.component';
import { CommonMethods } from 'src/app/CommoUtils/common-services/common-methods';
import { Router } from '@angular/router';
import { Constants } from 'src/app/CommoUtils/constants';
import { CommonService } from 'src/app/CommoUtils/common-services/common.service';
import { NegativeData, PositiveData, BMPendingData, FIOPendingData } from './bm-fio-list-view-module';
import { BMFIOApproveComponent } from 'src/app/Popup/BM-FIO/bm-fio-approve/bm-fio-approve.component';

declare var $: any;
@Component({
  selector: 'app-bm-fio-list-view',
  templateUrl: './bm-fio-list-view.component.html',
  styleUrls: ['./bm-fio-list-view.component.scss']
})
export class BMFIOListViewComponent implements OnInit {

  breadCrumbItems: Array<{}> = [{ label: 'Dashboard' }];
  // Collapse declare
  // isCollapsed: boolean;
  // isCollapsed1: boolean;

  tab: number = 1;
  SubTab: number = 4;
  // tabR: number;
  // tabRS: number;
  // request: Request;
  // isActive = false;

  // date Picker For to
  // Component DatePicker colorpicker
  // componentcolor: string;

  // hoveredDate: NgbDate;
  // fromNGDate: NgbDate;
  // toNGDate: NgbDate;

  // hidden: boolean;
  // selected: any;
  // color: string;
  // @Input() fromDate: Date;
  // @Input() toDate: Date;
  // @Output() dateRangeSelected: EventEmitter<{}> = new EventEmitter();

  @ViewChild('dp', { static: true }) datePicker: any;
  submitted: boolean;

  // page number
  page = 1;
  // default page size
  pageSize = 10;
  // start and end index
  startIndex = 1;
  endIndex = 10;
  totalSize = 0;
  totalCount = 0;
  PageSelectNumber = ['5', '10', '25', '50', '100'];
  maxDate;
  dateRangeFromDate;
  dateRangeToDate;

  searchFilterJson = {
    searchEmailOrMobile: '',
    searchEntityName: '',
    searchDistrict: '',
    searchMainFio: '',
    searchSubFio: '',
    responseId: null,
    statusId: null,
    bmStatusId: null,
    signatureStautsId: null,
    statusList: [],
    responseList: [{ id: 14, name: 'Positive' }, { id: 15, name: 'Negative' }],
    signatureStautList: [{ id: 17, name: 'E-sign Pending' }, { id: 18, name: 'E-sign Completed' }],
    bmStautList: [{ id: 19, name: 'Rejected By BM' }, { id: 20, name: 'Approved By BM' }]
  };

  totalCountObj = {
    detailsPendingBM: 0,
    detailsPendingFIO: 0,
    totalCompletedApplications: 0,
    totalNegative: 0,
    totalPendingApplications: 0,
    totalPositive: 0
  };

  debounceEventForFilter = _.debounce(() => this.getStatusList(), 500, {});
  masterList;
  roleId;
  isBMLogin = false;
  isEnabledTransfer = false;

  constructor(private tnService: TnService,
    private modalService: NgbModal,
    public service: AdvancedService,
    private datePipe: DatePipe,
    private commonMethod: CommonMethods,
    private router: Router
  ) {
    // this.total$ = service.total$;
    this.roleId = CommonService.getStorage(Constants.httpAndCookies.ROLEID, true);
    if (this.roleId != Constants.UserRoleList.FIELD_INSPECTION_OFFICER.id) {
      this.isBMLogin = true;
      this.SubTab = 5;
    }
  }

  onPageChange(page: any): void {
    this.startIndex = (page - 1) * this.pageSize;
    // this.endIndex = (page - 1) * this.pageSize + this.pageSize;
    this.getStatusList(true);
  }

  ngOnInit(): void {
    this.tab = CommonService.isObjectNullOrEmpty(CommonService.getStorage(Constants.httpAndCookies.TAB_ID, true)) ? this.tab : Number(CommonService.getStorage(Constants.httpAndCookies.TAB_ID, true));
    this.SubTab = CommonService.isObjectNullOrEmpty(CommonService.getStorage(Constants.httpAndCookies.SUB_TAB_ID, true)) ? this.SubTab : Number(CommonService.getStorage(Constants.httpAndCookies.SUB_TAB_ID, true));
    this.changeTab(this.tab, this.SubTab);
    // this.selected = '';
    this.maxDate = { year: new Date().getFullYear(), month: new Date().getMonth() + 1, day: new Date().getDate() };
    this.getStatusTabCount();
    this.searchFilterJson.statusList = _.filter(Constants.FioBmStatusMaster, { 'isDisplay': true });
    this.getAdminConfigs();
  }

  // Windi scroll Function
  @HostListener('window:scroll', ['$event'])
  onWindowScroll(e: any) {
    if (window.pageYOffset > window.innerHeight) {
      let element: any = document.getElementById('stick-headerN');
      element.classList.add('fix-to-top');
      this.adjustWidth();
    } else {
      let element: any = document.getElementById('stick-headerN');
      element.classList.remove('fix-to-top');
      //this.adjustWidthRemove();]
      // Fix After Remove Css
      let stickN: any = document.getElementById("stick-headerN");
      stickN.style.width = "100%"
    }
  }

  getStatusTabCount() {
    this.tnService.getFioStatusTabCount({}, this.isBMLogin).subscribe(res => {
      if (res && res.data) {
        this.totalCountObj = res.data;
      }
    });
  }

  adjustWidth() {
    var parentwidth = $(".parent").width();
    $(".fix-to-top").width(parentwidth);
    // console.log(parentwidth);
  }

  getAdminConfigs(){
    this.tnService.getAdminConfig(-1).subscribe(success => {
        if(success && success.status && success.data){
          this.isEnabledTransfer = success.data.isEnableTransfer;
          return;
        }
        this.commonMethod.warningSnackBar("Failed to get admin configs");
    });
  }

  //  This js On Window Scroll Top set Cont Dont Remove @Nikul
  changeTab(tabId: number, SubTabID: number) {
    this.tab = tabId;
    this.SubTab = SubTabID;
    this.clearFilter();
    this.getStatusList();
  }

  clearFilter(){
    this.searchFilterJson = {
      searchEmailOrMobile: '',
      searchEntityName: '',
      searchDistrict: '',
      searchMainFio: '',
      searchSubFio: '',
      responseId: null,
      statusId: null,
      bmStatusId: null,
      signatureStautsId: null,
      statusList: [],
      responseList: [{ id: 14, name: 'Positive' }, { id: 15, name: 'Negative' }],
      signatureStautList: [{ id: 17, name: 'E-sign Pending' }, { id: 18, name: 'E-sign Completed' }],
      bmStautList: [{ id: 19, name: 'Rejected By BM' }, { id: 20, name: 'Approved By BM' }]
    };
    this.searchFilterJson.statusList = _.filter(Constants.FioBmStatusMaster, { 'isDisplay': true });
  }

  getStatusList(onPageChangeFlag?, isDownloadData?): void {
    if (!onPageChangeFlag) {
      this.resetStartIndex();
    }
    const filterJSON: any = {};
    filterJSON.searchEmailOrMobile = this.searchFilterJson.searchEmailOrMobile;
    filterJSON.searchEntityName = this.searchFilterJson.searchEntityName;
    filterJSON.searchDistrict = this.searchFilterJson.searchDistrict;
    filterJSON.searchMainFio = this.searchFilterJson.searchMainFio;
    filterJSON.searchSubFio = this.searchFilterJson.searchSubFio;
    filterJSON.signatureStautsId = this.searchFilterJson.signatureStautsId;
    filterJSON.responseId = this.searchFilterJson.responseId;
    filterJSON.statusId = this.searchFilterJson.statusId;
    filterJSON.bmStatusId = this.searchFilterJson.bmStatusId;
    filterJSON.tabValue = this.SubTab;
    filterJSON.dateRangeFromDate = this.dateRangeFromDate ? this.getFormatedDate(this.dateRangeFromDate) : undefined;
    filterJSON.dateRangeToDate = this.dateRangeToDate ? this.getFormatedDate(this.dateRangeToDate) : undefined;

    const data = {
      filterJSON: JSON.stringify(filterJSON),
      paginationFROM: this.startIndex,
      paginationTO: this.pageSize
    };

    this.tnService.getFoStatusList(data, this.isBMLogin).subscribe(res => {
      this.masterList = [];
      if (res && res.data && res.status == 200 && res.flag) {
        this.masterList = res.data;
        this.totalCount = res.data[0]?.totalCount;
        // this.isCollapsed1 ? this.isCollapsed1 = !this.isCollapsed1 : "";
        this.setDataJson(isDownloadData);
      } else {
        if (res) {
          this.commonMethod.errorSnackBar(res?.message ? res.message : 'Something went wrong while getting application list.');
        }
      }
    });
  }

  setDataJson(isDownloadData) {
    if (this.masterList?.length > 0) {
      this.masterList.forEach(element => {
        // if (element.status == Constants.ApplicationStatusMaster.NEGATIVE || element.status == Constants.ApplicationStatusMaster.POSITIVE) {
        //   element.statusName = 'Received From FIO For Approval';
        // } else 
        // if (element.isTransfer) {
        //   element.statusName = 'Transfered By ' + (( CommonService.isObjectIsEmpty(element.transferedByBranchName)  || element.transferedByBranchName == null) ? '-' : element.transferedByBranchName);
        //   // element.statusNameFIO = 'Transfered By ' + ((CommonService.isObjectIsEmpty(element.transferedByBranchName) || element.transferedByBranchName == null) ? '-' : element.transferedByBranchName);
        //   // console.log('element :: ' ,element.transferedByBranchName);
        // } else {
        //   const index = _.findIndex(Constants.FioBmStatusMaster, { id: element.status })
        //   if (index != -1) {
        //     if(this.isBMLogin) {
        //       element.statusName = Constants.FioBmStatusMaster[index].bmDisplayName;
        //     } else {
        //       element.statusName = Constants.FioBmStatusMaster[index].fioDisplayName;
        //     }
        //   }
        // }
        const index = _.findIndex(Constants.FioBmStatusMaster, { id: element.status })
        if (index != -1) {
          if(element.status == 21) { // TRASFERD BY BM 
            element.statusName = 'Transfered By ' + (( CommonService.isObjectIsEmpty(element.transferedByBranchName)  || element.transferedByBranchName == null) ? '-' : element.transferedByBranchName);
          } else {
            if(this.isBMLogin) {
              element.statusName = Constants.FioBmStatusMaster[index].bmDisplayName;
            } else {
              element.statusName = Constants.FioBmStatusMaster[index].fioDisplayName;
            }
          }
        }
        if (!element.statusNameFIO) {
          const index1 = _.findIndex(Constants.FioBmStatusMaster, { id: element.status })
          if (index1 != -1) {
            element.statusNameFIO = Constants.FioBmStatusMaster[index1].bmDisplayName;
          }
        }
        if (element.bmStatus == Constants.ApplicationStatusMaster.APPROVED_BY_BM) {
          element.bmStatusName = 'Approved by BM';
        } else if (element.bmStatus == Constants.ApplicationStatusMaster.REJECTED_BY_BM) {
          element.bmStatusName = 'Rejected by BM';
        }
      });
      if (isDownloadData) {
        this.downloadDataInExcel(this.masterList);
      }
    }
  }

  downloadDataInExcel(excelData) {
    let downloadData = [];
    const fileName = 'All-Field-Specifications' + '.xlsx';
    excelData.forEach((element, i) => {
      const allStatusFields: any = [];
      if (this.SubTab == 4) {
        allStatusFields.push(new FIOPendingData().getJsonData(element, (i + 1), this.isBMLogin))
      } else if (this.SubTab == 5) {
        allStatusFields.push(new BMPendingData().getJsonData(element, (i + 1), this.isBMLogin))
      } else if (this.SubTab == 6) {
        allStatusFields.push(new PositiveData().getJsonData(element, (i + 1), this.isBMLogin))
      } else if (this.SubTab == 7) {
        allStatusFields.push(new NegativeData().getJsonData(element, (i + 1), this.isBMLogin))
      }
      downloadData = downloadData.concat(allStatusFields);
    });
    // console.log(downloadData);
    alasql('SELECT * INTO XLSX("' + fileName + '",{headers:true}) FROM ?', [downloadData]);
  }

  resetStartIndex(): void {
    this.startIndex = 0;
    this.page = 1;
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

  Common_Tranfer_Proposal_Popup() {
    const config = {
      windowClass: 'Mediam-model',
      size: 'md'
    };
    const modalRef = this.modalService.open(BMFIOCommonProposalComponent, config);
    return modalRef;
  }

  Reason_View_Popup() {
    const config = {
      windowClass: 'Mediam-model',
      size: 'md'
    };
    const modalRef = this.modalService.open(BMFIOReasonComponent, config);
    return modalRef;
  }

  navigate(data) {
    if (!data.borrowerProposalId || !data.jobId || !data.proposalMappingId) {
      this.commonMethod.errorSnackBar("Details is not propoer, please provide propoer details.");
      return;
    }
    CommonService.removeStorage(Constants.httpAndCookies.TAB_ID);
    CommonService.removeStorage(Constants.httpAndCookies.SUB_TAB_ID);
    CommonService.setStorage(Constants.httpAndCookies.TAB_ID, this.tab);
    CommonService.setStorage(Constants.httpAndCookies.SUB_TAB_ID, this.SubTab);
    this.router.navigate([Constants.ROUTE_URL.FIO_FORM],
      {
        queryParams:
        {
          id: CommonService.encryptFunction(data.borrowerProposalId),
          pid: CommonService.encryptFunction(data.jobId),
          proposalMappingId: CommonService.encryptFunction(data.proposalMappingId),
          viewMode: CommonService.encryptFunction(this.isBMLogin ? true : this.SubTab != 4 ? true : false),
          isFioActive: CommonService.encryptFunction(data.isSubFioActive)
        }
      });
  }

  updateSubFioRights(data, event) {
    event.preventDefault();
    if (!data.isSubFioActive) {
      const config = {
        windowClass: 'Mediam-model',
        size: 'md',
      };
      const datas: any = {};
      datas.title = "Enable Subsidary FIO";
      datas.content = "Are you sure you want the Subsidiary FIO to view the Application?";
      const modalRef = this.modalService.open(BMFIOApproveComponent, config);
      modalRef.componentInstance.popUpObj = datas;
      modalRef.closed.subscribe(result => {
        if (result == 1) {
          this.tnService.updateSubFioRights(data.proposalMappingId).subscribe(res => {
            if (res && res.status == 200) {
              data.isSubFioActive = !data.isSubFioActive;
            } else {
              this.commonMethod.warningSnackBar(res?.message ? res.message : 'Something went wrong while updating rights.')
            }
          });
        }
      });
    }
  }

  /**
   * Is hovered over date
   * @param date date obj
   */
  // isHovered(date: NgbDate) {
  //   return this.fromNGDate && !this.toNGDate && this.hoveredDate && date.after(this.fromNGDate) && date.before(this.hoveredDate);
  // }

  /**
   * @param date date obj
   */
  // isInside(date: NgbDate) {
  //   return date.after(this.fromNGDate) && date.before(this.toNGDate);
  // }

  /**
   * @param date date obj
   */
  // isRange(date: NgbDate) {
  //   return date.equals(this.fromNGDate) || date.equals(this.toNGDate) || this.isInside(date) || this.isHovered(date);
  // }

}


