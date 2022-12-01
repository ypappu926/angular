import { Component, OnInit, HostListener } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Observable } from 'rxjs';
import { AdvancedService } from 'src/app/CommoUtils/common-services/advanced.service';
import { TnService } from 'src/app/services/tn.service';
import * as _ from 'lodash';
import { BMFIOReasonComponent } from 'src/app/Popup/BM-FIO/bm-fio-reason/bm-fio-reason.component';
import { BMFIOSSendForApprovedComponent } from 'src/app/Popup/BM-FIO/bmfios-send-for-approved/bmfios-send-for-approved.component';
import { CommonService } from 'src/app/CommoUtils/common-services/common.service';
import { Constants } from 'src/app/CommoUtils/constants';
import { CommonMethods } from 'src/app/CommoUtils/common-services/common-methods';
import { ActivatedRoute, Router } from '@angular/router';
import { sanctionReportStatus } from './bmfios-com-loan-application-view.module';
import { CommitteBranchTransferPopupComponent } from 'src/app/Popup/BM-FIO/committe-branch-transfer-popup/committe-branch-transfer-popup.component';
import { BmfiosGiveRecommedationComponent } from 'src/app/Popup/BM-FIO/bmfios-give-recommedation/bmfios-give-recommedation.component';
import { BMFIOSSanctionProposalComponent } from 'src/app/Popup/BM-FIO/bmfios-sanction-proposal/bmfios-sanction-proposal.component';
import * as moment from 'moment';
import { HoldTsvPopupComponent } from 'src/app/Popup/TIIC-Checker-TSV/hold-tsv-popup/hold-tsv-popup.component';
import { RejectTsvPopupComponent } from 'src/app/Popup/TIIC-Checker-TSV/reject-tsv-popup/reject-tsv-popup.component';
import { BMFIOSDisburseProposalComponent } from 'src/app/Popup/BM-FIO/bmfios-disburse-proposal/bmfios-disburse-proposal.component';

declare var $: any;
@Component({
  selector: 'app-bmfios-com-loan-application-view',
  templateUrl: './bmfios-com-loan-application-view.component.html',
  styleUrls: ['./bmfios-com-loan-application-view.component.scss']
})
export class BMFIOSComLoanApplicationViewComponent implements OnInit {


  proposalId: number;
  applicationId: number;
  districtId: number;
  borrowerProposalId: any;
  msmeProposalDetails: any = {};
  applicantdetails: any = {};
  masterListRequest: any = [];
  masterlist: any = [];
  tnConstitutionList: any = [];
  breadCrumbItems: Array<{}>;
  tab: number = 1;
  SubTab: number = 4;
  submitted: boolean;
  dateRangeFromDate;
  dateRangeToDate;
  consentInitiatedFromDate;
  consentReceivedFromDate;
  isFilterApplied = false;
  sanctionDetails: any = {};
  
  

  total$: Observable<number>;
  jobId: any;
  menu: any;
  roleId: any;
  workflowData: any;
  proposalMappingId: any;
  isSanctionBtn = false;
  statusId;
  roleMaster = Constants.UserRoleList;
  isShowWorkFlow = false;
  displaySanctionLetterOp = false;
  userId:any;

  allowDownloadDisbusement=false;
  disbursementDetails : any;

  constructor(private tnService: TnService,
    private modalService: NgbModal,
    public service: AdvancedService,
    private commonService: CommonService,
    private commonMethods: CommonMethods,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.commonService.DropDownjquery();
  }

  sanctionPageStatus = new sanctionReportStatus();

  ngOnInit(): void {
    this.proposalId = +this.commonService.getURLData('proposalId');
    this.borrowerProposalId = +this.commonService.getURLData('borrowerProposalId');
    this.applicationId = +this.commonService.getURLData('applicationId');
    this.breadCrumbItems = [{ label: 'Dashboard', path: '/' }, { label: 'Loan Applications View', path: '/', active: true }];
    this.jobId = CommonService.decryptFunction(this.route.snapshot.queryParams.jobId);
    this.statusId = CommonService.decryptFunction(this.route.snapshot.queryParams.statusId);
    this.roleId = CommonService.getStorage(Constants.httpAndCookies.ROLEID, true);
    this.proposalMappingId = CommonService.decryptFunction(this.route.snapshot.queryParams.proposalMappingId);
    this.districtId = CommonService.decryptFunction(this.route.snapshot.queryParams.districtId);
    this.getActiveSteps();
    //this.getMasterList();
    this.getMsmeProposalDetails();
    this.getApplicantdetailsProposal();
    this.userId = CommonService.getStorage(Constants.httpAndCookies.USER_ID,true);
    this.getSanctionDetails();
    this.getDisbursalDetails();

  }

