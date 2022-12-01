import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { CommonMethods } from 'src/app/CommoUtils/common-services/common-methods';
import { CommonService } from 'src/app/CommoUtils/common-services/common.service';
import { Constants } from 'src/app/CommoUtils/constants';
import { TnService } from 'src/app/services/tn.service';
import { preSanction,} from './pre-sanction-report.module';
import * as _ from 'lodash';

@Component({
  selector: 'app-pre-sanction-report',
  templateUrl: './pre-sanction-report.component.html',
  styleUrls: ['./pre-sanction-report.component.scss'],
})
export class PreSanctionReportComponent implements OnInit {

  @ViewChild('preSanctionForm') preSanctionForm: NgForm;
  @Input() applicationId: any;
  @Input() proposalId: any;
  @Input() roleId: any;
  @Input() statusId: any;
  @Output() onCompleted = new EventEmitter<any>();
  yesNoList: any;
  purposeOfLoanList: any;
  licenceStatusList:any;
  BankList:any;
  LoanTypeList:any;
  isSaved=false;
  isViewMode = false;
  preSanctionData = new preSanction();
  constants = Constants;
  disable = false;
  fioRoleId = Constants.UserRoleList.FIELD_INSPECTION_OFFICER.id;
  constructor(private service: TnService, public commonServices: CommonService, private commonMethods: CommonMethods) {
    commonMethods.getValidationByModule(Constants.validationModule.PRE_SANCTION_DETAILS);
  }

  ngOnInit(): void {
    this.getMasterList();
    (this.statusId == 1 || this.statusId == 2|| this.statusId == 4) ? this.disable = false : this.disable = true;
  }

  getMasterList() {
    const list = ['YES_NO_LIST', 'PURPOSE_OF_LOAN',"LICENCE_STATUS",'LICENCE_STATUS','BANK_LIST','ACCOUNT_TYPE_TEMP'];
    this.service.getListByClass(list).subscribe((res) => {
      if (res && res.status == 200 && res.data) {
        this.yesNoList = res.data.YES_NO_LIST;        
        this.purposeOfLoanList = res.data.PURPOSE_OF_LOAN;
        this.licenceStatusList = res.data.LICENCE_STATUS;
        this.BankList = res.data.BANK_LIST;
        this.LoanTypeList = res.data.ACCOUNT_TYPE_TEMP;
        this.getPreSanctionData();
      }
    });
  }

  getPreSanctionData() {
    this.service.getPreSanctionData(this.applicationId, this.proposalId).subscribe(res => {
      if (res && res.data && res.status == 200 && res.flag) {
        // format date to DD-MM-YYYY format
        if(res.data){
          if(res.data.isUdyamReg && res.data.isUdyamReg==true){
            res.data.displayIsUdyamReg = 'valid';
          } else {
            res.data.displayIsUdyamReg = 'invalid';
          }
          if(res.data.isGst && res.data.isGst==true){
            res.data.displayIsGst = 'valid';
          } else {
            res.data.displayIsGst = 'invalid';
          }
          if(res?.data?.commonSanctionReportDataProxy?.existingLoansDetails?.length > 0) {
            res.data.commonSanctionReportDataProxy.existingLoansDetails.forEach(element => {
              if(!CommonService.isObjectNullOrEmpty(element.outstandingDate)) {
                element.outstandingDisplayDate = this.formatDate(element.outstandingDate);
              }
              if(!CommonService.isObjectNullOrEmpty(element.sanctionDate)) {
                element.sanctionDisplayDate = this.formatDate(element.sanctionDate);
              }
            });
          }
        }
        this.preSanctionData = res.data
      } else {
        this.commonServices.warningSnackBar(res.message);
      }
    });
  }

  save() {
    this.isSaved=true
    if(this.preSanctionForm.invalid) {
      this.preSanctionForm.form.markAllAsTouched();
      this.commonMethods.warningSnackBar("Please fill required fields.");
      this.isSaved = false;
      return;
    }
    const data: any = _.cloneDeep(this.preSanctionData);
    
    this.service.savePreSanctionData(data).subscribe((res) => {
      if (res && res.status == 200 && res.flag) {
        this.getPreSanctionData();
        this.commonServices.successSnackBar('Pre Sanction data saved Successfully');
        if(this.statusId==1 || this.statusId ==2){
          this.onComplete();
        }
        this.isSaved=false;
      }else{
        this.commonServices.errorSnackBar("res.msg")
      }
    });
  }

  onComplete(): void {
    const data = {
      isCompleted : true,
      tabId : 2
    }
    this.onCompleted.emit(data);
  }

  // Enter 1 for numbes-only ,2 for character-only ,3 for alphanumeric only ,4 for alphabet-with-space ,5 for alphanumeric with space ,6 no space, 7 no numeric and space value
  keyPressEvent(event, type): boolean {
    return this.commonMethods.keyPressEvent(event, type);
  }

  formatDate(date){
    let fulldate = new Date(date)
    const month = ("0" + (fulldate.getMonth() + 1)).slice(-2);
    const day = ("0" + fulldate.getDate()).slice(-2);
    return day+'-'+month+'-'+fulldate.getFullYear()
  }
}
