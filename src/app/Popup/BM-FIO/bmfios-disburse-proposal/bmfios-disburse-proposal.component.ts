import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { TnService } from 'src/app/services/tn.service';
import * as _ from 'lodash';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { CommonMethods } from 'src/app/CommoUtils/common-services/common-methods';
import { Constants } from 'src/app/CommoUtils/constants';
import { CommonService } from 'src/app/CommoUtils/common-services/common.service';

@Component({
  selector: 'app-bmfios-disburse-proposal',
  templateUrl: './bmfios-disburse-proposal.component.html',
  styleUrls: ['./bmfios-disburse-proposal.component.scss']
})
export class BMFIOSDisburseProposalComponent implements OnInit {
  @ViewChild('disburseProposalform') disburseProposalform: NgForm;
  isProceed = false;
  // msmeProposalDetails: any = {};
  sanctionDetails:any ={};
  @Input() popUpObj;

  disburseProposalDetails: any = {
    id:undefined,
    applicationId: undefined,
    proposalId :undefined,
    ammountToBeDisburse:undefined,
    // sanctionAmount:undefined
  }

  public selectedFormName: string;

  constructor(private service: TnService, private commonService: CommonService, private activeModal: NgbActiveModal,private commonMethods:CommonMethods,
  ) {  commonMethods.getValidationByModule(Constants.validationModule.SANCTION_DETAILS,)}

  ngOnInit(): void {
    this.disburseProposalDetails.applicationId = this.popUpObj.applicationId;
    this.disburseProposalDetails.proposalId = this.popUpObj.proposalId;
    this.disburseProposalDetails.sanctionAmount = this.popUpObj.sanctionAmount;    
  }

  submitDisburseAmount(){
    this.isProceed = true;
    if (this.disburseProposalform.invalid ||this.disburseProposalDetails.ammountToBeDisburse == undefined) {
      this.disburseProposalform.form.markAllAsTouched();
      this.commonMethods.warningSnackBar("Please fill required fields.");
      return;
    }
     if (this.disburseProposalDetails.sanctionAmount < this.disburseProposalDetails.ammountToBeDisburse) {
      this.commonService.warningSnackBar('disburse Amount is not grater than Sanction amount');
      return;
    }   
    

    this.disburseProposalDetails.proposalStatusId = Constants.PROPOSAL_STATUS.DISBURSED;  
    this.service.saveOrUpdateSectionProposalStatus(this.disburseProposalDetails).subscribe(res => {    
      if (res && res.status == 200 && res.flag) {
        this.close(res.flag);
        this.commonMethods.successSnackBar("Disbursement Succesufully");
      } else {
        this.commonService.errorSnackBar(res.message);
      }
    });
  }

  close(isCompleted) {
    this.activeModal.close(isCompleted);
  }
}
