import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { CommonMethods } from 'src/app/CommoUtils/common-services/common-methods';
import { TnService } from 'src/app/services/tn.service';
import { CommonService } from 'src/app/CommoUtils/common-services/common.service';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { NgForm } from '@angular/forms';
import * as _ from 'lodash';
import { Constants } from 'src/app/CommoUtils/constants';

@Component({
  selector: 'app-hold-tsv-popup',
  templateUrl: './hold-tsv-popup.component.html',
  styleUrls: ['./hold-tsv-popup.component.scss']
})
export class HoldTsvPopupComponent implements OnInit {
  // @ViewChild('sanctionDetailForm') sanctionDetailForm: NgForm;
  sanctionProposalDetails: any = {
    id: undefined,
    applicationId: undefined,
    typeId: 1,

  }

  selectValue: any[];
  isProceed = false;
  reason: any;
  otherReason: any;


  @Input() popUpObj;
  constructor(private service: TnService, private commonService: CommonService, private commonMethods: CommonMethods, private activeModal: NgbActiveModal) { }


  ngOnInit(): void {
    this.selectValue = [
      'Application is complete, Additional information is required',
      'Application is complete, Additional documents are required',
      'Application is incomplete, Additional information is required',
      'Other'
    ];
  }

  submitSanctionHoldDetails() {
    this.isProceed = true;
    this.reason = this.reason != 'Other' ? this.reason : this.otherReason;
    if (!this.reason) {
      this.commonMethods.warningSnackBar("Please fill required fields.");
      return;
    }

    const data: any = {
      proposalId: this.popUpObj.proposalId,
      applicationId: this.popUpObj.applicationId,
      proposalStatusId: Constants.PROPOSAL_STATUS.HOLD,
      holdRejectReason: this.reason != 'Other' ? this.reason : this.otherReason,
    };
    // console.table(data)
    this.service.saveOrUpdateSectionProposalStatus(data).subscribe(res => {
      if (res && res.status == 200 && res.flag) {
        this.close(res.flag);
      } else {
        this.commonService.errorSnackBar(res.message);
      }
    });
  }
  close(isCompleted) {
    this.activeModal.close(isCompleted);
  }
}
