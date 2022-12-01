import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { CommonService } from 'src/app/CommoUtils/common-services/common.service';
import { TnService } from 'src/app/services/tn.service';
import { SanctionDetails } from './saction-letter.module';
import * as _ from 'lodash';
import { NgForm } from '@angular/forms';
import { Constants } from 'src/app/CommoUtils/constants';
import { CommonMethods } from 'src/app/CommoUtils/common-services/common-methods';

@Component({
  selector: 'app-saction-letter',
  templateUrl: './saction-letter.component.html',
  styleUrls: ['./saction-letter.component.scss']
})
export class SactionLetterComponent implements OnInit {
  @Input() applicationId: any;
  @Input() proposalId: any;
  @Input() roleId: any;
  @Input() statusId: any;
  @Output() onCompleted = new EventEmitter<any>();
  @ViewChild('sanctionLetterForm') sanctionLetterForm: NgForm;

  sanctionDetails = new SanctionDetails();
  isProceed = false;
  disable = false;
  fioRoleId = Constants.UserRoleList.FIELD_INSPECTION_OFFICER.id;
  
  constructor(private tnService: TnService, private commonService: CommonService, public commonMethods: CommonMethods) { 
    commonMethods.getValidationByModule(Constants.validationModule.SANCTION_LETTER_DETAILS);
  }

  ngOnInit(): void {
    this.getSanctionDetails();
    (this.statusId == 14 || this.statusId ==  15 || this.statusId == 17) ? this.disable = false : this.disable = true;
  }

  getSanctionDetails() {
    this.tnService.getSanctionLetterDetails(this.applicationId,this.proposalId).subscribe(res=> {
      if(res && res.status == 200 && res.flag && res.data) {
        this.sanctionDetails = res.data;
      } else {
        this.commonService.warningSnackBar(res.message);
      }
    });
  }

  proceed() {
    this.isProceed = true;
    if(this.sanctionLetterForm.invalid) {
      this.sanctionLetterForm.form.markAllAsTouched();
      this.commonService.warningSnackBar('Please fill required details.');
      this.isProceed = false;
      return;
    }
    const data = _.cloneDeep(this.sanctionDetails);
    data.applicationId = this.applicationId;
    this.tnService.saveSanctionLetterDetails(data).subscribe(res=> {
      if(res && res.status == 200 && res.flag) {
       if(this.statusId == 14){
         this.onComplete();
       }
      } else {
        this.commonService.warningSnackBar(res.message);
      }
    });
  }

  onComplete(): void {
    const data = {
      isCompleted: true,
      tabId: 5,
    };
    this.onCompleted.emit(data);
  }

  calculateTotalLoanAmt(){
    if(this.sanctionDetails && this.sanctionDetails.noOfInstallment && this.sanctionDetails.monthlyPrincipalRepayment){
      this.sanctionDetails.totalLoanAmount = this.sanctionDetails.noOfInstallment * this.sanctionDetails.monthlyPrincipalRepayment;
    }else{
      this.sanctionDetails.totalLoanAmount = null;
    }
  }

  // Enter 1 for numbes-only ,2 for character-only ,3 for alphanumeric only ,4 for alphabet-with-space ,5 for alphanumeric with space ,6 no space, 7 no numeric and space value
  keyPressEvent(event, type): boolean {
    return this.commonMethods.keyPressEvent(event, type);
  }
}
