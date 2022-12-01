import { DatePipe } from '@angular/common';
import { Component, HostListener, OnInit } from '@angular/core';
import alasql from 'alasql';
import * as _ from 'lodash';
import { CommonMethods } from 'src/app/CommoUtils/common-services/common-methods';
import { CommonService } from 'src/app/CommoUtils/common-services/common.service';
import { TnService } from 'src/app/services/tn.service';
// import { DownLoadDataJson } from '../Committee/committee-com-loan-application/committee-com-loan-application.module';
import { DownLoadDataJson, SearchFilterJson } from './support-dashboard.module';

declare var jQuery: any;
declare var $: any;

@Component({
  selector: 'app-support-dashboard',
  templateUrl: './support-dashboard.component.html',
  styleUrls: ['./support-dashboard.component.scss']
})
export class SupportDashboardComponent implements OnInit {

  breadCrumbItems: Array<{}>;
  tab: number;
  feedbackList: any = [];
  startIndex = 1;
  totalCount = 0;
  pageSize = 10;
  page = 1;
  pageSelectNumber: number[];
  debounceEventForFilter = _.debounce(() => this.getFeedBackList(), 500, {});
  searchFilterJson = new SearchFilterJson();

  constructor(private commonService: CommonService, private tnService: TnService, private commonMethod: CommonMethods, private datePipe: DatePipe) { }

  ngOnInit(): void {
    this.breadCrumbItems = [{ label: 'Dashboard', path: '/supportDashboard' }, { label: 'FeedBack', path: '/', active: true }];

    this.pageSelectNumber = [2, 5, 10, 25, 50, 100];
    this.tab = 1;
    this.changeTab(this.tab);

    this.onloadJqueryMObile();
    this.getFeedBackList();

  }

  onPageChange(page: any): void {
    this.startIndex = (page - 1) * this.pageSize;
    // this.endIndex = (page - 1) * this.pageSize + this.pageSize;
    this.getFeedBackList(true);
  }

  resetStartIndex(): void {
    this.startIndex = 0;
    this.page = 1;
  }

  getFeedBackList(onPageChangeFlag?, isDownloadData?) {
    if (!onPageChangeFlag) {
      this.resetStartIndex();
    }
    const filterJSON: any = _.cloneDeep(this.searchFilterJson);
    ['searchBorrowerName', 'searchMobileNo', 'searchAlternateMobileNo', 'searchCreatedDate', 'searchRemarks'].forEach(element => {
      if (filterJSON[element] == null || filterJSON[element] == undefined || filterJSON[element] == "") {
        filterJSON[element] = undefined;
      }
    });
    filterJSON.searchCreatedDate = filterJSON.searchCreatedDate ? this.getFormatedDate(filterJSON.searchCreatedDate) : undefined;
    filterJSON.paginationFROM = this.startIndex;
    filterJSON.paginationTO = isDownloadData ? this.totalCount : this.pageSize;

    // console.log('filterJSON: ', filterJSON);
    this.tnService.getFeedBackList(filterJSON).subscribe(res => {
      if (res && res.data && res.status == 200) {
        // console.log('res.data: ', res.data);
        if (isDownloadData) {
          this.downloadDataInExcel(res.data);
        } else {
          this.feedbackList = res.data;
          this.totalCount = res.data[0]?.totalCount || 0;
        }
      } else {
        this.feedbackList = [];
        this.totalCount = 0;
      }
    });
  }

  downloadDataInExcel(excelData) {
    let downloadData = [];
    const fileName = 'Feedback_List.xlsx';
    excelData.forEach((element, i) => {
      downloadData = downloadData.concat(new DownLoadDataJson(this.datePipe).getJsonData(element, (i + 1)));
    });
    alasql('SELECT * INTO XLSX("' + fileName + '",{headers:true}) FROM ?', [downloadData]);
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

  onloadJqueryMObile() {
    // this.OnloadJqueryMObile();
    (function ($) {
      $(window).resize(function () {
        // this.OnloadJqueryMObile();
        OnloadJqueryMObile_onInit();
      });
    })(jQuery);
    function OnloadJqueryMObile_onInit() {
      const width = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
      if (width < 1024) {
        this.commonService.DropDownjquery();
        return true;
      } else {
        return false;
      }
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
    // console.log(parentwidth);
  }

  //  This js On Window Scroll Top set Cont Dont Remove @Nikul
  changeTab(tabId: number) {
    this.tab = tabId;
  }
}

