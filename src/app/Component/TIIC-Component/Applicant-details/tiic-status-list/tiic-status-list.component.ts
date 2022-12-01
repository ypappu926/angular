import { Component, OnInit, Input, Output, EventEmitter, ViewChild, ElementRef, HostListener } from '@angular/core';
import { NgbDate, NgbModal, NgbCalendar } from '@ng-bootstrap/ng-bootstrap';
import { Observable } from 'rxjs';
// import { HttpClient } from '@angular/common/http';
import { AdvancedService } from 'src/app/CommoUtils/common-services/advanced.service';
import { BankUserDatas } from 'src/app/CommoUtils/common-services/Product-Scoring-Data/customers.model';
// import { BankUserData } from 'src/app/CommoUtils/common-services/Product-Scoring-Data/dataCustomer';
import { TnService } from 'src/app/services/tn.service';
import { DatePipe } from '@angular/common';
import * as _ from 'lodash';
import alasql from 'alasql';
import { CommonService } from 'src/app/CommoUtils/common-services/common.service';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { Constants } from 'src/app/CommoUtils/constants';
import { CommonMethods } from 'src/app/CommoUtils/common-services/common-methods';
import { CommonResetPasswordComponent } from 'src/app/Popup/common-reset-password/common-reset-password.component';

declare var jQuery: any;
declare var $: any;

@Component({
  selector: 'app-tiic-status-list',
  templateUrl: './tiic-status-list.component.html',
  styleUrls: ['./tiic-status-list.component.scss'],
  providers: [DatePipe]
})
export class TIICStatusListComponent implements OnInit {

  breadCrumbItems: Array<{}>;

  // selectValue: string[];
  // selectConsentStatus: any = [];
  statusList: any = [];
  // Collapse declare
  isCollapsed: boolean;
  isCollapsed1: boolean;

  tab: number;
  tabA: number;
  tabR: number;
  tabRS: number;
  request: Request;
  isActive = false;
  expiredInDays = 0;

  // date Picker For to
  // Component DatePicker colorpicker
  componentcolor: string;

  hoveredDate: NgbDate;
  fromNGDate: NgbDate;
  toNGDate: NgbDate;

  hidden: boolean;
  selected: any;
  color: string;
  @Input() fromDate: Date;
  @Input() toDate: Date;
  // @Output() dateRangeSelected: EventEmitter<{}> = new EventEmitter();

  @ViewChild('dp', { static: true }) datePicker: any;

  BankUserData: BankUserDatas[] = [];

  submitted: boolean;

  // page number
  page = 1;
  // default page size
  pageSize = 10;

  // start and end index
  startIndex = 1;
  // endIndex = 10;
  totalSize = 0;
  totalCount = 0;

  PageSelectNumber: string[];
  debounceEventForFilter = _.debounce(() => this.getStatusList(), 500, {});

  consentReceivedCount: number = 0;
  consentReceivedNoCount: number = 0;
  consentReceivedYesCount: number = 0;
  detailsPendingCount: number = 0;
  detailsPendingBO: number = 0;
  detailsPendingHO: number = 0;
  detailsUplodedCount: number = 0;
  inActiveCount: number = 0;
  inProcessCount: number = 0;
  totalConsentCount: number = 0;
  // searchValue: any;
  searchName: any;
  searchEmail: any;
  searchMobile: any;
  searchOfficerAssign:any;
  maxDate;

  dateRangeFromDate;
  dateRangeToDate;

  consentInitiatedFromDate;
  consentReceivedFromDate;
  isFilterApplied = false;

  consentStatusId: any;

  pageData: any;