  getDisbursalDetails(){
    this.tnService.getDisbursementDetails(this.applicationId, this.proposalId).subscribe(response=>{
      if(response != null && response.totalDisbursedAmount){
        this.disbursementDetails = response;
        this.allowDownloadDisbusement = true;
      }
    },error=>{
      this.commonService.warningSnackBar('Something went wrong.');
    });
  }

  getMasterList() {
    this.masterListRequest = ['TN_CONSTITUTION'];
    this.tnService.getEnumByType(this.masterListRequest).subscribe(res => {
      if (res && res.status == 200 && res.data) {
        this.masterlist = res.data;
        this.tnConstitutionList = this.masterlist.TN_CONSTITUTION;
        this.getMsmeProposalDetails();
        this.getApplicantdetailsProposal();
      }
    });
  }

  getSanctionDetails() {
    // console.log("Inside get Sanction details",this.applicationId);   
    this.tnService.getSanctionDetails(this.applicationId).subscribe(res => {
      if (res && res.data) {
        this.sanctionDetails = res.data;  
        // console.log(this.sanctionDetails);        
        // if(this.msmeProposalDetails && this.msmeProposalDetails.proposalStatusId){
        //   this.displaySanctionLetterOp = (this.msmeProposalDetails.proposalStatusId != 1 && this.msmeProposalDetails.proposalStatusId != 4);
        // }
      }
    });
  }

  // getMasterList() {
  //   this.masterListRequest = ['TN_CONSTITUTION'];
  //   this.tnService.getEnumByType(this.masterListRequest).subscribe(res => {
  //     if (res && res.status == 200 && res.data) {
  //       this.masterlist = res.data;
  //       this.tnConstitutionList = this.masterlist.TN_CONSTITUTION;
  //       this.getMsmeProposalDetails();
  //       this.getApplicantdetailsProposal();
  //     }
  //   });
  // }

  getMsmeProposalDetails() {
    this.tnService.getMsmeProposalDetails(this.proposalId, this.applicationId).subscribe(res => {
      if (res && res.data) {
        this.msmeProposalDetails = res.data;  
        
        if(this.msmeProposalDetails && this.msmeProposalDetails.proposalStatusId){
          this.displaySanctionLetterOp = (this.msmeProposalDetails.proposalStatusId != 1 && this.msmeProposalDetails.proposalStatusId != 4);
        }
      }
    });
  }

  getApplicantdetailsProposal() {
    this.tnService.getApplicantdetailsProposal(this.applicationId).subscribe(res => {
      if (res) {
        this.applicantdetails = res;
      }
    });
  }

  downloadCamReport() {   
    this.tnService.getMsmeCamReport(this.applicationId, this.proposalId).subscribe(success => {
      if (success.status === 200 && success.data != null) {
        const blob = 'data:application/pdf;base64,' + success.data;
        const link = document.createElement('a');
        link.href = blob;
        link.download = 'MSME_CAM' + this.applicationId + '.pdf';
        link.click();
      } else {
        this.commonService.errorSnackBar("Something Went Wrong");
      }
    });
  }

  downloadMsmeApplicationForm() {   
    this.tnService.getMsmeApplicationForm(this.applicationId, this.proposalId).subscribe(success => {
      if (success.status === 200 && success.data != null) {
        // if (success.data.docx) {
        //   const blob = 'data:application/vnd.openxmlformats-officedocument.wordprocessingml.document;base64,' + success.data.docx;
        //   const link = document.createElement('a');
        //   link.id = 'application-form-word';
        //   link.href = blob;
        //   link.download = 'APPLICATION_FORM' + '.doc';
        //   link.click();
        // }
        if (success.data.pdf) {
          const blobPdf = 'data:application/pdf;base64,' + success.data.pdf;
          const linkPdf = document.createElement('a');
          linkPdf.id = 'application-form-pdf';
          linkPdf.href = blobPdf;
          linkPdf.download = 'APPLICATION_FORM' + '.pdf';
          linkPdf.click();
        }
      } else {
        this.commonService.errorSnackBar("Something Went Wrong");
      }

    });
  }

