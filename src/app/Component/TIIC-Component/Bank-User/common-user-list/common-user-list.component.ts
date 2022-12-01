import { Component, OnInit, Input, ViewChild, HostListener } from '@angular/core';
import { AdvancedService } from 'src/app/CommoUtils/common-services/advanced.service';
import { TnService } from 'src/app/services/tn.service';
import { DatePipe } from '@angular/common';
import { CommonService } from 'src/app/CommoUtils/common-services/common.service';
import { Constants } from 'src/app/CommoUtils/constants';
import { isEmpty } from 'lodash';
import { Router } from '@angular/router';
import alasql from 'alasql';
import * as _ from 'lodash';
import { CommonUserList } from './common-user-list.model';
import { CommonResetPasswordComponent } from 'src/app/Popup/common-reset-password/common-reset-password.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CommonLockUserComponent } from 'src/app/Popup/common-lock-user/common-lock-user.component';
import { CommonMethods } from 'src/app/CommoUtils/common-services/common-methods';
import { BMFIOCommonProposalComponent } from 'src/app/Popup/BM-FIO/bm-fio-common-proposal/bm-fio-common-proposal.component';
declare var $: any;

@Component({
  selector: 'app-common-user-list',
  templateUrl: './common-user-list.component.html',
  styleUrls: ['./common-user-list.component.scss']
})
export class CommonUserListComponent implements OnInit {


  breadCrumbItems: Array<{}>;

  selectValue: string[];
  // Collapse declare
  isCollapsed: boolean;
  isCollapsed1: boolean;

  tab: number;
  // headingTitle: any;
  // detailsHeadingTitle: any;
  // isSingleAddButton: any;
  tabObjDetails: any = {};
  tabA: number;
  tabR: number;
  tabRS: number;
  request: Request;
  isActive = false;
  isAddUserButtonShow = false;

  // date Picker For to
  // Component DatePicker colorpicker
  componentcolor: string;

  // hoveredDate: NgbDate;
  // fromNGDate: NgbDate;
  // toNGDate: NgbDate;

  // hidden: boolean;
  // selected: any;
  color: string;
  @Input() fromDate: Date;
  @Input() toDate: Date;
  // @Output() dateRangeSelected: EventEmitter<{}> = new EventEmitter();

  @ViewChild('dp', { static: true }) datePicker: any;

  bankUserList = [];

  submitted: boolean;

  // page number
  page = 1;
  // default page size
  pageSize = 10;

  // start and end index
  startIndex = 0;
  // endIndex = 10;
  totalSize = 0;
  totalCount = 0;
  intialTotalCount = -1;

  PageSelectNumber: string[];

  maxDate;

  // dateRangeFromDate;
  // dateRangeToDate;

  // consentInitiatedFromDate;
  // consentReceivedFromDate;
  isFilterApplied = false;

  // searchValue: any;
  searchEmail: any;
  searchMobile: any;
  searchOrgName: any;
  searchUserName: any;
  searchUserRoleId: any;
  searchStatus: any;
  searchBranchName: any;
  searchDistrict: any;
  searchCityName: any

  userTypeId: any;
  userRoleId: any;
  userOrgId: any;
  userId: any;
  isEnabledTransfer: any;

  // bankerTabList: any;
  // superAdminTabList: any;

  userTabList: any = [];
  userRoleDropdownList: any = [];
  statusList: any = [];
  debounceEventForFilter = _.debounce(() => this.getUserList(), 500, {});

  isViewUserNameColumn = false;
  isViewRoleColumn = false;
  isViewEmailColumn = false;
  isViewMobileColumn = false;
  isViewOrgColumn = false;
  isViewDepartmentColumn = false;
  isViewDistrictColumn = false;
  isViewBranchNameColumn = false;
  isViewCityColumn = false;
  isViewStatusColumn = false;
  isViewViewColumn = false;
  isViewEditColumn = false;
  isViewLockColumn = false;
  isViewResetPasswordColumn = false;