  total$: Observable<number>;
  constructor(private tnService: TnService,
    // private eref: ElementRef,
    // private modalService: NgbModal,
    // calendar: NgbCalendar,
    public service: AdvancedService,
    private datePipe: DatePipe,
    private activatedRoute: ActivatedRoute,
    private commonService: CommonService,
    // private http: HttpClient
    private router: Router
  ) {
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        if (this.activatedRoute.snapshot.data) {
          this.pageData = this.activatedRoute.snapshot.data;
          this.tab = (this.pageData && this.pageData.type == 1) ? 1 : 7;
          if(!CommonService.isObjectNullOrEmpty(CommonService.getStorage(Constants.httpAndCookies.HO_BO_DASHBOARD_TAB,true))){
            this.tab = CommonService.getStorage(Constants.httpAndCookies.HO_BO_DASHBOARD_TAB,true);
          }
          // console.log('this.pageData: ', this.pageData);
        }
      }
    });

    this.total$ = service.total$;

    this.commonService.DropDownjquery();
    this.commonService.DropDownNOTwojquery();
    
  }

  onPageChange(page: any): void {
    this.startIndex = (page - 1) * this.pageSize;
    // this.endIndex = (page - 1) * this.pageSize + this.pageSize;
    this.getStatusList(true);
  }

  omit_special_char(event) {
    var k;
    k = event.charCode;  //         k = event.keyCode;  (Both can be used)
    return ((k > 64 && k < 91) || (k > 96 && k < 123) || k == 8 || k == 32 || (k >= 48 && k <= 57));
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

  getStringFormatedDate(date): any {
    return date ? (date.year + "-" + date.month + "-" + date.day) : undefined;
  }

  ngOnInit(): void {
    CommonService.removeStorage('isViewMode');

    this.breadCrumbItems = [{ label: 'Dashboard', path: '/Status-list/Dashboard-List' }];
    // this.statusList = [{ id: 1, name: 'Pending By BO' }, { id: '1,2', name: 'Pending By HO', status: '' }, { id: 3, name: 'Completed' }];
    // this.selectConsentStatus = [{ id: 1, name: 'Yes' }, { id: 2, name: 'No' }];
    this.PageSelectNumber = ['5', '10', '25', '50', '100'];
    // date
    // this.hidden = true;

    this.getLinkExpiredDays();
    this.getStatusTabCount();
    // tab
    // this.tab = 1;
    this.changeTab(this.tab);

    // Form 2 to Date piker
    // Component color value of color picker
    // this.componentcolor = '#3bafda';
    this.selected = '';
    this.maxDate = { year: new Date().getFullYear(), month: new Date().getMonth() + 1, day: new Date().getDate() }
    this.clearStorageData();
    
  }


  clearStorageData() {
    CommonService.removeStorage(Constants.httpAndCookies.PROFILE_ID);
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

  adjustWidth() {
    var parentwidth = $(".parent").width();
    $(".fix-to-top").width(parentwidth);
    // console.log(parentwidth);
  }

  //  This js On Window Scroll Top set Cont Dont Remove @Nikul
  changeTab(tabId: number) {
    CommonService.setStorage(Constants.httpAndCookies.HO_BO_DASHBOARD_TAB,tabId);
    this.tab = tabId;
    this.clearFilter();
    this.getStatusList();
    this.OnloadJqueryMObile();
    this.getDropDownloadStatusList(tabId);
  }

  clearFilter() {
    this.searchName = undefined;
    this.searchEmail = undefined;
    this.searchMobile = undefined;
    this.consentInitiatedFromDate = undefined;
    this.consentReceivedFromDate = undefined;
    this.dateRangeFromDate = undefined;
    this.dateRangeToDate = undefined;
    this.consentStatusId = undefined;
  }

  OnloadJqueryMObile() {
    const width = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
    if (width < 1024) {
      if ('tab == 3') {
        this.commonService.DropDownNOTwojquery();
      } if ('tab == 5') {
        this.commonService.DropDownNOThreejquery();
      }
      return true;
    } else {
      return false;
    }
  }

  resetStartIndex(): void {
    this.startIndex = 0;
    this.page = 1;
  }


  clearAllFilter() {
    this.clearDateRange();
    this.getStatusList();
  }

  checkClearFilter(): any {
    return (this.consentInitiatedFromDate || this.dateRangeFromDate);
  }

  clearDateRange(): void {
    this.selected = '';
    this.consentInitiatedFromDate = undefined;
    this.consentReceivedFromDate = undefined;
    this.dateRangeFromDate = undefined;
    this.dateRangeToDate = undefined;
    this.fromNGDate = undefined;
    this.toNGDate = undefined;
  }

  isViewClearFilter() {
    return (this.searchEmail || this.searchMobile || this.searchEmail || this.fromDate || this.toDate);
  }

  getStatusList(onPageChangeFlag?): void {
    if (!onPageChangeFlag) {
      this.resetStartIndex();
    }
    const filterJSON = {
      tabValue: this.tab,
      searchName: this.searchName ? this.searchName : undefined,
      searchEmail: this.searchEmail ? this.searchEmail : undefined,
      searchMobile: this.searchMobile ? this.searchMobile : undefined,
      consentInitiatedFromDate: this.consentInitiatedFromDate ? this.getFormatedDate(this.consentInitiatedFromDate) : undefined,
      consentReceivedFromDate: this.consentReceivedFromDate ? this.getFormatedDate(this.consentReceivedFromDate) : undefined,
      dateRangeFromDate: this.dateRangeFromDate ? this.getFormatedDate(this.dateRangeFromDate) : undefined,
      dateRangeToDate: this.dateRangeToDate ? this.getFormatedDate(this.dateRangeToDate) : undefined,
      consentStatusId: this.consentStatusId ? this.consentStatusId : undefined,
      searchOfficerAssign:this.searchOfficerAssign ? this.searchOfficerAssign : undefined
    };
    // console.log('filterJSON: ', filterJSON);
    const data = { filterJSON: JSON.stringify(filterJSON), paginationFROM: this.startIndex, paginationTO: this.pageSize }
    // console.log(data);
    this.tnService.getStatusList(data).subscribe(res => {
      this.BankUserData = [];
      if (res && res.data) {
        // console.log(res.data);
        this.BankUserData = res.data;
        // console.log('this.BankUserData: ', this.BankUserData);
        this.totalCount = res.data[0].totalCount;
      }
    });
  }


  downloadAllUser() {
    const filterJSON = {
      tabValue: this.tab,
      searchEmail: this.searchEmail ? this.searchEmail : undefined,
      searchMobile: this.searchMobile ? this.searchMobile : undefined,
      consentInitiatedFromDate: this.consentInitiatedFromDate ? this.getStringFormatedDate(this.consentInitiatedFromDate) : undefined,
      consentReceivedFromDate: this.consentReceivedFromDate ? this.getStringFormatedDate(this.consentReceivedFromDate) : undefined,
      dateRangeFromDate: this.dateRangeFromDate ? this.getFormatedDate(this.dateRangeFromDate) : undefined,
      dateRangeToDate: this.dateRangeToDate ? this.getFormatedDate(this.dateRangeToDate) : undefined,
    };
    const data = { filterJSON: JSON.stringify(filterJSON), paginationFROM: 0, paginationTO: this.totalCount }

    this.tnService.getStatusList(data).subscribe(res => {
      if (res && res.data) {
        this.downloadDataInExcel(res.data);
      }
    });
  }

  downloadDataInExcel(excelData) {
    let downloadData = [];
    const fileName = 'all-User' + '.xlsx';
    excelData.forEach((element, i) => {
      const index = i + 1;
      element.signupDate = this.datePipe.transform(element.signupDate, 'dd/MM/y');
      let allUser;
      if (this.tab == 3) {
        allUser = [{
          'Sr no': index,
          'Name of Unit': element.entityName,
          'Email': element.email,
          'Mobile': element.mobile,
          'Consent Initiated Date': element.consentInitiatedDate ? this.dateFormateForExcel(element.consentInitiatedDate) : '',
          'Consent Received Date': element.consentReceivedDate ? this.dateFormateForExcel(element.consentReceivedDate) : '',
          'Consent Received': element.status != 1 && element.status != 2 && element.status != 4 ? 'Yes' : 'No',
          'Status': element.statusName ? element.statusName : '',
        }];
      } else if (this.tab == 5) {
        allUser = [{
          'Sr no': index,
          'Name of Unit': element.entityName,
          'Email': element.email,
          'Mobile': element.mobile,
          'Consent Initiated Date': element.consentInitiatedDate ? this.dateFormateForExcel(element.consentInitiatedDate) : '',
          'Consent Received Date': element.consentReceivedDate ? this.dateFormateForExcel(element.consentReceivedDate) : '',
          'Upload Status': element.status == 7 ? 'Yes' : 'No',
          'Status': element.statusName ? element.statusName : '',
        }];
      } else {
        if(this.tab == 2 || this.tab == 4 || this.tab == 6 || this.tab == 8 || this.tab == 10) {
          allUser = [{
            'Sr no': index,
            'Name of Unit': element.entityName,
            'Email': element.email,
            'Mobile': element.mobile,
            'Consent Initiated Date': element.consentInitiatedDate ? this.dateFormateForExcel(element.consentInitiatedDate) : '',
            'Consent Received Date': element.consentReceivedDate ? this.dateFormateForExcel(element.consentReceivedDate) : '',
          }];
        }else{
          allUser = [{
            'Sr no': index,
            'Name of Unit': element.entityName,
            'Email': element.email,
            'Mobile': element.mobile,
            'Consent Initiated Date': element.consentInitiatedDate ? this.dateFormateForExcel(element.consentInitiatedDate) : '',
            'Consent Received Date': element.consentReceivedDate ? this.dateFormateForExcel(element.consentReceivedDate) : '',
            'Status': element.statusName ? element.statusName : '',
          }];
        }
      }
      downloadData = downloadData.concat(allUser);
    });
    alasql('SELECT * INTO XLSX("' + fileName + '",{headers:true}) FROM ?', [downloadData]);
  }

  dateFormateForExcel(date) {
    return this.datePipe.transform(date, 'yyyy-MM-dd');
  }

  getStatusTabCount() {
    // const data = {}
    this.tnService.getStatusTabCount({}).subscribe(res => {
      if (res && res.data) {
        // console.log(res.data);
        this.consentReceivedCount = res.data.consentReceivedCount ? res.data.consentReceivedCount : 0;
        this.consentReceivedNoCount = res.data.consentReceivedNoCount ? res.data.consentReceivedNoCount : 0;
        this.consentReceivedYesCount = res.data.consentReceivedYesCount ? res.data.consentReceivedYesCount : 0;
        this.detailsUplodedCount = res.data.detailsUplodedCount ? res.data.detailsUplodedCount : 0;
        this.inActiveCount = res.data.inActiveCount ? res.data.inActiveCount : 0;
        this.inProcessCount = res.data.inProcessCount ? res.data.inProcessCount : 0;
        this.totalConsentCount = res.data.totalConsentCount ? res.data.totalConsentCount : 0;
        this.detailsPendingCount = res.data.detailsPendingCount ? res.data.detailsPendingCount : 0;
        this.detailsPendingBO = res.data.detailsPendingBO ? res.data.detailsPendingBO : 0;
        this.detailsPendingHO = res.data.detailsPendingHO ? res.data.detailsPendingHO : 0;
      }
    });
  }

  // date picker js

  // onDateSelection(date: any) {
  //   this.fromNGDate = date;
  // }

  onDateSelectionRange(date: NgbDate) {
    if (!this.dateRangeFromDate && !this.dateRangeToDate) {
      this.fromNGDate = date;
      this.dateRangeFromDate = new Date(date.year, date.month - 1, date.day);
      this.selected = '';
    } else if (this.dateRangeFromDate && !this.dateRangeToDate && date.after(this.fromNGDate)) {
      this.toNGDate = date;
      this.dateRangeToDate = new Date(date.year, date.month - 1, date.day);
      this.hidden = true;
      // this.selected = this.dateRangeFromDate.toLocaleDateString() + '-' + this.dateRangeToDate.toLocaleDateString();
      this.selected = this.datePipe.transform(this.dateRangeFromDate, 'dd/MM/y') + '-' + this.datePipe.transform(this.dateRangeToDate, 'dd/MM/y');
    } else {
      this.fromNGDate = date;
      this.dateRangeFromDate = new Date(date.year, date.month - 1, date.day);
      this.selected = '';
    }
  }

  /**
   * Is hovered over date
   * @param date date obj
   */
  isHovered(date: NgbDate) {
    return this.fromNGDate && !this.toNGDate && this.hoveredDate && date.after(this.fromNGDate) && date.before(this.hoveredDate);
  }

  /**
   * @param date date obj
   */
  isInside(date: NgbDate) {
    return date.after(this.fromNGDate) && date.before(this.toNGDate);
  }

  /**
   * @param date date obj
   */
  isRange(date: NgbDate) {
    return date.equals(this.fromNGDate) || date.equals(this.toNGDate) || this.isInside(date) || this.isHovered(date);
  }

  showData() {

    if (this.tab == 1) {
      return true;
    } else if (this.tab == 2 && this.inProcessCount > 0) {
      return true;
    } else if (this.tab == 3 && this.consentReceivedCount > 0) {
      return true;
    } else if (this.tab == 4 && this.inActiveCount > 0) {
      return true;
    } else if (this.tab == 5 && this.consentReceivedYesCount > 0) {
      return true;
    } else if (this.tab == 6 && this.consentReceivedNoCount > 0) {
      return true;
    } else if (this.tab == 7 && this.detailsPendingCount > 0) {
      return true;
    } else if (this.tab == 8 && this.detailsUplodedCount > 0) {
      return true;
    } else if (this.tab == 9 && this.detailsPendingHO > 0) {
      return true;
    } else if (this.tab == 10 && this.detailsPendingBO > 0) {
      return true;
    }
    return false;
  }

  sendLink(data) {
    this.tnService.updateNotificationStatus(data).subscribe(succss => {
      if (succss && succss.status == 200) {

        this.getStatusTabCount();
        this.tab = 4;
        this.changeTab(this.tab);

        // called consent link mail code from backend 
        
        // this.tnService.proceedAfterUpload(data).subscribe(success => {
        //   if (success.status === 200) {
        //     this.getStatusTabCount();
        //     this.tab = 4;
        //     this.changeTab(this.tab);
        //   }
        // }, error => {
        //   this.commonService.warningSnackBar('Failed to send link to borrower');
        // });
      } else {
        this.commonService.warningSnackBar('Failed to send link to borrower');
      }

    }, error => {
      this.commonService.warningSnackBar('Failed to send link to borrower');
    })

  }
  sendLinksToAllBorrower() {
    let data = {};
    this.sendLink(data);
  }

  sendLinksToBorrower(id: any) {
    let data = { id: id };
    this.sendLink(data);
  }

  getLinkExpiredDays() {
    this.tnService.getLinkedExpiredDays().subscribe(succss => {
      if (succss && succss.data) {
        this.expiredInDays = succss.data;
      }
    }, error => {
      this.commonService.warningSnackBar('Failed to get link details');
    });
  }

  updateData(tabId) {
    this.getStatusTabCount();
    this.changeTab(this.tab);
  }

  createJob(customer) {

    if (customer.jobId) {
      this.router.navigate([Constants.ROUTE_URL.HO_BO_DATA_FILEDS], { queryParams: { id: CommonService.encryptFunction(customer.id), pid: CommonService.encryptFunction(customer.jobId) } });
    } else {
      let workflowReq = { workflowId: 1, applicationId: customer.consentId };
      this.tnService.createHoBoFioWorkflow(workflowReq).subscribe(res => {
        if (res && res.status == 200) {
          let borrowerReq = { id: customer.id, jobId: res.data };
          this.tnService.saveBorrowerData(borrowerReq).subscribe(res => {
            if (res && res.status == 200) {
              this.router.navigate([Constants.ROUTE_URL.HO_BO_DATA_FILEDS], { queryParams: { id: CommonService.encryptFunction(customer.id), pid: CommonService.encryptFunction(borrowerReq.jobId) } });
              return;
            }
            this.commonService.warningSnackBar(res.message);
          }, error => {
            this.commonService.warningSnackBar('Failed to update data');
          })
        } else {
          this.commonService.warningSnackBar('Failed to create process');
        }
      }, error => {
        this.commonService.warningSnackBar('Failed to create process');
        console.log("Failed to create process", error);
      })
    }
  }

  editDetails(customer) {

    CommonService.setStorage(Constants.httpAndCookies.BORROWER_USER_ID,customer.userId);
    if (customer.profileId) {
      CommonService.setStorage(Constants.httpAndCookies.PROFILE_ID, customer.profileId);
      this.createJob(customer);
    } else {
      let profileCreationReq = { profileTypeId: 1, consentId: customer.id, userId: customer.userId };
      this.tnService.createConsentProfile(profileCreationReq).subscribe(profileSuccessRes => {
        if (profileSuccessRes && profileSuccessRes.status == 200) {
          let borrowerReq = { id: customer.id, profileId: profileSuccessRes.data };
          const data: any = {};
          // data.loanTypeId = Constants.LoanType.EDUCATION_LOAN;
          data.loanTypeId = 1;
          data.schEligRespId = 0;
          data.schTypeId = 9;
          data.businessTypeId = 1;
          data.userId = customer.userId;
          data.profileId = profileSuccessRes.data ;
          data.campaignMasterId=1;
          //data.gstTypeId=this.data.gstTypeId;
          this.tnService.createLoan(data).subscribe(res => {
            if (res.status === 200 && res.data !== null) {
              this.tnService.saveBorrowerData(borrowerReq).subscribe(res => {
                if (res && res.status == 200) {
                  CommonService.setStorage(Constants.httpAndCookies.PROFILE_ID, profileSuccessRes.data);
                  this.createJob(customer);
                } else if (res && res.message) {
                  this.commonService.warningSnackBar(res.message);
                } else {
                  this.commonService.warningSnackBar('Failed to update data');
                }
              }, error => {
                this.commonService.warningSnackBar('Failed to update data', error);
              })
            }
          }, error => {
            this.commonService.errorSnackBar(error);
          });

          
        } else {
          this.commonService.warningSnackBar('Failed to create process');
        }
      }, error => {
        this.commonService.warningSnackBar('Failed to create process');
        console.log("Failed to create process", error);
      })
    }

  }

  viewDetails(customer) {
    CommonService.setStorage("isViewMode", true);
    this.editDetails(customer);
  }


  ResetPassword_Popup(userId, emailId) {
    const config1 = {
      windowClass: 'Mediam-model',
      size: 'md'
    };
    const objData1 = { userId: userId, emailId: emailId };
    this.commonService.openPopUp(objData1, CommonResetPasswordComponent, false, config1).result.then(result => {
    });
    return null;
  }

  getDropDownloadStatusList(tabId): any {
    switch (tabId) {
      case 1:
        this.statusList = [{ id: '1', name: 'Consent Pending' }, { id: '3', name: 'Consent Received - Yes' }, { id: '4', name: 'Consent Received - No' }, { id: '6', name: 'Link Expired' }, { id: '8,9', name: 'Pending By BO' }, { id: '10', name: 'Completed' }];
        break;
      case 3:
        this.statusList = [{ id: '3,8,9,10', name: 'Consent Received - Yes' }, { id: '4', name: 'Consent Received - No' }];
        break;
      case 5:
        this.statusList = [{ id: '3', name: 'Pending By HO', status: '' }, { id: '8,9', name: 'Pending By BO' }, { id: '10', name: 'Completed' }];
        break;
      case 7:
        this.statusList = [{ id: '3', name: 'Pending By HO', status: '' }, { id: '8,9', name: 'Pending By BO' }];
        break;
      case 9:
        this.statusList = [{ id: '101', name: 'New', status: '' }, { id: '102', name: 'In-Process' }];
        break;
      default:
        this.statusList = [];
        break;
    }
  }
}