  // Windi scroll Function
  @HostListener('window:scroll', ['$event'])
  onWindowScroll(e: any) {
    // window.innerHeight
    if (window.pageYOffset > window.innerHeight) {
      let element: any = document.getElementById('stick-headerN');
      element.classList.add('fix-to-top');
      this.adjustWidth();
    } else {
      let element: any = document.getElementById('stick-headerN');
      element.classList.remove('fix-to-top');
      //this.adjustWidthRemove();]
      // Fix After Remove Css
      let stickN: any = document.getElementById("stick-headerN");
      stickN.style.width = "100%"
    }
  }

  adjustWidth() {
    var parentwidth = $(".parent").width();
    $(".fix-to-top").width(parentwidth);
  }

  //  This js On Window Scroll Top set Cont Dont Remove @Nikul
  changeTab(tabId: number) {
    this.SubTab = tabId;
  }

  activeClick(tabId: number) {
    this.tab = tabId;
    if (tabId == 3) {
      this.getSanctionPageStatus()
    }
  }

  BMFIOS_Send_for_Approval_Popup(popUpObj, stepAction) {
    const config = {
      windowClass: 'Mediam-model',
      size: 'md'
    };
    const modalRef = this.modalService.open(BMFIOSSendForApprovedComponent, config);
    modalRef.componentInstance.popUpObj = popUpObj;
    modalRef.closed.subscribe(result => {
      if (result && result == 1) {
        this.updateWorkflow(stepAction);
      }
    });
    return modalRef;
  }

  openCommitteePopup(stepAction) {
    const config = {
      windowClass: 'Mediam-model',
      size: 'md'
    };
    const modalRef = this.modalService.open(CommitteBranchTransferPopupComponent, config);
    let popUpObj = { districtId: !this.commonService.isObjectNull(this.districtId) ? this.districtId : undefined };
    modalRef.componentInstance.popUpObj = popUpObj;
    modalRef.closed.subscribe(result => {
      if (result.type && result.type == 1) {
        if (result.meetingDate && result.meetingTime) {
          // to convert date into MM/DD/YYYY format
          const dateParts = result.meetingDate.split("-");
          const dateString = new Date(+dateParts[2], dateParts[1] - 1, +dateParts[0]);
          const month = ("0" + (dateString.getMonth() + 1)).slice(-2);
          const day = ("0" + dateString.getDate()).slice(-2);
          const fullDate = month + '/' + day + '/' + dateString.getFullYear();
          // To combine date and time
          const dateAndTime: any = moment(fullDate + ' ' + result.meetingTime);
          //Convert Date into timestamp
          result.meetingDateTime = dateAndTime._d.getTime();
        }
        this.updateWorkflow(stepAction, result);
      }
    });
    return modalRef;
  }

  Reason_View_Popup() {
    const config = {
      windowClass: 'Mediam-model',
      size: 'md'
    };
    const modalRef = this.modalService.open(BMFIOReasonComponent, config);
    return modalRef;
  }

  downloadZipFile(productDocumentMappingId, modualMasterId, documentType) {

    const data = {
      applicationId: this.applicationId,
      profileId: this.msmeProposalDetails?.profileId,
      productDocumentMappingIds: [productDocumentMappingId],
      moduleMasterIds: [modualMasterId],
    };

    if (productDocumentMappingId == 358) {
      data.productDocumentMappingIds.push(624)
    }else if (productDocumentMappingId == 575) {
      data.productDocumentMappingIds.push(365)
    }
    


    this.tnService.downloadZipFile(data).subscribe(success => {
      if (!this.commonService.isObjectNullOrEmpty(success)) {
        const blob = new Blob([success], { type: 'application/octet-stream' });
        if (blob.size <= 501) {
          this.commonService.warningSnackBar("File not found");
          return;
        }
        const a: any = document.createElement("a");
        document.body.appendChild(a);
        a.style = "display:none";
        var url = window.URL.createObjectURL(blob);
        a.href = url;
        a.download = 'MSME-' + documentType + '_' + this.applicationId + '.zip';
        a.click();
        a.remove();
      } else {
        this.commonService.warningSnackBar("File is not uploaded.");
      }
    });
  }

  navigate() {
    if (this.roleId == Constants.UserRoleList.BRANCH_MANAGER.id || this.roleId == Constants.UserRoleList.FIELD_INSPECTION_OFFICER.id) {
      this.router.navigate([Constants.ROUTE_URL.BMFIOS_LOAN_APPLICATION_LIST])
    } else {
      this.router.navigate([Constants.ROUTE_URL.COMMITTEE_LOAN_APPLICATION_VIEW])
    }
  }

