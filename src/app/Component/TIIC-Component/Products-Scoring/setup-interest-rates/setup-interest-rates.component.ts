import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { NgbModal, NgbModalConfig } from '@ng-bootstrap/ng-bootstrap';
import * as _ from 'lodash';
import * as moment from 'moment';
import { staticNever } from 'rxjs-compat/add/observable/never';
import { CommonService } from 'src/app/CommoUtils/common-services/common.service';
import { Constants } from 'src/app/CommoUtils/constants';
import { ComREPOMCLRComponent } from 'src/app/Popup/Product-Scoring/com-repo-mclr/com-repo-mclr.component';
import { ProductService } from 'src/app/services/product.service';
import { ScoringService } from 'src/app/services/scoring.service';


@Component({
  selector: 'app-setup-interest-rates',
  templateUrl: './setup-interest-rates.component.html',
  styleUrls: ['./setup-interest-rates.component.scss'],
  providers: [DatePipe]
})
export class SetupInterestRatesComponent implements OnInit {

  tab: any;
  isActive = false;
  // bread crumb data
  breadCrumbItems!: Array<{}>;
  selectValue!: string[];
  roleIds: any = [];
  actionButtons: any = [];
  jobId: any;
  userRoleId: any;
  isAdminMaker = false;
  isAdminChecker = false;
  isPendingAtChecker = false;
  isPendingAtMaker = false;
  isApproveDisable: Boolean = false;
  isSendBackByChecker = false;
  sendBackBychecker: any = {};
  baseRateDetails: any = {};
  allBaseRateDetails: any = [];
  businessTypeId: number=1;
  showHistory = true;
  userPermissionList: any = [];

  schemeId: number=9;
  routeMainPath!: any;
  currentBaseRate: any;

  minDate = new Date();
  minTime: any;
  todayTime: any;

  messege = "Since the Interest rate was not approved by the Admin Checker within the time limit it has been sent back to Admin Maker to be reforwarded."

  constructor(public NPconfig: NgbModalConfig, private modalService: NgbModal, private scoringService: ScoringService,
    private datePipe: DatePipe, private commonService: CommonService, private productService: ProductService) {
    NPconfig.backdrop = 'static';
    this.userPermissionList = _.split(CommonService.getStorage('UserPermission', true), ',');
    this.routeMainPath = CommonService.getCurrentPath();

    this.todayTime = new Date().toLocaleTimeString('en-US', { hour: 'numeric', hour12: true, minute: 'numeric' })
    this.minTime = this.todayTime;
  }

  ngOnInit(): void {
    this.breadCrumbItems = [{ label: 'Dashboard', path: this.routeMainPath + '/dashboard' }, { label: 'Setup Interest Rates', path: this.routeMainPath + '/base-rate-setup' }];
    this.selectValue = ['Alaska', 'Hawaii', 'California', 'Nevada', 'Oregon', 'Washington', 'Arizona', 'Colorado', 'Idaho', 'Montana', 'Nebraska', 'New Mexico', 'North Dakota', 'Utah', 'Wyoming', 'Alabama', 'Arkansas', 'Illinois', 'Iowa'];
    // tabs
    this.tab = 1;
    this.roleIds.push();
    this.userRoleId =CommonService.getStorage(Constants.httpAndCookies.ROLEID, true);
    this.isAdminChecker = (this.userRoleId == 3);
    this.isAdminMaker = (this.userRoleId == 2);
    // this.businessTypeId = Number(CommonService.getStorage(Constants.httpAndCookies.BUSINESS_TYPE_ID, true));

    this.changeTab(this.tab);
    let d = new Date('21-04-2021 5:11:00 PM');
    var datestring = d.getDate() + "-" + (d.getMonth() + 1) + "-" + d.getFullYear() + " " +
      d.getHours() + ":" + d.getMinutes();
    // console.log(datestring);
  }
  changeTab(tabId: number) {
    this.tab = tabId;
    this.isPendingAtChecker = false;
    this.isPendingAtMaker = false;
    this.isSendBackByChecker = false;
    this.isApproveDisable = false;
    let req = { businessTypeId: this.businessTypeId, baseRateTypeId: this.tab, status: ((this.isAdminChecker) ? 2 : 1), schemeId: this.schemeId };
    this.getAllBaseRateDetails(req);
    
  }

