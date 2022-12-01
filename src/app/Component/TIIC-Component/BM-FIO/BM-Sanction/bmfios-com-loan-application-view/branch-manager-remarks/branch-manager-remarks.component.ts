import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { CommonMethods } from 'src/app/CommoUtils/common-services/common-methods';
import { CommonService } from 'src/app/CommoUtils/common-services/common.service';
import { TnService } from 'src/app/services/tn.service';
import * as _ from 'lodash';
import { BranchManagerRemarks } from './branch-manager-remarks.module';
import { Constants } from 'src/app/CommoUtils/constants';

@Component({
  selector: 'app-branch-manager-remarks',
  templateUrl: './branch-manager-remarks.component.html',
  styleUrls: ['./branch-manager-remarks.component.scss']
})
export class BranchManagerRemarksComponent implements OnInit {

  @ViewChild('branchManagerForm') branchManagerForm: NgForm;
  @Input() applicationId: any;
  @Input() proposalId: any;
  @Input() roleId: any;
  @Input() statusId: any;
  @Output() onCompleted = new EventEmitter<any>();
  constants =  Constants;
  disable = false;
  isSaved = false;

  branchManagerdata = new BranchManagerRemarks();

  constructor( private service: TnService,
    public commonServices: CommonService,
    private commonMethods: CommonMethods) {
    commonMethods.getValidationByModule(Constants.validationModule.BRANCH_MANAGER_REMARKS);

  }

  ngOnInit(): void {
    this.getBranchManagerRemarksData();
    (this.statusId == 3 || this.statusId == 4) ? this.disable = false : this.disable = true;
  }

  onComplete(): void {
    const data = {
      isCompleted: true,
      tabId: 4,
    };
    this.onCompleted.emit(data);
  }


  getBranchManagerRemarksData() {
    this.service.getBranchManagerRemarks(this.applicationId).subscribe((res) => {
        if (res && res.data && res.status == 200 && res.flag) {
          this.branchManagerdata = res.data;
        } else {
          if(res?.status != 200 ){
            this.commonServices.warningSnackBar(res.message);
          }
        }
      });
  }

  save() {
    this.isSaved = true;
    if (this.branchManagerForm.invalid) {
      this.branchManagerForm.form.markAllAsTouched();
      this.commonMethods.warningSnackBar('Please fill required fields.');
      this.isSaved = false;
      return;
    }
    const data: any = _.cloneDeep(this.branchManagerdata);
    data.applicationId = this.applicationId;
    this.service.saveBranchManagerRemarks(data).subscribe((res) => {
      if (res && res.status == 200 && res.flag) {
        this.isSaved = false;
        this.onComplete();
      } else {
        this.commonServices.warningSnackBar(res.message);
      }
    });
  }

}