  getActiveSteps() {
    this.isSanctionBtn = true;
    let req = { roleIds: [this.roleId], jobId: this.jobId, workflowId: 2 };
    this.tnService.getActiveSteps(req).subscribe(res => {
      if (res && res.status == 200 && res.data) {
        this.workflowData = res.data;

        if (this.workflowData.step.stepActions) {
          for (let j = 0; j < this.workflowData.step.stepActions.length; j++) {
            if (this.workflowData.step.stepActions[j].workflowStep == 21 || this.workflowData.step.stepActions[j].workflowStep == 22 || this.workflowData.step.stepActions[j].workflowStep == 31) {
              this.isSanctionBtn = false;
            }
          }
        }
      } else {
        // this.commonMethods.warningSnackBar(res?.message ? res.message : 'Something went wrong.');
      }
    });
  }

  performAction(stepAction) {
    if (stepAction.workflowStep == Constants.workflow.step.PSF_FIO.id && stepAction.action.id == Constants.workflow.sanctionFlowActions.PSF_SEND_FOR_APPROVAL.id) {
      let popUpObj = {
        title: "Send For Approval",
        body: "Are you sure you want to send for Approval",
        popupType: 1
      };
      this.BMFIOS_Send_for_Approval_Popup(popUpObj, stepAction);
    } else if (stepAction.workflowStep == Constants.workflow.step.PSF_BM.id && stepAction.action.id == Constants.workflow.sanctionFlowActions.PSF_SEND_BACK.id) {
      let popUpObj = {
        title: "Send Back",
        body: "Are you sure you want to send back to Field Investigation officer",
        popupType: 1
      };
      this.BMFIOS_Send_for_Approval_Popup(popUpObj, stepAction);
    } else if (stepAction.workflowStep == Constants.workflow.step.PSF_BM.id && stepAction.action.id == Constants.workflow.sanctionFlowActions.PSF_APPROVED.id) {
      let popUpObj = {
        title: "Approve Sanction Form",
        body: "Are you sure you want to approve Sanction Form?",
        popupType: 2
      };
      this.BMFIOS_Send_for_Approval_Popup(popUpObj, stepAction);
    } else if (stepAction.workflowStep == Constants.workflow.step.PSF_BM_SCHEDULE_MEETING.id && stepAction.action.id == Constants.workflow.sanctionFlowActions.SCHEDULE_MEETTING.id) {
      this.openCommitteePopup(stepAction);
    } else if (stepAction.workflowStep == Constants.workflow.step.PSF_BM.id && stepAction.action.id == Constants.workflow.sanctionFlowActions.PSF_HOLD.id) {
      let popUpObj = {
        title: "Hold",
        body: "Do you want to Hold the application?",
        popupType: 4
      };
      this.BMFIOS_Send_for_Approval_Popup(popUpObj, stepAction);
    } else if (stepAction.workflowStep == Constants.workflow.step.PSF_BM.id && stepAction.action.id == Constants.workflow.sanctionFlowActions.PSF_REJECT.id) {
      let popUpObj = {
        title: "Reject",
        body: "Do you want to reject the application?",
        popupType: 5
      };
      this.BMFIOS_Send_for_Approval_Popup(popUpObj, stepAction);
    } else if (stepAction.workflowStep == Constants.workflow.step.SF_FIO.id && stepAction.action.id == Constants.workflow.sanctionFlowActions.SF_SEND_FOR_APPROVAL.id) {
      let popUpObj = {
        title: "Send For Approval",
        body: "Are you sure you want to send for Approval",
        popupType: 1
      };
      this.BMFIOS_Send_for_Approval_Popup(popUpObj, stepAction);
    } else if (stepAction.workflowStep == Constants.workflow.step.PSF_BM_RECO.id && stepAction.action.id == Constants.workflow.sanctionFlowActions.BM_RECO.id
      || stepAction.workflowStep == Constants.workflow.step.PSF_LBM_RECO.id && stepAction.action.id == Constants.workflow.sanctionFlowActions.LBM_RECO.id
      || stepAction.workflowStep == Constants.workflow.step.PSF_GM_RECO.id && stepAction.action.id == Constants.workflow.sanctionFlowActions.GM_RECO.id) {
      this.Recommendation_Popup(stepAction);
    } else if (stepAction.workflowStep == Constants.workflow.step.PSF_BM_COMPLETED.id && stepAction.action.id == Constants.workflow.sanctionFlowActions.COMPLETED_MEETTING.id
      || stepAction.workflowStep == Constants.workflow.step.PSF_LBM_E_SIGN.id && stepAction.action.id == Constants.workflow.sanctionFlowActions.LBM_E_SIGN.id
      || stepAction.workflowStep == Constants.workflow.step.PSF_BM_E_SIGN.id && stepAction.action.id == Constants.workflow.sanctionFlowActions.BM_E_SIGN.id
      || stepAction.workflowStep == Constants.workflow.step.PSF_GM_E_SIGN.id && stepAction.action.id == Constants.workflow.sanctionFlowActions.GM_E_SIGN.id) {
      this.updateWorkflow(stepAction);
    } else if (stepAction.workflowStep == Constants.workflow.step.PSF_BM_SANCTION_HOLD_REJECT.id && stepAction.action.id == Constants.workflow.sanctionFlowActions.PSF_HOLD.id) {
      this. sanction_hold_tsv_Popup(stepAction);
    } else if (stepAction.workflowStep == Constants.workflow.step.PSF_BM_SANCTION_HOLD_REJECT.id && stepAction.action.id == Constants.workflow.sanctionFlowActions.PSF_REJECT.id) {
      this.sanction_reject_tsv_Popup(stepAction);
    } else if (stepAction.workflowStep == Constants.workflow.step.PSF_BM_SANCTION_HOLD_REJECT.id && stepAction.action.id == Constants.workflow.sanctionFlowActions.PSF_SANCTION.id) {
      this.Sanction_tsv_Popup(stepAction);
    } else if (stepAction.workflowStep == Constants.workflow.step.PSF_BM_HOLD.id && stepAction.action.id == Constants.workflow.sanctionFlowActions.PSF_REJECT.id) {
      this.sanction_reject_tsv_Popup(stepAction);
    } else if (stepAction.workflowStep == Constants.workflow.step.PSF_BM_HOLD.id && stepAction.action.id == Constants.workflow.sanctionFlowActions. PSF_SANCTION.id) {
      this.Sanction_tsv_Popup(stepAction);
    } else if (stepAction.workflowStep == Constants.workflow.step.SF_BM.id && stepAction.action.id == Constants.workflow.sanctionFlowActions.SF_APPROVED.id) {
      let popUpObj = {
        title: "Approve Sanction Letter",
        body: "Are you sure you want to approve Sanction Letter?",
        popupType: 2
      };
      this.BMFIOS_Send_for_Approval_Popup(popUpObj, stepAction);
    }else if (stepAction.workflowStep == Constants.workflow.step.SF_BM.id && stepAction.action.id == Constants.workflow.sanctionFlowActions.SF_SEND_BACK.id) {
      let popUpObj = {
        title: "Send Back",
        body: "Are you sure you want to send back to Field Investigation officer",
        popupType: 1
      };
      this.BMFIOS_Send_for_Approval_Popup(popUpObj, stepAction);
    } else if (stepAction.workflowStep == Constants.workflow.step.BM_DISBURSE.id && stepAction.action.id == Constants.workflow.sanctionFlowActions.DISBURSE.id) {
      this.disbursementPopup(stepAction);

      

    }
  }

