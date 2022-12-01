import { Platform } from '@angular/cdk/platform';
import { DatePipe } from '@angular/common';
import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import * as moment from 'moment';
import { CommonService } from 'src/app/CommoUtils/common-services/common.service';import { Constants } from 'src/app/CommoUtils/constants';
import { ScoringService } from 'src/app/services/scoring.service';

@Component({
  selector: 'app-com-repo-mclr',
  templateUrl: './com-repo-mclr.component.html',
  styleUrls: ['./com-repo-mclr.component.scss'],
  providers: [DatePipe]
})
export class ComREPOMCLRComponent implements OnInit {
  @ViewChild('interestRate') interestRate: NgForm;
  @Input() popUpObj: any;
  isIE: boolean;
  constructor(public activeModal: NgbActiveModal, private scoringService: ScoringService, private commonService: CommonService, private datePipe: DatePipe, private platform: Platform) {
    // console.log("this.popUpObj:: ", this.popUpObj);
    //console.log("this.data:: ",this.data);
    this.isIE = this.platform.TRIDENT; // or IOS, SAFARI, ANDROID, etc.

    // console.log("this.isIE:: ", this.isIE);
  }

  jobId: any;
  typeId: any;
  actionButtons: any;
  baseRateDetails: any = {};
  businessTypeId: number;
  minDate = new Date();
  day: any;
  month: any;
  year: any;
  schemeId!: number;
  minTime: any;
  todayTime: any;
  hour: any;
  minutes: any;
  meridiem: any;
  sendBackObj:any={};
  submitted = false;
  ngOnInit(): void {
    setTimeout(() => {
      this.typeId = this.popUpObj.type;
    this.sendBackObj=this.popUpObj.obj;
    // console.log(" this.sendBackObj=this.popUpObj; ", this.popUpObj);
    // console.log(" this.sendBackObj=this.popUpObj.obj; ", this.sendBackObj);
    this.businessTypeId =1;
    this.schemeId =9;
    this.day = this.minDate.getDate();
    this.year = this.minDate.getFullYear();
    this.month = this.minDate.getMonth();

    this.todayTime = new Date().toLocaleTimeString('en-US', { hour: 'numeric', hour12: true, minute: 'numeric' })
    this.minTime = this.todayTime;
    this.hour = parseInt(this.minTime.split(':')[0]);
    this.minutes = parseInt(this.minTime.split(':')[1]);
    this.meridiem = this.minTime.split(' ')[1];
    if(this.commonService.isObjectIsEmpty(this.sendBackObj) || this.popUpObj==undefined){
      this.getJobId();
    }else{
      if(this.typeId == this.sendBackObj.baseRateTypeId){
        this.baseRateDetails= this.sendBackObj;
        this.baseRateDetails.effectiveFromDate=null;
        this.baseRateDetails.effectiveFromTime=null;
        this.jobId=this.sendBackObj.jobId;
        this.getActiveSteps();
      }else{
        this.getJobId();
      }
      
    }
    // console.log(this.interestRate);
    }, 0);
    
  }

