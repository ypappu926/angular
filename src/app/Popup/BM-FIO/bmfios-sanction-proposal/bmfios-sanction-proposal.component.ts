import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { TnService } from 'src/app/services/tn.service';
import * as _ from 'lodash';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { CommonMethods } from 'src/app/CommoUtils/common-services/common-methods';
import { Constants } from 'src/app/CommoUtils/constants';
import { CommonService } from 'src/app/CommoUtils/common-services/common.service';


@Component({
  selector: 'app-bmfios-sanction-proposal',
  templateUrl: './bmfios-sanction-proposal.component.html',
  styleUrls: ['./bmfios-sanction-proposal.component.scss']
})
export class BMFIOSSanctionProposalComponent implements OnInit {
  @ViewChild('sanctionDetailForm') sanctionDetailForm: NgForm;
  isProceed = false;
  msmeProposalDetails: any = {};

  sanctionProposalDetails: any = {
    id: undefined,
    applicationId: undefined,
    sanctionAmount: undefined,
    tenure: undefined,
    interestType: undefined,
    roi: undefined,
    riskPremium: undefined,
    panelInteresrPayable: undefined,
    typeOfCollateral: undefined,
    detailsOfCollateral: undefined

  }
  typeOfCollateralList = [];
  interestTypeList = [];
  @Input() popUpObj;

  public selectedFormName: string;

  constructor(private service: TnService, private commonService: CommonService, private activeModal: NgbActiveModal, private commonMethods: CommonMethods) {
    commonMethods.getValidationByModule(Constants.validationModule.SANCTION_DETAILS,);
  }

  ngOnInit(): void {
    this.getMasterList();
    this.sanctionProposalDetails.applicationId = this.popUpObj.applicationId;
    this.sanctionProposalDetails.proposalId = this.popUpObj.proposalId;
    this.sanctionProposalDetails.sanctionAmount = this.popUpObj.elAmount;
    //this.getMsmeProposalDetails();

  }

  getMasterList() {
    const list = ['TYPE_OF_PROPERTY', 'INTEREST_TYPE'];
    this.service.getListByClass(list).subscribe(res => {
      if (res && res.status == 200 && res.data) {
        this.typeOfCollateralList = res.data.TYPE_OF_PROPERTY;
        this.interestTypeList = res.data.INTEREST_TYPE;
      }
    });
  }

  submitSanctionDetails() {
    this.isProceed = true;
    if (this.sanctionDetailForm.invalid) {
      this.sanctionDetailForm.form.markAllAsTouched();
      this.commonMethods.warningSnackBar("Please fill required fields.");
      return;
    }
    const data = _.cloneDeep(this.sanctionDetailForm.value);
    data.id = this.sanctionProposalDetails.id;
    data.applicationId = this.sanctionProposalDetails.applicationId;
    data.proposalId = this.sanctionProposalDetails.proposalId;
    data.proposalStatusId = Constants.PROPOSAL_STATUS.SANCTION;
    // data.sanctionAmount = data.sanctionAmount.replace(/\,/g, '');
    // data.sanctionAmount = parseInt(data.sanctionAmount, 10);
    // data.elAmount = parseFloat(data.elAmount.replace(/,/g, ''));
    // if (data.sanctionAmount > 4000000) {
    //   this.commonService.warningSnackBar('max amount is no more then 40 lakh');
    //   return;
    // }
    // console.log(data)
    this.service.saveOrUpdateSectionProposalStatus(data).subscribe(res => {    
      if (res && res.status == 200 && res.flag) {
        this.close(res.flag);
        this.commonMethods.successSnackBar(" Sanction  Succesufully");
      } else {
        this.commonService.errorSnackBar(res.message);
      }
    });
  }
  close(isCompleted) {
    this.activeModal.close(isCompleted);
  }

  keyPressEvent(event, type): boolean {
    return this.commonMethods.keyPressEvent(event, type);
  }

  onChangeofOptions(newGov) {
    this.selectedFormName = newGov;
    if (this.selectedFormName == '2') {
      this.sanctionProposalDetails.roi = null;
      this.sanctionProposalDetails.riskPremium = null;
    }
  }
  // getMsmeProposalDetails() {
  //   this.service.getMsmeProposalDetails(this.sanctionProposalDetails.proposalId,this.sanctionProposalDetails.applicationId).subscribe(res => {
  //     if (res && res.data) {
  //       this.msmeProposalDetails = res.data;        
  //     }
  //   });
  // }
  // formatCurrency_TaxableValue(event) {
  //   var uy = new Intl.NumberFormat('en-IN', { currency: 'INR' }).format(event.target.value);
  //   if (uy === event.target.value || uy === "NaN") {
  //     this.sanctionProposalDetails.sanctionAmount = event.target.value;
  //   } else {
  //     this.sanctionProposalDetails.sanctionAmount = uy;
  //   }
  // }

}