  disbursementPopup(stepAction) {
    const config = {
      windowClass: 'popup-650',
      // size: 'lg'
    };
    // console.log("return value",this.sanctionDetails.sanctionAmount)
    const data = {
      applicationId: this.applicationId,
      proposalId: this.proposalId,
      sanctionAmount:this.sanctionDetails.sanctionAmount
    }

    // this.navigateToDibusementNotePage();

    this.commonService.openPopUp(data, BMFIOSDisburseProposalComponent, false, config).result.then(result => {
      if (result && result == true) {
        this.updateWorkflowForDisbusement(stepAction);
      }
    });
  }

  navigateToDibusementNotePage(){
    this.router.navigate([Constants.ROUTE_URL.DISBURSMENT_CERTIFICATE], {
      queryParams: {
        applicationId: this.commonService.setURLData(this.applicationId.toString()),
        proposalId: this.commonService.setURLData(this.proposalId.toString()),        
        borrowerProposalId: this.commonService.setURLData(this.borrowerProposalId),
        statusId: this.commonService.setURLData(this.statusId),
        jobId: this.commonService.setURLData(this.jobId),
        proposalMappingId: this.commonService.setURLData(this.proposalMappingId),
        districtId:this.commonService.setURLData(this.districtId.toString())
      }
    });
  }

