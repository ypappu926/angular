import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { CommonMethods } from 'src/app/CommoUtils/common-services/common-methods';
import { CommonService } from 'src/app/CommoUtils/common-services/common.service';
import { Constants } from 'src/app/CommoUtils/constants';
import { TnService } from 'src/app/services/tn.service';
import { PreScreening } from './pre-screening-report.module';
import * as _ from 'lodash';

@Component({
  selector: 'app-pre-screening-report',
  templateUrl: './pre-screening-report.component.html',
  styleUrls: ['./pre-screening-report.component.scss'],
})
export class PreScreeningReportComponent implements OnInit {
  // isCollapsed=false;
  @ViewChild('preScreeningForm') preScreeningForm: NgForm;
  @Input() applicationId: any;
  @Input() proposalId: any;
  @Input() roleId: any;
  @Input() statusId: any;
  @Output() onCompleted = new EventEmitter<any>();

  isSaved = false;
  purposeOfLoanList: any;
  constants = Constants;
  preScreeningData = new PreScreening();
  disable = false;
  fioRoleId = Constants.UserRoleList.FIELD_INSPECTION_OFFICER.id;
  constructor(
    private service: TnService,
    public commonServices: CommonService,
    private commonMethods: CommonMethods
  ) {
    commonMethods.getValidationByModule(Constants.validationModule.PRE_SCREENING_DETAILS);
  }

  ngOnInit(): void {
    this.getMasterList();
    (this.statusId == 1 || this.statusId == 2 || this.statusId == 4) ? this.disable = false : this.disable = true;
  }
  getMasterList() {
    const list = ['PURPOSE_OF_LOAN'];
    this.service.getListByClass(list).subscribe((res) => {
      if (res && res.status == 200 && res.data) {
        this.purposeOfLoanList = res.data.PURPOSE_OF_LOAN;
      }
    });
    this.getPreScreeningData();
  }

  getPreScreeningData() {
    this.service
      .getPreScreeningData(this.applicationId, this.proposalId).subscribe((res) => {
        if (res && res.data && res.status == 200 && res.flag) {
          this.preScreeningData = res.data;
        } else {
          this.commonServices.warningSnackBar(res.message);
        }
      });
  }

  save() {
    this.isSaved = true;
    if (this.preScreeningForm.invalid) {
      this.preScreeningForm.form.markAllAsTouched();
      this.commonMethods.warningSnackBar('Please fill required fields.');
      this.isSaved = false;
      return;
    }
    const data: any = _.cloneDeep(this.preScreeningData);

    this.service.savePreScreeningData(data).subscribe((res) => {
      if (res && res.status == 200 && res.flag) {
        this.getPreScreeningData();
        this.commonServices.successSnackBar('Pre Screening data saved Successfully');
        if(this.statusId==1 || this.statusId ==2){
          this.onComplete();
        }
        this.isSaved = false;
      } else {
        this.commonServices.warningSnackBar(res.message);
      }
    });
  }

  onComplete(): void {
    const data = {
      isCompleted: true,
      tabId: 1,
    };
    this.onCompleted.emit(data);
  }

  // Enter 1 for numbes-only ,2 for character-only ,3 for alphanumeric only ,4 for alphabet-with-space ,5 for alphanumeric with space ,6 no space, 7 no numeric and space value
  keyPressEvent(event, type): boolean {
    return this.commonMethods.keyPressEvent(event, type);
  }
}