  isViewUserNameExcelColumn = false;
  isViewRoleExcelColumn = false;
  isViewEmailExcelColumn = false;
  isViewMobileExcelColumn = false;
  isViewOrgExcelColumn = false;
  isViewDepartmentExcelColumn = false;
  isViewDistrictExcelColumn = false;
  isViewBranchNameExcelColumn = false;
  isViewCityExcelColumn = false;
  isViewStatusExcelColumn = false;
  isViewViewExcelColumn = false;
  isViewEditExcelColumn = false;
  isViewLockExcelColumn = false;
  isViewResetPasswordExcelColumn = false;

  constructor(private modalService: NgbModal, private tnService: TnService, private router: Router, public service: AdvancedService, private datePipe: DatePipe, private commonService: CommonService) {
    // this.bankerTabList = [{ id: 1, name: 'All User' }, { id: 2, name: 'Admin Office Users' }, { id: 3, name: 'Branch manager' }, { id: 4, name: 'Field Inspection Officer' }];
    // this.superAdminTabList = Constants.superAdminTabList;
    this.userTypeId = +CommonService.getStorage(Constants.httpAndCookies.USERTYPE, true);
    this.userRoleId = +CommonService.getStorage(Constants.httpAndCookies.ROLEID, true);
    this.userOrgId = +CommonService.getStorage(Constants.httpAndCookies.ORGID, true);
    this.statusList = [{ id: 1, name: 'Active' }, { id: 2, name: 'In-Active' }];
    this.userId = +CommonService.getStorage(Constants.httpAndCookies.USER_ID, true);
  }

  onPageChange(page: any): void {
    this.startIndex = (page - 1) * this.pageSize;
    // this.endIndex = (page - 1) * this.pageSize + this.pageSize;
    this.getUserList(true);
  }

  ngOnInit(): void {
    this.breadCrumbItems = [{ label: 'Dashboard', path: '/', active: true }, { label: 'Bank Users', active: true }];
    // this.selectValue = ['Alaska', 'Hawaii', 'California'];
    this.PageSelectNumber = ['5', '10', '25', '50', '100'];
    // this.userTabList = CommonUserList.getRoleWiseTabList(this.userRoleId);
    this.tab = this.userRoleId == 4 ? 4 : 1;
    if (!this.commonService.isObjectNullOrEmpty(CommonService.getStorage(Constants.httpAndCookies.SUPER_ADMIN_DASHBOARD_TAB, true))) {
      this.tab = +CommonService.getStorage(Constants.httpAndCookies.SUPER_ADMIN_DASHBOARD_TAB, true);
    }
    // this.maxDate = { year: new Date().getFullYear(), month: new Date().getMonth() + 1, day: new Date().getDate() }
    this.getUserTabDetails();
    this.getAdminConfigs();
    this.commonService.DropDownjquery();
  }