  Sanction_tsv_Popup(stepAction) {
    const config = {
      windowClass: 'popup-650',
      // size: 'lg'
    };
    const data = {
      applicationId: this.applicationId,
      proposalId: this.proposalId,
      elAmount:this.msmeProposalDetails.elAmount

    }   
    this.commonService.openPopUp(data, BMFIOSSanctionProposalComponent, false, config).result.then(result => {
      if (result) {
        this.updateWorkflow(stepAction);
      }
    });
  }

  sanction_hold_tsv_Popup(stepAction) {
    const config = {
      windowClass: 'popup-650',
      // size: 'lg'
    };
    const data = {
      applicationId: this.applicationId,
      proposalId: this.proposalId
    }

    this.commonService.openPopUp(data, HoldTsvPopupComponent, false, config).result.then(result => {
      if (result) {
        this.updateWorkflow(stepAction);
      }
    });
  }

  sanction_reject_tsv_Popup(stepAction) {
    const config = {
      windowClass: 'popup-650',
      // size: 'lg'
    };
    const data = {
      applicationId: this.applicationId,
      proposalId: this.proposalId
    }

    this.commonService.openPopUp(data, RejectTsvPopupComponent, false, config).result.then(result => {
      if (result) {
        this.updateWorkflow(stepAction);
      }
    });
  }

  Recommendation_Popup(stepAction) {
    const config = {
      windowClass: 'Mediam-model',
      size: 'md'
    };
    const modalRef = this.modalService.open(BmfiosGiveRecommedationComponent, config);
    modalRef.closed.subscribe(result => {
      if (result && result.isSaved) {
        // console.log(result);
        this.updateWorkflow(stepAction, result);
      }
    });
    return modalRef;
  }


  updateWorkflowForDisbusement(stepAction, otherObjReq?) {
    const workflowReq = {
      jobId: this.jobId,
      applicationId: this.proposalMappingId,
      proposalId: this.proposalId,
      workflowId: 2,
      userId: this.userId,
      roleIds: [this.roleId],
      toStep: stepAction?.nextworkflowStep,
      actionId: stepAction?.action?.id,
      currentStep: stepAction?.workflowStep,
      otherReqObject: otherObjReq
    };
    this.tnService.updateSanctionWrokflow(workflowReq).subscribe(succss => {
     
      
      if (succss && succss.status == 200) {
        this.navigateToDibusementNotePage();
      } else {
        this.commonMethods.warningSnackBar(succss.message);
      }
    });
  }

  updateWorkflow(stepAction, otherObjReq?, isNavigate?) {
    const workflowReq = {
      jobId: this.jobId,
      applicationId: this.proposalMappingId,
      proposalId: this.proposalId,
      workflowId: 2,
      userId: this.userId,
      roleIds: [this.roleId],
      toStep: stepAction?.nextworkflowStep,
      actionId: stepAction?.action?.id,
      currentStep: stepAction?.workflowStep,
      otherReqObject: otherObjReq
    };
    this.tnService.updateSanctionWrokflow(workflowReq).subscribe(succss => {
      if (succss && succss.status == 200) {
        if (!isNavigate) {
          this.commonMethods.successSnackBar('Proposal updated successfully.');
          // this.getActiveSteps();
          if (this.roleId == Constants.UserRoleList.BRANCH_MANAGER.id || this.roleId == Constants.UserRoleList.FIELD_INSPECTION_OFFICER.id) {
            this.router.navigate([Constants.ROUTE_URL.BMFIOS_LOAN_APPLICATION_LIST]);
          } else {
            this.router.navigate([Constants.ROUTE_URL.COMMITTEE_LOAN_APPLICATION_VIEW]);
          }
        }
      } else {
        this.commonMethods.warningSnackBar(succss.message);
      }
    });
  }
  getSanctionPageStatus() {
    this.tnService.getSanctionPageStatus(this.applicationId).subscribe(res => {
      if (res && res.data && res.status == 200 && res.flag) {
        this.sanctionPageStatus = res.data;
        this.setWorkFlowButton();
      }
    });
  }

  updateSaveBtnWorkflow() {
    let stepAction = {
      jobId: this.jobId,
      applicationId: this.proposalMappingId,
      proposalId: this.proposalId,
      workflowId: 2,
      nextworkflowStep: -1,
      action: { id: -1 },
      workflowStep: -1,
    }

    if (this.statusId == Constants.ApplicationStatusMaster.SF_SANCTIONED) {
      stepAction = {
        jobId: this.jobId,
        applicationId: this.proposalMappingId,
        proposalId: this.proposalId,
        workflowId: 2,
        nextworkflowStep: -2,
        action: { id: -2 },
        workflowStep: -2,
      }
    }
    this.updateWorkflow(stepAction, undefined, true);
  }