  getJobId() {
    // baseRateDetailsReq.getOrgId(),baseRateDetailsReq.getBusinessTypeId(),baseRateDetailsReq.getStatus(),baseRateDetailsReq.getBaseRateTypeId()
    let req = { businessTypeId: this.businessTypeId, baseRateTypeId: this.typeId, status: 1, schemeId: this.schemeId };
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

  getActiveSteps() {
    this.scoringService.getActiveStepForMaster(this.jobId).subscribe(res => {
      if (res.status != 200) {
        this.commonService.errorSnackBar("Somethig went wrong.");
        return;
      }
      this.actionButtons = res.data.step.stepActions;
    }, error => {
      this.commonService.errorSnackBar(error);
    });
  }

  updateJob(action) {

    this.submitted=false;
    setTimeout(() => {
      this.submitted = true;
    }, 0);

    console.log(this.interestRate)
    if(this.interestRate.invalid){
      return;
    }
    if (this.commonService.isObjectNullOrEmpty(this.baseRateDetails)) {
      this.commonService.errorSnackBar("Please fill required data");
      return;
    }

    if (this.commonService.isObjectNullOrEmpty(this.baseRateDetails.baseRate)) {
      this.commonService.errorSnackBar("Rate cannot be null");
      return;
    }

    //pattern="^(?:\d*\.\d{1,2}|\d+)$" required
    if (!this.baseRateDetails.baseRate.toString().match('^(\\d*.\\d{1,2}|\d+)$') && !this.baseRateDetails.baseRate.toString().match('^(\\d{1})$')) {
      this.commonService.errorSnackBar("Invalid rate");
      return;
    }

    if (this.commonService.isObjectNullOrEmpty(this.baseRateDetails.effectiveFromDate)) {
      this.commonService.errorSnackBar("Effective date cannot be null");
      return;
    }

    if (this.commonService.isObjectNullOrEmpty(this.baseRateDetails.effectiveFromTime)) {
      this.commonService.errorSnackBar("Effective time cannot be null");
      return;
    }

   
    var convertedTime = moment(this.baseRateDetails.effectiveFromTime, 'hh:mm A'). format('HH:mm');
    var timee=  moment(this.minTime, 'hh:mm A'). format('HH:mm');
    // console.log(new Date().setHours(parseInt(convertedTime.split(':')[0]),parseInt(convertedTime.split(':')[1])) ,"===========", new Date().setHours(parseInt(timee.split(':')[0]),parseInt(timee.split(':')[1])))

    if (this.baseRateDetails.effectiveFromDate === this.datePipe.transform(this.minDate, 'dd-MM-yyyy').toString()) {
      if (new Date().setHours(parseInt(convertedTime.split(':')[0]),parseInt(convertedTime.split(':')[1])) < 
      new Date().setHours(parseInt(timee.split(':')[0]),parseInt(timee.split(':')[1]))) {
        this.commonService.errorSnackBar("Effective time cannot be less then current time.");
        return;
      }
    }
    action.jobId = this.jobId;
    action.currentStep = action.workflowStep;
    action.toStep = action.nextworkflowStep;
    action.actionId = action.action.id;
    //this.baseRateDetails.effectiveFromDate = this.baseRateDetails.effectiveFromDate;
    //this.baseRateDetails.effectiveFromDate = this.baseRateDetails.effectiveFromDate + " " + this.baseRateDetails.effectiveFromTime;
    this.baseRateDetails.schemeId = this.schemeId;
    this.baseRateDetails.workflowRequest = action;
    this.scoringService.updateWorkflowjob(this.baseRateDetails).subscribe(res =>{
        if(res.status != 200){
          this.commonService.errorSnackBar("Something went wrong.");
          return;
        }
        if(action.currentStep == 80 && action.actionId==55){
          this.commonService.infoSnackBar("Rate send successfully.");
        }else if(action.currentStep == 81 && action.actionId==56){
          this.commonService.infoSnackBar("Rate approved successfully.");
        }else if(action.currentStep == 81 && action.actionId==57){
          this.commonService.infoSnackBar("Rate rejected successfully.");
        }else if(action.currentStep == 81 && action.actionId==20){
          this.commonService.infoSnackBar("Send back to maker successfully.");
        }
        this.submitted=false;
        this.activeModal.close('ok');
    },error =>{
        this.commonService.errorSnackBar(error);
    });
  }

  closePopUp() {
    this.activeModal.close('close');
  }

  dateChanged() {
    // console.log("this.data:: ", this.day);
    // console.log("this.baseRateDetails.effectiveFromDate:: ", this.baseRateDetails.effectiveFromDate);
    if (parseInt(this.baseRateDetails.effectiveFromDate.split('-')[0]) > this.day) {
      this.minTime = '0:00 AM';
    } else {
      this.minTime = this.todayTime;
    }
  }
  checkScheme(schemeId: any): Boolean {
    if (schemeId == 1 || schemeId == 2 || schemeId == 3 || schemeId == 4 || schemeId == 11 || schemeId == 14 || schemeId == 11) {
      return true;
    } else {
      return false;
    }

  }
}
