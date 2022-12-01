import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { CommonMethods } from 'src/app/CommoUtils/common-services/common-methods';
import { CommonService } from 'src/app/CommoUtils/common-services/common.service';
import { Constants } from 'src/app/CommoUtils/constants';
import { TnService } from 'src/app/services/tn.service';
import * as _ from 'lodash';
import { PreSanctionMemo } from './pre-sanction-memo.module';

@Component({
  selector: 'app-pre-sanction-memo',
  templateUrl: './pre-sanction-memo.component.html',
  styleUrls: ['./pre-sanction-memo.component.scss'],
})
export class PreSanctionMemoComponent implements OnInit {
  // isCollapsed=false;
  yesNoList: any;
  typeOfPropertyList: any;
  kycRiskCategorisationList: any;
  licenceStatusList: any;
  isSaved = false;
  fioRoleId = Constants.UserRoleList.FIELD_INSPECTION_OFFICER.id;

  @ViewChild('preSanctionMemoForm') preSanctionMemoForm: NgForm;
  @Input() applicationId: any;
  @Input() proposalId: any;
  @Input() roleId: any;
  @Input() statusId: any;
  @Output() onCompleted = new EventEmitter<any>();
  disable = false;
  bankList:any;
  purposeOfLoanList:any;
  preSanctionMemoData = new PreSanctionMemo();

  constructor(
    private service: TnService,
    public commonServices: CommonService,
    private commonMethods: CommonMethods
  ) {
    commonMethods.getValidationByModule(Constants.validationModule.PRE_SANCTION_MEMO_DETAILS);
  }
  ngOnInit(): void {
    this.getMasterList();
    (this.statusId == 1 || this.statusId == 2 || this.statusId == 4 ) ? this.disable = false : this.disable = true;
  }

  getMasterList() {
    const list = ['YES_NO_LIST', 'TYPE_OF_PROPERTY', 'KYC_RISK_CATEGORISATION','BANK_LIST','PURPOSE_OF_LOAN','LICENCE_STATUS'];
    this.service.getListByClass(list).subscribe((res) => {
      if (res && res.status == 200 && res.data) {
        this.yesNoList = res.data.YES_NO_LIST;
        this.typeOfPropertyList = res.data.TYPE_OF_PROPERTY;
        this.kycRiskCategorisationList = res.data.KYC_RISK_CATEGORISATION;
        this.licenceStatusList = res.data.LICENCE_STATUS;
        this.bankList = res.data.BANK_LIST;
        this.purposeOfLoanList = res.data.PURPOSE_OF_LOAN;
      }
    });
    this.getPreSanctionMemoData();
  }

  getPreSanctionMemoData() {
    this.service.getPreSanctionMemoData(this.applicationId, this.proposalId).subscribe((res) => {        
        if (res && res.data && res.status == 200 && res.flag) {
          if(res?.data?.commonSanctionReportDataProxyList?.existingLoansDetails?.length > 0) {
            res.data.commonSanctionReportDataProxyList.existingLoansDetails.forEach(element => {
              if(!CommonService.isObjectNullOrEmpty(element.outstandingDate)) {
                element.outstandingDisplayDate = this.formatDate(element.outstandingDate);
              }
            });
          }
          this.preSanctionMemoData = res.data;
          if(this.preSanctionMemoData.repaymentScheduleDetailsList.length==0){
            this.addRemoveRepayment('add');
          }
        } else {
          this.commonServices.warningSnackBar(res.message);
        }
      });
  }

  save() {
    this.isSaved = true;
    if (this.preSanctionMemoForm.invalid) {
      this.preSanctionMemoForm.form.markAllAsTouched();
      this.commonMethods.warningSnackBar('Please fill required fields.');
      this.isSaved = false;
      return;
    }
    const data: any = _.cloneDeep(this.preSanctionMemoData);
    this.service.savePreSanctionMemoData(data).subscribe((res) => {
      if (res && res.status == 200 && res.flag) {
        this.getPreSanctionMemoData();
        this.isSaved = false;
        if(this.statusId==1 || this.statusId ==2){
          this.onComplete();
        }
        this.commonServices.successSnackBar('Pre Sanction Memo data saved Successfully');
      }
    });
  }

   onComplete(): void {
    const data = {
      isCompleted: true,
      tabId: 3,
    };
    this.onCompleted.emit(data);
  }

  addRemoveRepayment(type,index?) {
    if(type=="add"){
      this.preSanctionMemoData.repaymentScheduleDetailsList.push({
        id:null,
        applicationId:null,
        repaymentDate:null,
	      repaymentAmout:''
      })
    }else if(type=="remove"){
      this.preSanctionMemoData.repaymentScheduleDetailsList.splice(index,1);
    }
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
