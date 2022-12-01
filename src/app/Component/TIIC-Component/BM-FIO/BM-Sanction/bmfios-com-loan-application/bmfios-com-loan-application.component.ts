import { DatePipe } from '@angular/common';
import { Component, HostListener, OnInit } from '@angular/core';
import { CommonMethods } from 'src/app/CommoUtils/common-services/common-methods';
import { CommonService } from 'src/app/CommoUtils/common-services/common.service';
import { TnService } from 'src/app/services/tn.service';
import { CountsData, ProposalDetails, SearchFilterJson, DownLoadDataJson, TitleChange } from './bmfios-com-loan-application.module';
import * as _ from 'lodash';
import alasql from 'alasql';
import { Router } from '@angular/router';
import { Constants } from 'src/app/CommoUtils/constants';

declare var jQuery: any;
declare var $: any;


@Component({
  selector: 'app-bmfios-com-loan-application',
  templateUrl: './bmfios-com-loan-application.component.html',
  styleUrls: ['./bmfios-com-loan-application.component.scss']
})
export class BMFIOSComLoanApplicationComponent implements OnInit {

  tabTitle: any = {};
  breadCrumbItems: Array<{}>;
  tab: number = 1;
  SubTab: number = 7;
  SubTabContShow: any

  // page number
  page = 1;
  // default page size
  pageSize = 10;
  // start and end index
  startIndex = 1;
  // endIndex = 10;
  totalSize = 0;
  totalCount = 0;
  PageSelectNumber: number[];
  dateRangeFromDate;
  dateRangeToDate;

  countsData = new CountsData();
  proposalDetailsList = new Array<ProposalDetails>();

  searchFilterJson = new SearchFilterJson();
  debounceEventForFilter = _.debounce(() => this.getStatusList(), 500, {});
  isBMLogin = false;

  constructor(private commonService: CommonService,
    private router: Router,
    private commonMethod: CommonMethods,
    private datePipe: DatePipe,
    private tnService: TnService) {
    this.commonService.DropDownjquery();
    this.commonService.DropDownNOTwojquery();
  }

  ngOnInit(): void {
    const roleId = CommonService.getStorage(Constants.httpAndCookies.ROLEID, true);
    if (roleId != Constants.UserRoleList.FIELD_INSPECTION_OFFICER.id) {
      this.isBMLogin = true;
    }
    this.breadCrumbItems = [{ label: 'Dashboard', path: '/', active: true }];
    this.PageSelectNumber = [5, 10, 25, 50, 100];

    if (!CommonService.isObjectNullOrEmpty(CommonService.getStorage(Constants.httpAndCookies.BM_FIO_DASHBOARD_TAB, true))) {
      this.tab = +CommonService.getStorage(Constants.httpAndCookies.BM_FIO_DASHBOARD_TAB, true);
      if ((this.tab == 1) && !CommonService.isObjectNullOrEmpty(CommonService.getStorage(Constants.httpAndCookies.BM_FIO_DASHBOARD_SUB_TAB, true))) {
        this.SubTab = +CommonService.getStorage(Constants.httpAndCookies.BM_FIO_DASHBOARD_SUB_TAB, true);
      } else {
        this.SubTab = undefined;
      }
    } else {
      this.SubTab = 7;
    }
    
    this.getTabCounts();
  }

  getTabCounts() {
    // get tab count api
    this.tnService.spGetSanctionTabCount().subscribe(res => {
      if (res && res.data) {
        this.countsData = res.data;
        this.countsData.dropdownList = CommonService.parseData(this.countsData.dropdownList);
        this.changeTab(this.tab, this.SubTab);
      }
    });
  }

