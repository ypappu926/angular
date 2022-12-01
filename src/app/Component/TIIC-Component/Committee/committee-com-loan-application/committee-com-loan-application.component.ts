import { DatePipe } from '@angular/common';
import { Component, HostListener, OnInit } from '@angular/core';
import alasql from 'alasql';
import { CommonMethods } from 'src/app/CommoUtils/common-services/common-methods';
import { CommonService } from 'src/app/CommoUtils/common-services/common.service';
import { TnService } from 'src/app/services/tn.service';
import * as _ from 'lodash';
import { CountsData, DownLoadDataJson, ProposalDetails, SearchFilterJson, TitleChange } from './committee-com-loan-application.module';
import { Constants } from 'src/app/CommoUtils/constants';
import { Router } from '@angular/router';

declare var jQuery: any;
declare var $: any;

@Component({
  selector: 'app-committee-com-loan-application',
  templateUrl: './committee-com-loan-application.component.html',
  styleUrls: ['./committee-com-loan-application.component.scss']
})
export class CommitteeComLoanApplicationComponent implements OnInit {


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

  breadCrumbItems: Array<{}>;
  tab: number = 1;
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

  PageSelectNumber: string[];
  dateRangeFromDate;
  dateRangeToDate;
  isLBMLogin = false;
  countsData = new CountsData();
  proposalDetailsList = new Array<ProposalDetails>();
  searchFilterJson = new SearchFilterJson();
  debounceEventForFilter = _.debounce(() => this.getStatusList(), 500, {});
  tabTitle: any = {};

  constructor(private commonService: CommonService, private commonMethod: CommonMethods, private tnService: TnService, private datePipe: DatePipe, private router: Router) {
    this.commonService.DropDownjquery();
    this.commonService.DropDownNOTwojquery();
  }

  ngOnInit(): void {
    this.breadCrumbItems = [{ label: 'Dashboard', path: '/', active: true }];
    this.PageSelectNumber = ['5', '10', '25', '50', '100'];
    const roleId = CommonService.getStorage(Constants.httpAndCookies.ROLEID, true);
    if (roleId == Constants.UserRoleList.LEAD_BANK_MANAGER.id) {
      this.isLBMLogin = true;
    }
    if(!CommonService.isObjectNullOrEmpty(CommonService.getStorage(Constants.httpAndCookies.LBM_GM_DASHBOARD_SUB_TAB,true))){
      this.tab = +CommonService.getStorage(Constants.httpAndCookies.LBM_GM_DASHBOARD_SUB_TAB,true);
    }
    this.getTabCounts();
  }

  getTabCounts() {
    // get tab count api
    this.tnService.spGetSanctionTabCountForLbmGm().subscribe(res => {
      if (res && res.data) {
        this.countsData = res.data
        this.countsData.dropdownList = CommonService.parseData(this.countsData.dropdownList);
        this.changeTab(this.tab);
      }
    });
  }

  //  This js On Window Scroll Top set Cont Dont Remove @Nikul
  changeTab(tabId: number) {
    CommonService.setStorage(Constants.httpAndCookies.LBM_GM_DASHBOARD_SUB_TAB,tabId);
    this.tabTitle = TitleChange.changeTitle(tabId);
    this.tab = tabId;
    const data: any = {};
    this.isLBMLogin ? data.lbmTab = this.tab : data.gmTab = this.tab;

    // this.searchFilterJson.statusList = _.cloneDeep(_.filter(Constants.SanctionDashboardStatusMaster, data));
    if(this.countsData.dropdownList) {
      this.searchFilterJson.statusList = _.uniqBy(_.filter(this.countsData.dropdownList, (x:any) => (x.tabId== this.tab) && x.displayName), 'displayName');
      // console.log(_.uniqBy(this.searchFilterJson.statusList, 'displayName'));
      // const pendingWithList = _.filter(this.countsData.dropdownList, {tabId: this.SubTab ? this.SubTab : this.tab});
      // if(pendingWithList?.length > 0) {
      //   this.searchFilterJson.pendingWithList = _.uniqBy(pendingWithList, 'pendingWith');
      // }
    }


    this.commonService.DropDownNOTwojquery();
    this.resetFilter();
    this.getStatusList();
  }