  // Windi scroll Function
  //  This js On Window Scroll Top set Cont Dont Remove @Nikul
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
  }

  getUserTabDetails() {
    this.tnService.getUserTabDetailsList().subscribe(res => {
      if (res && res.data) {
        const data = JSON.parse(res.data);
        data.forEach(element => {
          element.columns = JSON.parse(element.columns);
          element.excelColumns = JSON.parse(element.excelColumns);
        });
        this.userTabList = data;
        // console.log('this.userTabList: ', this.userTabList);
        this.changeTab(this.tab);
      }
    });
  }

  changeTab(tabId: number) {
    CommonService.setStorage(Constants.httpAndCookies.SUPER_ADMIN_DASHBOARD_TAB, tabId);
    this.tab = tabId;
    this.clearSearchFilter();
    // console.log('this.userTabList: ', this.userTabList);
    this.tabObjDetails = _.find(this.userTabList, (x: any) => x.id === tabId);
    // console.log('this.tabObjDetails: ', this.tabObjDetails);
    // console.log('this.tabObjDetails.roleIds: ', this.tabObjDetails.roleIds.toString());
    this.isColumnShow(this.tabObjDetails.columns);
    this.isExcelColumnShow(this.tabObjDetails.excelColumns);
    this.getUserList();
    this.isAddButtonView(this.userRoleId);
    if (this.tabObjDetails && this.tabObjDetails.roleIds) {
      this.userRoleDropdownList = [];
      this.tabObjDetails.roleIds.split(',').forEach(element => {
        this.userRoleDropdownList.push(_.find(Constants.RoleMaster, (x: any) => x.id == element));
      });
    }
    // this.userRoleDropdownList = CommonUserList.getDropDownLoadListBy(this.userRoleId, tabId);
  }

  isColumnShow(columns) {

    this.isViewUserNameColumn = false;
    this.isViewRoleColumn = false;
    this.isViewEmailColumn = false;
    this.isViewMobileColumn = false;
    this.isViewOrgColumn = false;
    this.isViewDepartmentColumn = false;
    this.isViewDistrictColumn = false;
    this.isViewBranchNameColumn = false;
    this.isViewCityColumn = false;
    this.isViewStatusColumn = false;
    this.isViewViewColumn = false;
    this.isViewEditColumn = false;
    this.isViewLockColumn = false;
    this.isViewResetPasswordColumn = false;

    columns.forEach(element => {
      switch (element) {
        case Constants.userMgmtColumns.USER_NAME.name:
          this.isViewUserNameColumn = true;
          break;
        case Constants.userMgmtColumns.ROLE.name:
          this.isViewRoleColumn = true;
          break;
        case Constants.userMgmtColumns.EMAIL.name:
          this.isViewEmailColumn = true;
          break;
        case Constants.userMgmtColumns.MOBILE.name:
          this.isViewMobileColumn = true;
          break;
        case Constants.userMgmtColumns.ORG.name:
          this.isViewOrgColumn = true;
          break;
        case Constants.userMgmtColumns.DEPARTMENT.name:
          this.isViewDepartmentColumn = true;
          break;
        case Constants.userMgmtColumns.DISTRICT.name:
          this.isViewDistrictColumn = true;
          break;
        case Constants.userMgmtColumns.BRANCHNAME.name:
          this.isViewBranchNameColumn = true;
          break;
        case Constants.userMgmtColumns.CITY.name:
          this.isViewCityColumn = true;
          break;
        case Constants.userMgmtColumns.STATUS.name:
          this.isViewStatusColumn = true;
          break;
        case Constants.userMgmtColumns.ISVIEW.name:
          this.isViewViewColumn = true;
          break;
        case Constants.userMgmtColumns.ISEDIT.name:
          this.isViewEditColumn = true;
          break;
        case Constants.userMgmtColumns.ISLOCK.name:
          this.isViewLockColumn = true;
          break;
        case Constants.userMgmtColumns.RESET_PASSWORD.name:
          this.isViewResetPasswordColumn = true;
          break;
        default:
          break;
      }
    });
  }

  isExcelColumnShow(excelColumns) {
    this.isViewUserNameExcelColumn = false;
    this.isViewRoleExcelColumn = false;
    this.isViewEmailExcelColumn = false;
    this.isViewMobileExcelColumn = false;
    this.isViewOrgExcelColumn = false;
    this.isViewDepartmentExcelColumn = false;
    this.isViewDistrictExcelColumn = false;
    this.isViewBranchNameExcelColumn = false;
    this.isViewCityExcelColumn = false;
    this.isViewStatusExcelColumn = false;
    this.isViewViewExcelColumn = false;
    this.isViewEditExcelColumn = false;
    this.isViewLockExcelColumn = false;
    this.isViewResetPasswordExcelColumn = false;

    excelColumns.forEach(element => {
      switch (element) {
        case Constants.userMgmtColumns.USER_NAME.name:
          this.isViewUserNameExcelColumn = true;
          break;
        case Constants.userMgmtColumns.ROLE.name:
          this.isViewRoleExcelColumn = true;
          break;
        case Constants.userMgmtColumns.EMAIL.name:
          this.isViewEmailExcelColumn = true;
          break;
        case Constants.userMgmtColumns.MOBILE.name:
          this.isViewMobileExcelColumn = true;
          break;
        case Constants.userMgmtColumns.ORG.name:
          this.isViewOrgExcelColumn = true;
          break;
        case Constants.userMgmtColumns.DEPARTMENT.name:
          this.isViewDepartmentExcelColumn = true;
          break;
        case Constants.userMgmtColumns.DISTRICT.name:
          this.isViewDistrictExcelColumn = true;
          break;
        case Constants.userMgmtColumns.BRANCHNAME.name:
          this.isViewBranchNameExcelColumn = true;
          break;
        case Constants.userMgmtColumns.CITY.name:
          this.isViewCityExcelColumn = true;
          break;
        case Constants.userMgmtColumns.STATUS.name:
          this.isViewStatusExcelColumn = true;
          break;
        case Constants.userMgmtColumns.ISVIEW.name:
          this.isViewViewExcelColumn = true;
          break;
        case Constants.userMgmtColumns.ISEDIT.name:
          this.isViewEditExcelColumn = true;
          break;
        case Constants.userMgmtColumns.ISLOCK.name:
          this.isViewLockExcelColumn = true;
          break;
        case Constants.userMgmtColumns.RESET_PASSWORD.name:
          this.isViewResetPasswordExcelColumn = true;
          break;
        default:
          break;
      }
    });
  }

  clearSearchFilter() {
    this.intialTotalCount = -1;
    this.searchEmail = undefined;
    this.searchMobile = undefined;
    this.searchOrgName = undefined;
    this.searchUserName = undefined;
    this.searchUserRoleId = undefined;
    this.searchStatus = undefined;
    this.searchBranchName = undefined;
    this.searchDistrict = undefined;
    this.searchCityName = undefined;
  }

  getUserList(onPageChangeFlag?) {
    if (!onPageChangeFlag) {
      this.resetStartIndex();
    }
    const data = { filterJSON: this.rquestJson(), paginationFROM: this.startIndex, paginationTO: this.pageSize }
    this.tnService.getUserList(data).subscribe(res => {
      if (res && res.data && !isEmpty(res.data)) {
        this.bankUserList = [];
        this.bankUserList = res.data;
        this.totalCount = res.data[0].totalCount;
      } else {
        this.bankUserList = [];
        this.totalCount = 0;
      }
      if (this.intialTotalCount == -1) {
        this.intialTotalCount = this.totalCount;
      }
    });
  }

  isAddButtonView(userRoleId): void {
    this.isAddUserButtonShow = true;
    if (userRoleId === Constants.UserRoleList.SUPER_ADMIN.id) {
      this.isAddUserButtonShow = !(this.tab == 1);
    }
  }

  resetStartIndex(): void {
    this.startIndex = 0;
    this.page = 1;
  }

  rquestJson() {
    const filterJSON = {
      roleIds: this.searchUserRoleId ? this.searchUserRoleId.toString() : this.tabObjDetails.roleIds ? this.tabObjDetails.roleIds.toString() : undefined, // CommonUserList.getTabWiseRoleIdList(this.userRoleId, this.tab),
      tabId: this.tab ? this.tab.toString() : undefined,
      userRoleId: this.userRoleId ? this.userRoleId.toString() : undefined,
      queryType: this.tabObjDetails.queryType,
      userOrgId: this.tabObjDetails?.orgIdList ? this.tabObjDetails.orgIdList : undefined,
      searchEmail: this.searchEmail ? this.searchEmail : undefined,
      searchMobile: this.searchMobile ? this.searchMobile : undefined,
      searchOrgName: this.searchOrgName ? this.searchOrgName : undefined,
      searchUserName: this.searchUserName ? this.searchUserName : undefined,
      searchStatus: this.searchStatus ? ((this.searchStatus == 1) ? true : false) : undefined,
      searchBranchName: this.searchBranchName ? this.searchBranchName : undefined,
      searchDistrict: this.searchDistrict ? this.searchDistrict : undefined,
      searchCityName: this.searchCityName ? this.searchCityName : undefined,
      // searchUserRoleId: this.searchUserRoleId ? this.searchUserRoleId : undefined,
    };
    // console.log('filterJSON: ', filterJSON);
    return filterJSON;
  }

  downloadAllUser() {
    const data = { filterJSON: this.rquestJson(), paginationFROM: 0, paginationTO: this.totalCount }
    this.tnService.getUserList(data).subscribe(res => {
      if (res && res.data && !isEmpty(res.data)) {
        this.downloadDataInExcel(res.data);
      }
    });
  }

  downloadDataInExcel(excelData) {
    let downloadData = [];
    const fileName = 'Bank User List' + '.xlsx';
    excelData.forEach((element, i) => {
      const index = i + 1;
      element.signupDate = this.datePipe.transform(element.signupDate, 'dd/MM/y');
      let allUser = [{
        'Sr no': index,
        ...(this.isViewUserNameExcelColumn && { 'Name': element.userName || '' }),
        ...(this.isViewRoleExcelColumn && { 'Role': element.roleName || '' }),
        // ...(this.tab !=3 && this.tab !=4 && this.tab != 5 && this.tab != 6 && element.roleName != 'Branch Manager' && { 'Bank Name': element.orgName ||'' }),
        ...(this.isViewOrgExcelColumn && { 'Bank Name': element.orgName || '' }),
        ...(this.isViewEmailExcelColumn && { 'Email': element.email || '' }),
        ...(this.isViewMobileExcelColumn && { 'Mobile No': element.mobile || '' }),
        ...(this.isViewLockExcelColumn && { 'Locked': (element.isLocked ? 'Yes' : 'No') || '' }),
        ...(this.isViewStatusExcelColumn, { 'Status': (element.isActive ? 'Active' : 'InActive') || '' }),
        ...(this.isViewDepartmentExcelColumn && { 'Department': element.orgName || '' }),
        ...(this.isViewDistrictExcelColumn && { 'District': element.discrictName || '' }),
        ...(this.isViewBranchNameExcelColumn && { 'Branch Name': element.branchName || '' }),
      }];
      downloadData = downloadData.concat(allUser);
    });
    alasql('SELECT * INTO XLSX("' + fileName + '",{headers:true}) FROM ?', [downloadData]);
  }

  isUserLocked(userId) {
    this.tnService.isUserLocked({ userId: userId }).subscribe(res => {
      this.commonService.successSnackBar(res.message);
      this.getUserList();
    });
  }

  // Common_Tranfer_Proposal_Popup() {
  //   const config = {
  //     windowClass: 'Mediam-model',
  //     size: 'md'
  //   };
  //   const modalRef = this.modalService.open(BMFIOCommonProposalComponent, config);
  //   return modalRef;
  // }
  // Reason_View_Popup() {
  //   const config = {
  //     windowClass: 'Mediam-model',
  //     size: 'md'
  //   };
  //   const modalRef = this.modalService.open(BMFIOReasonComponent, config);
  //   return modalRef;
  // }

  LockUser_Popup(userId, emailId, isLocked) {
    const config = {
      windowClass: 'Mediam-model',
      size: 'md'
    };
    // const modalRef = this.modalService.open(CommonLockUserComponent, config);

    const objData = { userId: userId, emailId: emailId, isLocked: isLocked };
    this.commonService.openPopUp(objData, CommonLockUserComponent, false, config).result.then(result => {
      if (result && result == 'ok') {
        this.getUserList();
      }
    });
    return null;
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



  // date picker js

  // onDateSelection(date: any) {
  //   this.fromNGDate = date;
  // }

  // onDateSelectionRange(date: NgbDate) {
  //   if (!this.dateRangeFromDate && !this.dateRangeToDate) {
  //     this.fromNGDate = date;
  //     this.dateRangeFromDate = new Date(date.year, date.month - 1, date.day);
  //     this.selected = '';
  //   } else if (this.dateRangeFromDate && !this.dateRangeToDate && date.after(this.fromNGDate)) {
  //     this.toNGDate = date;
  //     this.dateRangeToDate = new Date(date.year, date.month - 1, date.day);
  //     this.hidden = true;
  //     // this.selected = this.dateRangeFromDate.toLocaleDateString() + '-' + this.dateRangeToDate.toLocaleDateString();
  //     this.selected = this.datePipe.transform(this.dateRangeFromDate, 'dd/MM/y') + '-' + this.datePipe.transform(this.dateRangeToDate, 'dd/MM/y');
  //   } else {
  //     this.fromNGDate = date;
  //     this.dateRangeFromDate = new Date(date.year, date.month - 1, date.day);
  //     this.selected = '';
  //   }
  // }

  /**
   * Is hovered over date
   * @param date date obj
   */
  // isHovered(date: NgbDate) {
  //   return this.fromNGDate && !this.toNGDate && this.hoveredDate && date.after(this.fromNGDate) && date.before(this.hoveredDate);
  // }

  // /**
  //  * @param date date obj
  //  */
  // isInside(date: NgbDate) {
  //   return date.after(this.fromNGDate) && date.before(this.toNGDate);
  // }

  // /**
  //  * @param date date obj
  //  */
  // isRange(date: NgbDate) {
  //   return date.equals(this.fromNGDate) || date.equals(this.toNGDate) || this.isInside(date) || this.isHovered(date);
  // }

  // reDirectToAddUser(tabId) {
  //   this.router.navigate([Constants.ROUTE_URL.ADD_OR_UPDATE_USER], { queryParams: { tabId: this.commonService.setURLData(tabId) } });
  // }

  isRedirectForEdit(tabId, userObj?, requestMode?) {
    const redirectTabId = (requestMode == 2 || requestMode == 3) ? CommonUserList.getSingleTabIdFromUserListRole(this.userRoleId, userObj.userRoleId) : tabId;
    this.router.navigate([Constants.ROUTE_URL.ADD_OR_UPDATE_USER], { queryParams: { tabId: this.commonService.setURLData(redirectTabId), userId: (userObj && userObj.userId) ? this.commonService.setURLData(userObj.userId) : undefined, isViewMode: (requestMode == 2) ? this.commonService.setURLData('true') : undefined } });
  }

  isRedirectForBulkUpload(tabId, roleName) {
    if(this.userRoleId ==Constants.UserRoleList.SUPER_ADMIN.id ){
      this.router.navigate([Constants.ROUTE_URL.BRANCH_UPLOAD_USER],
        { queryParams: { tabId: this.commonService.setURLData(tabId), roleName: this.commonService.setURLData(roleName) } });
    }else if(this.userRoleId ==Constants.UserRoleList.BRANCH_MANAGER.id ){
      this.router.navigate([Constants.ROUTE_URL.BULK_UPLOAD_FIO],
        { queryParams: { tabId: this.commonService.setURLData(tabId), roleName: this.commonService.setURLData(roleName) } });
    }
    
  }

  getAdminConfigs() {
    this.tnService.getAdminConfig(this.userId).subscribe(success => {

      if (success && success.status && success.data) {
        this.isEnabledTransfer = success.data.isEnableTransfer;
        return;
      }
      this.commonService.warningSnackBar("Failed to get admin configs");
    }, error => {
      this.commonService.warningSnackBar("Failed to get admin configs");
    });
  }


  Common_Tranfer_Proposal_Popup() {
    const config = {
      windowClass: 'Mediam-model',
      size: 'md'
    };
    const modalRef = this.modalService.open(BMFIOCommonProposalComponent, config);
    return modalRef;
  }


  enableTransfer() {
    const config = {
      windowClass: 'Mediam-model',
      size: 'md'
    };
    const modalRef = this.modalService.open(BMFIOCommonProposalComponent, config);
    modalRef.closed.subscribe(result => {
      if (result != null && result != undefined && result == 1) {
        // console.log(result);
        let request = {
          userId: this.userId,
          isEnableTransfer: true
        }
        this.tnService.enableTransfer(request).subscribe(success => {
          if (success && success.status == 200) {
            this.isEnabledTransfer = true;
            this.commonService.successSnackBar("Transfer enabled succesfully");
            return;
          }
          this.commonService.warningSnackBar("Failed to enable transfer");
        }, error => {
          this.commonService.warningSnackBar("Failed to enable transfer");
        })
      }
    });
  }
}