  checkButtonPermission(buttton: any): boolean {
    const index: number = this.userPermissionList.indexOf(buttton);
    if (index != -1)
      return true;
    else
      return false;
  }

  REPO_MCLR_View_Product_Popup() {
    const config = {
      size: 'lg',
    };
    const modalRef =null
    // = this.modalService.open(ComSIRViewProductComponent, config);
    return modalRef;
  }
  REPO_MCLR_Change_Value_Popup() {
    let popUpObj = { type: this.tab, obj: this.sendBackBychecker };
    const config = {
      windowClass: '',
      size: 'lg',
      backdrop: 'static',
      keyboard: false
    };


    this.commonService.openPopUp(popUpObj, ComREPOMCLRComponent, false, config).result.then(result => {
      this.changeTab(this.tab);
      if (result === 'ok') {
        this.isSendBackByChecker = false;
        // console.log("ok");
      } else if (result === 'close') {
        // console.log("close");
      }
    });
  }
  REPO_MCLR_Approve_Popup() {
    const config = {
      windowClass: 'popup-650',
    };
    const modalRef =null;
    // = this.modalService.open(ComREPOMCLRApproveComponent, config);
    return modalRef;
  }

  updateJob(action) {
    // this.disableApproveButton(this.baseRateDetails)
    if (this.isApproveDisable && action.action.id == 21) {
      this.commonService.errorSnackBar(this.messege);
      return;
    }
    action.jobId = this.jobId;
    action.currentStep = action.workflowStep;
    action.toStep = action.nextworkflowStep;
    action.actionId = action.action.id;
    this.baseRateDetails.workflowRequest = action;
    this.baseRateDetails.schemeId = this.schemeId;
    this.scoringService.updateWorkflowjob(this.baseRateDetails).subscribe(res => {
      if (res.status != 200) {
        this.commonService.errorSnackBar("Something went wrong.");
        return;
      }
      this.changeTab(this.tab);
    }, error => {
      this.commonService.errorSnackBar(error);
    })
  }

  REPO_MCLR_Reject_Popup() {
    const config = {
      windowClass: 'popup-650',
    };
    const modalRef=null;
    //  = this.modalService.open(ComREPOMCLRRejectComponent, config);
    return modalRef;
  }
  disableApproveButton(obj?,type?,action?): any {
    this.productService.getToBeActiveBaseRate(obj).subscribe(res => {
      // console.log(res);
      if (res.status == 200) {
        if (!this.commonService.isObjectNullOrEmpty(res.data)) {
          this.isApproveDisable = res.data;
          if(type==1){
            this.updateJob(action);
          }
        }
      }
    }, error => {
      this.commonService.errorSnackBar(error);
    });
  }

  getBaseRateDetails(req) {
    this.scoringService.getBaseRateDetails(req).subscribe(res => {
      if (res.status != 200) {
        this.commonService.errorSnackBar("Somethig went wrong.");
        return;
      }
      this.baseRateDetails = res.data;
      if (!this.commonService.isObjectNullOrEmpty(this.baseRateDetails)) {
        this.jobId = this.baseRateDetails.jobId;
        this.getBaseRate();
        if (!this.commonService.isObjectNullOrEmpty(this.baseRateDetails.status)) {
          if (this.isAdminChecker) {
            if (this.baseRateDetails.status == 2) {
              this.isPendingAtChecker = true;
              this.getActiveSteps(req);
             
            }
          } else {
            if ((this.baseRateDetails.status == 1) && this.commonService.isObjectNullOrEmpty(this.baseRateDetails.baseRate)) {
              this.isPendingAtMaker = true;
            }
          }
        }
      } else {
        this.isPendingAtMaker = true;
        if (this.allBaseRateDetails.length > 0) {
          for (let i = 0; i < this.allBaseRateDetails.length; i++) {
            if (this.allBaseRateDetails[i].status == 2) {
              let req = { businessTypeId: this.businessTypeId, baseRateTypeId: this.tab, status: 2, schemeId: this.schemeId };
              this.isPendingAtMaker = false;
              this.getBaseRateDetails(req);
              break;
            }
            else if (this.allBaseRateDetails[i].status == 5) {
              let req = { businessTypeId: this.businessTypeId, baseRateTypeId: this.tab, status: 5, schemeId: this.schemeId };
              this.isSendBackByChecker = true;
              this.sendBackBychecker = this.allBaseRateDetails[i];
              // console.log(this.allBaseRateDetails[i])
              this.getBaseRateDetails(req);
              break;
            }
          }
        }
      }
    }, error => {
      this.commonService.errorSnackBar(error);
    });
  }