  onPageChange(page: any): void {
    this.startIndex = (page - 1) * this.pageSize;
    // this.endIndex = (page - 1) * this.pageSize + this.pageSize;
  }

  resetFilter() {
    const restFilterList = ['searchApplicantName' ,'searchEmailOrMobile' ,'searchbm' ,'meetingDate' ,'proposalDate' ,'statusId' ,'sanctionedDate' ,'disbursedDate' ,'disbursedAmount' ,'reason' ,'rejectHoldDate'];
    restFilterList.forEach(element => {
      this.searchFilterJson[element] = undefined;
    });
  }

  getStatusList(onPageChangeFlag?, isDownloadData?): void {
    if (!onPageChangeFlag) {
      this.resetStartIndex();
    }
    // const filterJSON: any = {};
    const filterJSON: any = _.cloneDeep(this.searchFilterJson);
    const list = ['searchApplicantName' ,'searchEmailOrMobile' ,'searchbm' ,'meetingDate' ,'proposalDate' ,'statusId' ,'sanctionedDate' ,'disbursedDate' ,'disbursedAmount' ,'reason' ,'rejectHoldDate'];
    list.forEach(element => {
      if (filterJSON[element] == null || filterJSON[element] == undefined || filterJSON[element] == "") {
        filterJSON[element] = undefined;
      }
    });
    filterJSON.tabValue = this.tab;
    filterJSON.proposalDate = filterJSON.proposalDate ? this.getFormatedDate(filterJSON.proposalDate) : undefined;
    filterJSON.meetingDate = filterJSON.meetingDate ? this.getFormatedDate(filterJSON.meetingDate) : undefined;
    filterJSON.disbursedDate = filterJSON.disbursedDate ? this.getFormatedDate(filterJSON.disbursedDate) : undefined;
    filterJSON.rejectHoldDate = filterJSON.rejectHoldDate ? this.getFormatedDate(filterJSON.rejectHoldDate) : undefined;
    filterJSON.fromDate = this.dateRangeFromDate ? this.getFormatedDate(this.dateRangeFromDate) : undefined;
    filterJSON.toDate = this.dateRangeToDate ? this.getFormatedDate(this.dateRangeToDate) : undefined;
    filterJSON.paginationFROM = this.startIndex;
    filterJSON.paginationTO = isDownloadData ? this.totalCount : this.pageSize;
    this.tnService.spGetSanctionListForLbmGm(filterJSON).subscribe(res => {
      this.proposalDetailsList = [];
      this.totalCount = 0;
      if (res && res.data && res.status == 200 && res.flag) {
        this.proposalDetailsList = res.data;
        // this.proposalDetailsList.forEach(element => {
        //   if (element.statusId) {
        //     const status = _.find(this.searchFilterJson.statusList, { id: element.statusId });
        //     if (this.isLBMLogin) {
        //       element.status = status?.lbmDisplayName;
        //     } else {
        //       element.status = status?.gmDisplayName;
        //     }
        //   }
        // });
        this.totalCount = res.data[0]?.totalCount || 0;
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

  downloadDataInExcel(excelData) {
    let downloadData = [];
    const fileName = 'All-Field-Specifications' + '.xlsx';
    excelData.forEach((element, i) => {
      const allStatusFields: any = [];
      allStatusFields.push(new DownLoadDataJson(this.datePipe).getJsonData(element, (i + 1), this.tab, null));
      downloadData = downloadData.concat(allStatusFields);
    });
    alasql('SELECT * INTO XLSX("' + fileName + '",{headers:true}) FROM ?', [downloadData]);
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
        jobId: this.commonService.setURLData(data.sanctionFlowJobId),
        statusId: this.commonService.setURLData(data.statusId),
        proposalMappingId: this.commonService.setURLData(data.proposalMappingId)

      }
    });
  }

  public copyToClipBoard(data) {
    if (data) {
      document.addEventListener('copy', (e: ClipboardEvent) => {
        e.clipboardData.setData('text/plain', data);
        e.preventDefault();
        document.removeEventListener('copy', null);
      });
      document.execCommand('copy');
      this.commonService.successSnackBar("Link Copied");
    }
    else {
      this.commonService.warningSnackBar("data not Found")
    }
  }
}