  getStatusList(onPageChangeFlag?, isDownloadData?): void {
    if (!onPageChangeFlag) {
      this.resetStartIndex();
    }
    // const filterJSON: any = {};
    const filterJSON: any = _.cloneDeep(this.searchFilterJson);
    const list = ['searchApplicantName', 'searchEmailOrMobile', 'statusId', 'searchFio', 'searchLbm', 'searchGm', 'proposalDate', 'pendingWithId', 'disbursedDate', 'disbursedAmount', 'reason', 'rejectHoldDate'];
    list.forEach(element => {
      if(filterJSON[element] == null || filterJSON[element] == undefined || filterJSON[element] == "") {
        filterJSON[element] = undefined;
      }
    });
    filterJSON.tabValue = this.tab == 1 ? this.SubTab : this.tab;
    filterJSON.proposalDate = filterJSON.proposalDate ? this.getFormatedDate(filterJSON.proposalDate) : undefined;
    filterJSON.disbursedDate = filterJSON.disbursedDate ? this.getFormatedDate(filterJSON.disbursedDate) : undefined;
    filterJSON.rejectHoldDate = filterJSON.rejectHoldDate ? this.getFormatedDate(filterJSON.rejectHoldDate) : undefined;
    filterJSON.fromDate = this.dateRangeFromDate ? this.getFormatedDate(this.dateRangeFromDate) : undefined;
    filterJSON.toDate = this.dateRangeToDate ? this.getFormatedDate(this.dateRangeToDate) : undefined;
    filterJSON.paginationFROM = this.startIndex;
    filterJSON.paginationTO = isDownloadData ? this.totalCount : this.pageSize;
    this.tnService.spGetSanctionList(filterJSON).subscribe(res => {
      this.proposalDetailsList = [];
      this.totalCount = 0;
      if (res && res.data && res.status == 200 && res.flag) {
        this.proposalDetailsList = res.data;
        this.totalCount = res.data[0]?.totalCount;
        // this.proposalDetailsList.forEach(element => {
          // if (element.statusId) {
          //   const status = _.find(this.searchFilterJson.statusList, { statusId: element.statusId });
          //   element.status = status?.displayName;
          // }
          // if (element.pendingWithId) {
          //   element.pendingWith = _.find(this.searchFilterJson.pendingWithList, { id: element.pendingWithId })?.name;
          // }
        // });
        if (isDownloadData) {
          this.downloadDataInExcel(this.proposalDetailsList);
        }
      } else {
        if (res) {
          this.commonMethod.errorSnackBar(res?.message ? res.message : 'Something went wrong while getting application list.');
        }
      }
    });
  }

  downloadDataInExcel(excelData) {
    let downloadData = [];
    const fileName = 'All-Field-Specifications' + '.xlsx';
    excelData.forEach((element, i) => {
      const allStatusFields: any = [];
      allStatusFields.push(new DownLoadDataJson(this.datePipe).getJsonData(element, (i + 1), this.tab == 1 ? this.SubTab : this.tab, this.isBMLogin));
      downloadData = downloadData.concat(allStatusFields);
    });
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
  }

  //  This js On Window Scroll Top set Cont Dont Remove @Nikul
  changeTab(tabId: number, subTabId?) {
    CommonService.setStorage(Constants.httpAndCookies.BM_FIO_DASHBOARD_TAB,tabId);
    this.tabTitle = TitleChange.changeTitle(tabId);
    this.tab = tabId;
    if (subTabId) {
      this.SubTab = subTabId;
      CommonService.setStorage(Constants.httpAndCookies.BM_FIO_DASHBOARD_SUB_TAB, subTabId);
    } else {
      this.SubTab = null;
      CommonService.removeStorage(Constants.httpAndCookies.BM_FIO_DASHBOARD_SUB_TAB);
    }
    this.resetFilter();
    if(this.countsData.dropdownList) {
      // this.searchFilterJson.statusList = _.filter(this.countsData.dropdownList, {tabId: this.SubTab ? this.SubTab : this.tab});
      this.searchFilterJson.statusList = _.uniqBy(_.filter(this.countsData.dropdownList, (x:any) => (x.tabId == this.SubTab ? this.SubTab : this.tab) && x.displayName), 'displayName');
      const pendingWithList = _.filter(this.countsData.dropdownList, {tabId: this.SubTab ? this.SubTab : this.tab});
      if(pendingWithList?.length > 0) {
        this.searchFilterJson.pendingWithList = _.uniqBy(pendingWithList, 'pendingWith');
      }
    }
    this.commonService.DropDownNOTwojquery();
    this.getStatusList();
  }

  onPageChange(page: any): void {
    this.startIndex = (page - 1) * this.pageSize;
    // this.endIndex = (page - 1) * this.pageSize + this.pageSize;
    this.getStatusList(true);
  }

  navigateToDetailedView(data: any) {
    // if (!data.isViewed) {
    //   const data = {
    //     proposalId: data.proposalId,
    //     businessTypeId: this.businessTypeId,
    //     applicationId: data.applicationId,
    //   };
    //   this.eduProposalViewService.updateProposalViewFlag(data).subscribe(res => { });
    // }
    this.router.navigate([Constants.ROUTE_URL.BMFIOS_LOAN_APPLICATION_VIEW], {
      queryParams: {
        applicationId: this.commonService.setURLData(data.applicationId),
        borrowerProposalId: this.commonService.setURLData(data.borrowerProposalId),
        proposalId: this.commonService.setURLData(data.proposalId),
        statusId: this.commonService.setURLData(data.statusId),
        jobId: this.commonService.setURLData(data.sanctionFlowJobId),
        proposalMappingId: this.commonService.setURLData(data.proposalMappingId),
        districtId: this.commonService.setURLData(data.districtId)
      }
    });
  }

  resetFilter() {
    const restFilterList = ['searchApplicantName', 'searchEmailOrMobile', 'statusId', 'searchFio', 'searchLbm', 'searchGm', 'proposalDate', 'pendingWithId', 'disbursedDate', 'disbursedAmount', 'reason', 'rejectHoldDate'];
    restFilterList.forEach(element => {
      this.searchFilterJson[element] = undefined;
    });
  }
}

