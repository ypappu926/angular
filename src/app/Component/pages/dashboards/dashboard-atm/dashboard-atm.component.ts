import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import * as _ from 'lodash';
import { CommonService } from 'src/app/CommoUtils/common-services/common.service';
import { Constants } from 'src/app/CommoUtils/constants';
import { TnService } from 'src/app/services/tn.service';

@Component({
  selector: 'app-dashboard-atm',
  templateUrl: './dashboard-atm.component.html',
  styleUrls: ['./dashboard-atm.component.scss']
})
export class DashboardATMComponent implements OnInit {
  // bread crumb items
  // breadCrumbItems!: Array<{}>;

  tab!: number;
  request!: Request;
  isActive = false;
  activateTab!: number;
  selectedTabDetails: any;
  showSchemeList = false
  isTotalCountShow = false;

  dashboardBoxList: any = [];

  schemeList: any = [];
  businessType: any;
  userTypeId;
  userId: any;
  roleId: any;
  totalCount = 0;
  totalPendingCount = 0;
  headerName: any;

  constructor(private commonService: CommonService, private router: Router, private activatedRoute: ActivatedRoute, private tnService: TnService) {
  }

  ngOnInit(): void {
    this.activateTab = 0;
    this.getProductListByUserId();
  }

  getProductListByUserId() {
    this.tnService.getProductListByUserId().subscribe(res => {
      if (res && res.data) {
        this.dashboardBoxList = res.data;
        // console.log('this.dashboardBoxList: ', this.dashboardBoxList);
        this.showSchemeList = true;
        this.headerName = 'Select your Scheme';
        // console.log('this.schemeList: ', this.schemeList);
      }
    });
  }


  getDashBoardDataByUserId() {
    this.tnService.getDashBoardDataByUserId().subscribe(res => {
      if (res && res.data) {
        this.dashboardBoxList = JSON.parse(res.data);
        this.headerName = 'Select your Dashboard';
        this.showSchemeList = false;
        // console.log('this.dashboardBoxList: ', this.dashboardBoxList);
      }
    });
  }

  navigateOnSubmit(data, showSchemeList) {
    // console.log('data: ', data);
    if (showSchemeList) {
      CommonService.removeStorage(Constants.httpAndCookies.SCHEME_ID);
      CommonService.setStorage(Constants.httpAndCookies.SCHEME_ID, data.schemeId.toString());
      if (data.schemeId != 1) {
        this.router.navigate([data.routingPath]);
        // console.log('data.routingPath: ', data);
      } else {
        this.getDashBoardDataByUserId();
      }
    } else {
      CommonService.removeStorage(Constants.httpAndCookies.DASHBOARD_ID);
      CommonService.setStorage(Constants.httpAndCookies.DASHBOARD_ID, data.dashboardId.toString());
      this.router.navigate([data.routingPath]);
    }

  }

  activeClick(index: any, item: any) {
    this.activateTab = index;
    this.selectedTabDetails = item;
  }
}