  updateFlag(event) {
    if (event.tabId == 1) {
      this.sanctionPageStatus.preScreeningStatus = event.isCompleted;
      this.updateSaveBtnWorkflow();
    } else if (event.tabId == 2) {
      this.sanctionPageStatus.preSanctionStatus = event.isCompleted;
      this.updateSaveBtnWorkflow();
    } else if (event.tabId == 3) {
      this.sanctionPageStatus.bankSanctionStatus = event.isCompleted;
      this.updateSaveBtnWorkflow();
    } else if (event.tabId == 4) {
      this.sanctionPageStatus.branchManagerRemarks = event.isCompleted;
    } else if (event.tabId == 5) {
      this.sanctionPageStatus.sanctionLetter = event.isCompleted;
      this.updateSaveBtnWorkflow();
    }
    this.setWorkFlowButton();
  }

  setWorkFlowButton() {
    if (this.roleId == this.roleMaster.FIELD_INSPECTION_OFFICER.id) {
      (this.sanctionPageStatus.preScreeningStatus && this.sanctionPageStatus.preSanctionStatus
        && this.sanctionPageStatus.bankSanctionStatus && this.sanctionPageStatus.branchManagerRemarks
        && this.sanctionPageStatus.sanctionLetter && this.statusId == 14) // Sanctioned Application
        ? this.isShowWorkFlow = true
        : (this.sanctionPageStatus.preScreeningStatus && this.sanctionPageStatus.preSanctionStatus
          && this.sanctionPageStatus.bankSanctionStatus && (this.statusId == 1 || this.statusId == 2))  // New / In-progress Application
          ? this.isShowWorkFlow = true : (this.sanctionPageStatus.preScreeningStatus && this.sanctionPageStatus.preSanctionStatus
            && this.sanctionPageStatus.bankSanctionStatus && this.sanctionPageStatus.branchManagerRemarks && this.statusId == 4) // Send Back Application
            ? this.isShowWorkFlow = true : (this.sanctionPageStatus.preScreeningStatus && this.sanctionPageStatus.preSanctionStatus
              && this.sanctionPageStatus.bankSanctionStatus && this.sanctionPageStatus.branchManagerRemarks 
              && this.sanctionPageStatus.sanctionLetter && (this.statusId == 15 || this.statusId == 17 )) ? this.isShowWorkFlow = true : this.isShowWorkFlow = false; // Send Back After Sanction Application
    } else if (this.roleId == this.roleMaster.BRANCH_MANAGER.id) {
      (this.sanctionPageStatus.preScreeningStatus && this.sanctionPageStatus.preSanctionStatus
        && this.sanctionPageStatus.bankSanctionStatus && this.sanctionPageStatus.branchManagerRemarks
        && this.sanctionPageStatus.sanctionLetter && (this.statusId == 16))
        ? this.isShowWorkFlow = true
        : (this.sanctionPageStatus.preScreeningStatus && this.sanctionPageStatus.preSanctionStatus
          && this.sanctionPageStatus.bankSanctionStatus && this.sanctionPageStatus.branchManagerRemarks && this.statusId == 3)
          ? this.isShowWorkFlow = true : this.isShowWorkFlow = false;
    }
  }
  downloadFile(fileName, productDocumentMappingId) {
    const data = {
      applicationId: this.applicationId,
      productDocumentMappingIds: [productDocumentMappingId],
      proposalId: this.proposalId
    }

    if (productDocumentMappingId == 766) {
      data.productDocumentMappingIds.push(767)
      data.productDocumentMappingIds.push(768)
      data.productDocumentMappingIds.push(769)
      data.productDocumentMappingIds.push(770)
      data.productDocumentMappingIds.push(771)

    }

    if (productDocumentMappingId == 778) {
      data.productDocumentMappingIds.push(772)
      data.productDocumentMappingIds.push(773)
      data.productDocumentMappingIds.push(774)
      data.productDocumentMappingIds.push(775)
      data.productDocumentMappingIds.push(776)

    }

    this.tnService.downloadFileByProductDocumentMappingId(data).subscribe(success => {
      // const blob = new Blob([success], { type: 'application/pdf;base64' });
      const blob = new Blob([success], { type: success.type });
      if (productDocumentMappingId == 592 && (blob.size <= 700)) {
        this.commonService.warningSnackBar("No Record Found");
        return;
      }
      if (blob.size <= 700) {
        this.commonService.warningSnackBar("File not found");
        return;
      }
      const a: any = document.createElement("a");
      document.body.appendChild(a);
      a.style = "display:none";
      var url = window.URL.createObjectURL(blob);
      a.href = url;
      if (success.type == "image/png") {
        a.download = fileName + ".png";
      } else if (success.type == "image/jpeg") {
        a.download = fileName + ".jpeg";
      } else if (success.type == "image/tiff") {
        a.download = fileName + ".tiff";
      } else if (success.type == "text/html") {
        a.download = fileName + ".html";
      } else {
        a.download = fileName + ".pdf";
      }
      a.click();
      a.remove();
    }, error => {
      if (error.status === 500) {
        this.commonService.warningSnackBar("File is not uploaded.");
      }
      else {
        this.commonService.errorSnackBar("Something Went Wrong");
      }
    });
  }