  getAllBaseRateDetails(req) {
    this.currentBaseRate = null;
    this.scoringService.getAllBaseRateDetails(req).subscribe(res => {
      if (res.status != 200) {
        this.commonService.errorSnackBar("Somethig went wrong.");
        return;
      }
      this.allBaseRateDetails = res.data;
      for (let i = 0; i < this.allBaseRateDetails.length; i++) {
        if (this.allBaseRateDetails[i].effectiveTillDate) {
          this.allBaseRateDetails[i].diffDays = this.getLifeTime(this.allBaseRateDetails[i].effectiveFromDate, this.allBaseRateDetails[i].effectiveTillDate);
        }
        if (!this.commonService.isObjectNullOrEmpty(this.allBaseRateDetails[i].isCurrentActive) && this.allBaseRateDetails[i].isCurrentActive) {
          this.currentBaseRate = this.allBaseRateDetails[i].baseRate;
        }
      }
      this.getBaseRateDetails(req);
    }, error => {
      this.commonService.errorSnackBar(error);
    });
  }

  getJobId() {
    // baseRateDetailsReq.getOrgId(),baseRateDetailsReq.getBusinessTypeId(),baseRateDetailsReq.getStatus(),baseRateDetailsReq.getBaseRateTypeId()
    let req = { businessTypeId: this.businessTypeId, baseRateTypeId: this.tab, status: 2, schemeId: this.schemeId };
    this.scoringService.getJobId(req).subscribe(res => {
      if (res.status != 200) {
        this.commonService.errorSnackBar("Somethig went wrong.");
        return;
      }
      this.jobId = res.data;
      this.getActiveSteps();
    }, error => {
      this.commonService.errorSnackBar(error);
    });
  }

  getActiveSteps(req?) {
    this.scoringService.getActiveStepForMaster(this.jobId).subscribe(res => {
      if (res.status != 200) {
        this.commonService.errorSnackBar("Somethig went wrong.");
        return;
      }
      console.log("res:: ",res);
      this.actionButtons = res.data.step.stepActions;
      req!=null?this.disableApproveButton(req):"";
    }, error => {
      this.commonService.errorSnackBar(error);
    });
  }

  getLifeTime(obj1, obj2) {
    obj1 = obj1.split('-')[2] + "-" + obj1.split('-')[1] + "-" + obj1.split('-')[0] + 'T' + obj2.split('T')[1];
    var a = new Date(obj1);
    var b = new Date(obj2);
    const utc1 = Date.UTC(a.getFullYear(), a.getMonth(), a.getDate());
    const utc2 = Date.UTC(b.getFullYear(), b.getMonth(), b.getDate());
    const diffDays = Math.ceil((utc2 - utc1) / (1000 * 60 * 60 * 24));
    return diffDays + ' Days';
  }

  getBaseRate() {
    // console.log(this.tab);
    let request = { businessTypeId: this.businessTypeId, status: 3, baseRateTypeId: this.tab, schemeId: this.schemeId };
    this.productService.getBaseRate(request).subscribe(success => {
      // this.disableApproveButton(request);
      if (this.commonService.isObjectNullOrEmpty(success) || this.commonService.isObjectNullOrEmpty(success.data)) {
        console.error('Please create or approved REPO/MCLR.');
        return;
      }
    }, error => {
      this.commonService.errorSnackBar(error);
    });
  }
  checkScheme(schemeId: any): Boolean {
    if (schemeId == 1 || schemeId == 2 || schemeId == 3 || schemeId == 4 || schemeId == 11 || schemeId == 14 || schemeId == 11) {
      return true;
    } else {
      return false;
    }

  }

}