  downloadSanctionReport(type?) {
    this.tnService.getSanctionReport(this.applicationId, this.proposalId).subscribe(success => {
      if (success.status === 200 && success.data != null) {
        if (success.data.pdf) {
          const blobPdf = 'data:application/pdf;base64,' + success.data.pdf;
          const linkPdf = document.createElement('a');
          linkPdf.id = 'sanction-report-pdf';
          linkPdf.href = blobPdf;
          linkPdf.download = 'SANCTION_REPORT' + '.pdf';
          linkPdf.click();
        }        
        // if (success.data.docx) {
        //   const blob = 'data:application/vnd.openxmlformats-officedocument.wordprocessingml.document;base64,' + success.data.docx;
        //   const link = document.createElement('a');
        //   link.id = 'sanction-report-word';
        //   link.href = blob;
        //   link.download = 'SANCTION_REPORT' + '.doc';
        //   link.click();
        // }

      } else {
        this.commonService.errorSnackBar("Something Went Wrong");
      }
    });
  }
  downloadSanctionLetter() {
    this.tnService.getSanctionLetter(this.applicationId, this.proposalId).subscribe(success => {
      if (success.status === 200 && success.contentInBytes != null) {
        if (success.contentInBytes) {
          const blobPdf = 'data:application/pdf;base64,' + success.contentInBytes;
          const linkPdf = document.createElement('a');
          linkPdf.id = 'sanction-letter-pdf';
          linkPdf.href = blobPdf;
          linkPdf.download = 'SANCTION_LETTER' + '.pdf';
          linkPdf.click();
        }        
        // if (success.data.docx) {
        //   const blob = 'data:application/vnd.openxmlformats-officedocument.wordprocessingml.document;base64,' + success.data.docx;
        //   const link = document.createElement('a');
        //   link.id = 'sanction-letter-word';
        //   link.href = blob;
        //   link.download = 'SANCTION_LETTER' + '.doc';
        //   link.click();
        // }
      } else {
        this.commonService.errorSnackBar("Something Went Wrong");
      }
    });
  }

  downloadFIOReport() {
    this.tnService.getFioReport(this.borrowerProposalId, this.proposalMappingId).subscribe(success => {
      if (success.status === 200 && success.data != null) {
        // if (success.data) {
        //   const blob = 'data:application/vnd.openxmlformats-officedocument.wordprocessingml.document;base64,' + success.data;
        //   const link = document.createElement('a');
        //   link.id = 'fio-report-word';
        //   link.href = blob;
        //   link.download = 'FIO_REPORT' + '.doc';
        //   link.click();
        // }
        if (success.data) {
          const blobPdf = 'data:application/pdf;base64,' + success.data;
          const linkPdf = document.createElement('a');
          linkPdf.id = 'fio-report-pdf';
          linkPdf.href = blobPdf;
          linkPdf.download = 'FIO_REPORT' + '.pdf';
          linkPdf.click();
        }  
      } else {
        this.commonService.errorSnackBar("Something Went Wrong");
      }
    });
  }

  downloadDisbursalNotReport() {
    this.tnService.getDisbursementNoteReport(this.applicationId,this.proposalId).subscribe(success => {
    if(success.status === 200 && success.data != null) {
      if (success.data) {
        const blobPdf = 'data:application/pdf;base64,' + success.data;
        const linkPdf = document.createElement('a');
        linkPdf.id = 'fio-report-pdf';
        linkPdf.href = blobPdf;
        linkPdf.download = 'DISBURSEMENT_NOTE' + '.pdf';
        linkPdf.click();
      }  
    } else {
      this.commonService.errorSnackBar("Something Went Wrong");
    }
  });
}

}
