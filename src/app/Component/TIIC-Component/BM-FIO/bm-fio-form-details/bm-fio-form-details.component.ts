import { Component, HostListener, OnInit, ViewChild } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CommonMethods } from 'src/app/CommoUtils/common-services/common-methods';
import { BMFIOApproveComponent } from 'src/app/Popup/BM-FIO/bm-fio-approve/bm-fio-approve.component';
import { BMFIOPositiveComponent } from 'src/app/Popup/BM-FIO/bm-fio-positive/bm-fio-positive.component';
import { BMFIORejectComponent } from 'src/app/Popup/BM-FIO/bm-fio-reject/bm-fio-reject.component';
import { BMFIOTransferProposalComponent } from 'src/app/Popup/BM-FIO/bm-fio-transfer-proposal/bm-fio-transfer-proposal.component';
import { TnService } from 'src/app/services/tn.service';
import { ApplicantDetals, AssetDetailsProxy, BusinessDetailsProxy, MajorCustomerDetailsProxy, PromoterDetailsProxy, RawMaterialProxy } from './bm-fio-form-module';
declare var jQuery: any;
declare var $: any;
import * as _ from 'lodash';
import { NgForm } from '@angular/forms';
import { CommonService } from 'src/app/CommoUtils/common-services/common.service';
import { Constants } from 'src/app/CommoUtils/constants';
import { ActivatedRoute, Router } from '@angular/router';
import { ApplicantDetailsModel } from '../../Ho-Bo/ho-bo-datafields/ho-bo-datafields-model';
@Component({
  selector: 'app-bm-fio-form-details',
  templateUrl: './bm-fio-form-details.component.html',
  styleUrls: ['./bm-fio-form-details.component.scss']
})
export class BMFIOFormDetailsComponent implements OnInit {

  // bread crumb items
  breadCrumbItems: Array<{}>;
  selectValue = [];
  industryList = [];
  industryProductList = [];
  constitutionList = [];
  descriptionList = [];
  rejectList = [];
  negativeList = [];
  sendToBmList = [];
  fioTransferList = [];
  bmTransferList = [];
  isDisplayDownloadBtn =false;
  fileToUpload: File = null;

  applicantDetals = new ApplicantDetals();
  borrowerProposalId;
  proposalMappingId;
  inspectedName;
  workflowData; 
  roleId;
  jobId;
  max;
  isSaveButton = false;
  @ViewChild('applicantDetailForm') applicantDetailForm: NgForm;
  constant = Constants;
  isProceed = false;
  isBMLogin = false;
  isViewMode = false;
  flag = false;
  disableFlag: boolean = false;
  applicantDetailsBo = new ApplicantDetailsModel();
  constructor(private modalService: NgbModal, private commonMethods: CommonMethods, private service: TnService, private router: Router, private route: ActivatedRoute) { 
    commonMethods.getValidationByModule(Constants.validationModule.FIO_BM_DATA_FIELDS);
  }

  ngOnInit(): void {
    this.breadCrumbItems = [{ label: 'Dashboard', path: Constants.ROUTE_URL.FIO_LIST }, { label: 'form', path: Constants.ROUTE_URL.FIO_LIST, active: true}];
    this.inspectedName = CommonService.getStorage(Constants.httpAndCookies.USER_NAME, true);
    this.roleId = CommonService.getStorage(Constants.httpAndCookies.ROLEID, true);
    let isCallWorkFlow = true;
    if(this.roleId != this.constant.UserRoleList.FIELD_INSPECTION_OFFICER.id) {
      this.isBMLogin = true;
    } else { 
      this.disableFlag = true;     
      let isFioActive = CommonService.decryptFunction(this.route.snapshot.queryParams.isFioActive);
      let orgId = CommonService.getStorage(Constants.httpAndCookies.ORGID, true);
      if(!CommonService.isObjectNullOrEmpty(orgId) && (Number(orgId) == 303) && isFioActive == "true") {
        isCallWorkFlow = false;
        this.isViewMode = true;
      }
    }
    this.max = { year: new Date().getFullYear(), month: new Date().getMonth() + 1, day: new Date().getDate() };
    this.jobId = CommonService.decryptFunction(this.route.snapshot.queryParams.pid);
    this.borrowerProposalId = CommonService.decryptFunction(this.route.snapshot.queryParams.id);
    this.proposalMappingId = CommonService.decryptFunction(this.route.snapshot.queryParams.proposalMappingId);
    let viewMode = CommonService.decryptFunction(this.route.snapshot.queryParams.viewMode);
    if(viewMode == "true") {
      this.isViewMode = true;
    }

    if(!this.isViewMode || this.isBMLogin) {
      this.getActiveSteps();
    }
    
    this.getMasterList();
    const tabId = CommonService.getStorage(Constants.httpAndCookies.TAB_ID,true);

    if(tabId == "2"){
      this.isDisplayDownloadBtn = true;
    }

    this.getFieldDetails(this.borrowerProposalId);
    
  }

  getActiveSteps() {
    let req = { roleIds: [this.roleId], jobId: this.jobId, workflowId: 1 };
    this.service.getActiveSteps(req).subscribe(res => {
      if (res && res.status == 200 && res.data) {
        this.workflowData = res.data;
      } else {
        // this.commonMethods.warningSnackBar(res?.message ? res.message : 'Something went wrong.');
      }
    });
  }


  getMasterList() {
    const list = ['YES_NO_LIST', 'TN_CONSTITUTION', 'DESCRIPTION', 'NEGATIVE_REASON', 'REJECT_REASON', 'SEND_TO_BM','FIO_TRANSFER_LIST','BM_TRANSFER_LIST'];
    this.service.getListByClass(list).subscribe(res => {
      if (res && res.status == 200 && res.data) {
        this.selectValue = res.data.YES_NO_LIST;
        this.constitutionList = res.data.TN_CONSTITUTION;
        this.descriptionList = res.data.DESCRIPTION;
        this.rejectList = res.data.REJECT_REASON;
        this.negativeList = res.data.NEGATIVE_REASON;
        this.sendToBmList = res.data.SEND_TO_BM;
        this.fioTransferList = res.data.FIO_TRANSFER_LIST;
        this.bmTransferList = res.data.BM_TRANSFER_LIST;
        this.getApplicantDetails();
      }
    });
  }

  // GET APPLICANT DETAILS
  getApplicantDetails() {
    this.service.getApplicantDetail(this.borrowerProposalId, this.proposalMappingId).subscribe(res => {
      if (res && res.status == 200 && res.flag && res.data) {
        this.applicantDetals = res.data;
        if(!this.applicantDetals.businessDetailsProxy) {
          this.applicantDetals.businessDetailsProxy = new BusinessDetailsProxy();
        }
        // if (this.applicantDetals?.applicantDetailsProxy?.typeOfIndustry) {
        //   this.getIndustryList();
        //   this.getIndustryProductList(this.applicantDetals.applicantDetailsProxy.typeOfIndustry);
        // }
        this.getIndustryList();
        if(this.applicantDetals?.applicantDetailsProxy?.typeOfIndustry){
          this.getIndustryProductList(this.applicantDetals.applicantDetailsProxy.typeOfIndustry);
        }
        if(this.applicantDetals?.assetDetailsProxies?.length == 0 && !this.isBMLogin && !this.isViewMode) {
          this.addRemoveForm('add','asset');
        }
        if(this.applicantDetals?.majorCustomerDetailsProxies?.length == 0 && !this.isBMLogin && !this.isViewMode) {
          this.addRemoveForm('add','major');
        }
        if(this.applicantDetals?.rawMaterialProxies?.length == 0 && !this.isBMLogin && !this.isViewMode) {
          this.addRemoveForm('add','raw');
        }
        if(!this.applicantDetals?.applicantDetailsProxy?.promoterDetailsList){
          this.addRemoveForm('add','promoter');
        }
        this.setJson();
        this.flag = true;
      } else {
        this.commonMethods.errorSnackBar(res?.message ? res.message : 'Something went wrong.');
      }
    });
  }

  setJson() {
    if(!this.applicantDetals.businessDetailsProxy.buttonStatusId) {
      this.applicantDetals.businessDetailsProxy.statusName = 'New Application';
    } else if(this.applicantDetals.businessDetailsProxy.buttonStatusId == this.constant.ApplicationStatusMaster.APPROVED_BY_BM) {
      this.applicantDetals.businessDetailsProxy.statusName = 'Completed';
    } else {
      const index = _.findIndex(Constants.FioBmStatusMaster, { id: this.applicantDetals.businessDetailsProxy.buttonStatusId })
      if (index != -1) {
        if(this.isBMLogin) {
          this.applicantDetals.businessDetailsProxy.statusName = Constants.FioBmStatusMaster[index].bmDisplayName;
        } else {
          this.applicantDetals.businessDetailsProxy.statusName = Constants.FioBmStatusMaster[index].fioDisplayName;
        }
        if(this.applicantDetals.businessDetailsProxy.buttonStatusId == 21) { // TRANSFERED BY BRANCH OFFICE / FIO
          this.applicantDetals.businessDetailsProxy.statusName = this.applicantDetals.businessDetailsProxy.statusName + (CommonService.isObjectNullOrEmpty(this.applicantDetals.businessDetailsProxy.branchName) ? '-' : this.applicantDetals.businessDetailsProxy.branchName);
        }
      }
    }
  }

  getIndustryList() {
    this.service.getIndustryList().subscribe(success => {
      if (success && success.listData && success.status == 200) {
        this.industryList = success.listData;
      } else {
        this.commonMethods.warningSnackBar(success?.message ? success.message : 'Something went wrong.')
      }
    });
  }

  getIndustryProductList(industryId) {
    this.service.getIndustryProductList(industryId).subscribe(success => {
      if (success && success.listData && success.status == 200) {
        this.industryProductList = success.listData;
      } else {
        this.commonMethods.warningSnackBar(success?.message ? success.message : 'Something went wrong.');        
      }
    });
  }

  changeTypeOfIndustry(_event: any) {
    this.getIndustryProductList(this.applicantDetals.applicantDetailsProxy.typeOfIndustry);
    this.applicantDetals.applicantDetailsProxy.typeOfProduct = null;
  }

  setTotal(type) {
    if(type == 'asset') {
      this.applicantDetals.businessDetailsProxy.totalAssets = 0;
      this.applicantDetals.assetDetailsProxies.forEach(element => {
        this.applicantDetals.businessDetailsProxy.totalAssets += +element.amount;
      });
    } else if(type == 'labour') {
      let sum: Number = 0;
      ['admin', 'skilled', 'unskilled'].forEach(element => {
        if(this.applicantDetals.businessDetailsProxy[element]) {
          sum = sum + this.applicantDetals.businessDetailsProxy[element];
        }
        this.applicantDetals.businessDetailsProxy.labourTechnicalTotal = sum;
      });
    }
  }

  addRemoveForm(type, form, index?) {
    if(type == 'add') {
      if(form == 'asset') {
        this.applicantDetals.assetDetailsProxies.push(new AssetDetailsProxy());
      } else if(form == 'major') {
        this.applicantDetals.majorCustomerDetailsProxies.push(new MajorCustomerDetailsProxy());
      } else if(form == 'raw') {
        this.applicantDetals.rawMaterialProxies.push(new RawMaterialProxy());
      } else if(form == 'addAll'){
        this.applicantDetals.assetDetailsProxies.push(new AssetDetailsProxy());
        this.applicantDetals.majorCustomerDetailsProxies.push(new MajorCustomerDetailsProxy());
        this.applicantDetals.rawMaterialProxies.push(new RawMaterialProxy());
      } else if(form == 'promoter'){
        this.applicantDetals.applicantDetailsProxy.promoterDetailsList = [];
        this.applicantDetals.applicantDetailsProxy.promoterDetailsList.push(new PromoterDetailsProxy());
      }
    } else if(type == 'remove') {
      this.applicantDetals[form].splice(index,1);
      // this.applicantDetals[form].removeAt(index);
      if(form.includes('asset')) {
        this.setTotal('asset');
      }
    }
  }


  
  performAction(stepAction) {
    this.isSaveButton = false;
    if (stepAction.action.id == Constants.workflow.action.FIO_SAVE.id) {
      this.applicantDetals.businessDetailsProxy.buttonStatusId = 11;
      this.isSaveButton = true;
      setTimeout(() => {
        this.proceed(stepAction);
      }, 0);
    } else if (stepAction.action.id == Constants.workflow.action.POSITIVE.id) {
      this.applicantDetals.businessDetailsProxy.buttonStatusId = 14;
      this.Positive_Popup(stepAction);
    } else if (stepAction.action.id == Constants.workflow.action.NEGATIVE.id 
      || stepAction.action.id == Constants.workflow.action.REJECT.id 
      || stepAction.action.id == Constants.workflow.action.SEND_TO_BM.id) {
      this.Reject_Popup(stepAction);
    } else if (stepAction.action.id == Constants.workflow.action.APPROVE.id
      || stepAction.action.id == Constants.workflow.action.SEND_BACK_TO_FIO.id) {
      this.Approve_Popup(stepAction);
    } else if (stepAction.action.id == Constants.workflow.action.E_SIGN.id) {
      this.commonMethods.infoSnackBar("E-Sign Functionality is under progress, Please try after sometimes.")
    } else if(stepAction.action.id == Constants.workflow.action.TRANSFER.id){
      this.transferPopUp(stepAction);
    }else {
      
    }
  }

  transferPopUp(stepAction){
    const config = {
      windowClass: 'Mediam-model',
      size: 'md'
    };
    this.applicantDetals.businessDetailsProxy.buttonStatusId = Constants.ApplicationStatusMaster.TRANSFERED_BY_BRANCH;
    const data = {borrowerProposalId:this.borrowerProposalId,proposalMappingId:this.proposalMappingId,bmTransferList:this.bmTransferList,fioTransferList:this.fioTransferList};
    const modalRef = this.modalService.open(BMFIOTransferProposalComponent, config);
    modalRef.componentInstance.popUpObj = data;
    modalRef.closed.subscribe(result => {
      if(result != null && result != undefined) {
        result.borrowerProposalId = this.borrowerProposalId;
        result.id = this.proposalMappingId;
        result.applicantDetailsId = this.applicantDetals.applicantDetailsProxy.id;
        this.service.transferProposal(result).subscribe(success =>{
          if(success && success.status == 200){
            this.commonMethods.successSnackBar("Proposal transfered successfully.");
            this.applicantDetals.businessDetailsProxy.statusId = result.transferReasonId;
            this.applicantDetals.businessDetailsProxy.reason = result.otherTransferReason;
            this.updateProposalStauts(stepAction);
            return;
          } else{
            if(success && success.message){
              this.commonMethods.warningSnackBar(success.message);  
              return;
            }
          }
          this.commonMethods.warningSnackBar("Failed transfer proposal.");
        });
        // console.log("result:: " , result);
      }
    });
  }
  

  proceed(stepAction) {
    this.isProceed = true;
    setTimeout(() => {
      if(this.applicantDetailForm.invalid) {
        this.applicantDetailForm.form.markAllAsTouched();
        this.commonMethods.warningSnackBar("Please fill required fields.");
        this.isProceed = false;
        return;
      }
      if(this.applicantDetals.businessDetailsProxy.connectedLoad) {
        if(!this.applicantDetals.businessDetailsProxy.sanctionedLoad || 
          (Number(this.applicantDetals.businessDetailsProxy.connectedLoad) >= Number(this.applicantDetals.businessDetailsProxy.sanctionedLoad))) {
          this.commonMethods.warningSnackBar("Connected load must be lower than Sanctioned load.");
          this.isProceed = false;
          return;
        }
      }
      this.applicantDetals.businessDetailsProxy.borrowerProposalId = this.borrowerProposalId;
      this.applicantDetals.businessDetailsProxy.proposalMappingId = this.proposalMappingId;
      const data = _.cloneDeep(this.applicantDetals);
      this.service.saveApplicantDetail(data).subscribe(res=> {
        if(res && res.status == 200 && res.flag) {
          this.updateWorkflow(stepAction);
          this.isProceed = false;
        } else {
          this.commonMethods.errorSnackBar(res?.message ? res.message : 'Something went wrong.');
          this.isProceed = false;
        }
      });
    }, 0);
  }

  updateProposalStauts(stepAction) {
    this.applicantDetals.businessDetailsProxy.borrowerProposalId = this.borrowerProposalId;
    this.applicantDetals.businessDetailsProxy.proposalMappingId = this.proposalMappingId;
    this.service.updateProposalStauts(this.applicantDetals).subscribe(res=> {
      if(res && res.status == 200 && res.flag) {
        this.updateWorkflow(stepAction);
      } else {
        this.commonMethods.errorSnackBar(res?.message ? res.message : 'Something went wrong.');
        this.isProceed = false;
      }
    });
  }

  updateWorkflow(stepAction) {
    const workflowReq = { 
      jobId: this.jobId, 
      applicationId: this.borrowerProposalId,
      workflowId: 1,
      roleIds: [this.roleId],
      toStep: stepAction.nextworkflowStep,
      actionId: stepAction.action.id,
      currentStep: stepAction.workflowStep
    };
    this.service.updateWrokflow(workflowReq).subscribe(succss => {
      if (succss && succss.status == 200) {
        this.commonMethods.successSnackBar('Details updated suceessfully.');
        if(stepAction.action.buttonText != 'Save') {
          this.navigate();
        } else if(this.applicantDetals.businessDetailsProxy.statusName == 'New') {
          this.applicantDetals.businessDetailsProxy.statusName = 'In-Progress';
        }
      } else {
        this.commonMethods.warningSnackBar(succss.message);
      }
    });
  }

  // Windi scroll Function
  @HostListener('window:scroll', ['$event'])
  onWindowScroll(e: any) {
    if (window.pageYOffset > window.innerHeight) {
      let element: any = document.getElementById('stick-headerN');
      element?.classList?.add('fix-to-top');
      this.adjustWidth();
    } else {
      let element: any = document.getElementById('stick-headerN');
      element?.classList?.remove('fix-to-top');
      //this.adjustWidthRemove();]
      // Fix After Remove Css
      let stickN: any = document.getElementById("stick-headerN");
      stickN.style.width = "100%"
    }
  }

  adjustWidth() {
    var parentwidth = $(".parent").width();
    $(".fix-to-top").width(parentwidth);
    // console.log(parentwidth);
  }

  // Sample Popup Code
  Common_Tranfer_Proposal_Popup() {
    const config = {
      windowClass: 'Mediam-model',
      size: 'md'
    };
    const modalRef = this.modalService.open(BMFIOTransferProposalComponent, config);
    // BMFIOCommonProposalComponent
    return modalRef;
  }

  Reject_Popup(stepAction) {
    const config = {
      windowClass: 'Mediam-model',
      size: 'md'
    };
    const data: any = { };
    if (stepAction.action.id == Constants.workflow.action.NEGATIVE.id) {
      this.applicantDetals.businessDetailsProxy.buttonStatusId = Constants.ApplicationStatusMaster.NEGATIVE;
      data.title = "Negative Field inspection";
      data.content = "Do you want to confirm negative field inspection report?";
      data.list = this.negativeList;
      data.otherValue = 6;
    } else if (stepAction.action.id == Constants.workflow.action.REJECT.id) {
      this.applicantDetals.businessDetailsProxy.buttonStatusId = Constants.ApplicationStatusMaster.REJECTED_BY_BM;
      data.title = "Reject";
      data.content = "Do you want to reject the application ?";
      data.list = this.rejectList;
      data.otherValue = 2;
    } else if(stepAction.action.id == Constants.workflow.action.SEND_TO_BM.id) {
      this.applicantDetals.businessDetailsProxy.buttonStatusId = Constants.ApplicationStatusMaster.SEND_TO_BM;
      data.title = "Send Back Proposal";
      data.content = "Are you sure you want to send back the proposal to BM?";
      data.list = this.sendToBmList;
      data.otherValue = 3;
    }
    const modalRef = this.modalService.open(BMFIORejectComponent, config);
    modalRef.componentInstance.popUpObj = data;
    modalRef.closed.subscribe(result => {
      if(result != null && result != undefined) {
        // call update api
        this.applicantDetals.businessDetailsProxy.statusId = result.statusId;
        this.applicantDetals.businessDetailsProxy.reason = result.reason;
        if(stepAction.action.id == Constants.workflow.action.SEND_TO_BM.id) {
          this.updateProposalStauts(stepAction)
        } else {
          this.proceed(stepAction);
        }
      }
    });
  }

  Approve_Popup(stepAction) {
    const config = {
      windowClass: 'Mediam-model',
      size: 'md',
    };
    const data: any = { };
    if (stepAction.action.id == Constants.workflow.action.APPROVE.id) {
      this.applicantDetals.businessDetailsProxy.buttonStatusId = Constants.ApplicationStatusMaster.APPROVED_BY_BM;
      data.title = 'Approve Proposal';
      data.content = 'Are you sure you want to approve the proposal? Once you approve you have to digital sign the proposal.';
    } else if (stepAction.action.id == Constants.workflow.action.SEND_BACK_TO_FIO.id) {
      this.applicantDetals.businessDetailsProxy.buttonStatusId = Constants.ApplicationStatusMaster.SEND_BACK_TO_FIO;
      data.title = "Send Back";
      data.content = "Are you sure you want to send back the proposal to field inspection officer for changes?";
      // data.list = this.sendToBmList;
    } 
    const modalRef = this.modalService.open(BMFIOApproveComponent, config);
    modalRef.componentInstance.popUpObj = data;
    modalRef.closed.subscribe(result => {
      if(result == 1) {
        // call update api
        this.applicantDetals.businessDetailsProxy.statusId = null;
        this.applicantDetals.businessDetailsProxy.reason = null;
        this.proceed(stepAction);
      }
    });
  }

  // Negative_Popup(stepAction) {
  //   const config = {
  //     windowClass: 'Mediam-model',
  //     size: 'md'
  //   };
  //   const data = {
  //     list: this.negativeList,
  //   }
  //   const modalRef = this.modalService.open(BMFIONegativeComponent, config);
  //   modalRef.componentInstance.popUpObj = data;
  //   modalRef.closed.subscribe(result => {
  //     if(result != null && result != undefined) {
  //       // call update api
  //       this.applicantDetals.businessDetailsProxy.statusId = result.statusId;
  //       this.applicantDetals.businessDetailsProxy.reason = result.reason;
  //       this.proceed(stepAction);
  //     }
  //   });
  // }

  Positive_Popup(stepAction) {
    const config = {
      windowClass: 'Mediam-model',
      size: 'md'
    };
    const modalRef = this.modalService.open(BMFIOPositiveComponent, config);
    modalRef.closed.subscribe(result => {
      if(result == 1) {
        this.proceed(stepAction);
      }
    });
  }

  // Enter 1 for numbes-only ,2 for character-only ,3 for alphanumeric only ,4 for alphabet-with-space ,5 for alphanumeric with space ,6 no space, 7 no numeric and space value
  keyPressEvent(event, type): boolean {
    return this.commonMethods.keyPressEvent(event, type);
  }

  navigate() {
    this.router.navigate([Constants.ROUTE_URL.FIO_LIST])
  }

  identify(index, item){
    return index; 
 }

 downloadFIOReport() {
    this.service.getFioReport(this.borrowerProposalId, this.proposalMappingId).subscribe(success => {
    if (success.status === 200 && success.data != null) {
      if(success.data){
        // const blob = 'data:application/vnd.openxmlformats-officedocument.wordprocessingml.document;base64,' + success.data;
        // const link = document.createElement('a');
        // link.id = 'fio-report-word';
        // link.href = blob;
        // link.download = 'FIO_REPORT' + '.doc';
        // link.click();

        const blobPdf = 'data:application/pdf;base64,' + success.data;
        const linkPdf = document.createElement('a');
        linkPdf.id = 'fio-report-pdf';
        linkPdf.href = blobPdf;
        linkPdf.download = 'FIO_REPORT' + '.pdf';
        linkPdf.click();
      }
    } else {
      this.commonMethods.errorSnackBar("Something Went Wrong");
    }
  });
}

  getFieldDetails(consentId) {
    this.service.getFieldDetails(consentId, Constants.UserRoleList.BANK_BO.id).subscribe(success => {
      if (success && success.data && success.data.fields) {
        this.applicantDetailsBo = JSON.parse(success.data.fields);
        // console.log('this.applicantDetailsBo: ', this.applicantDetailsBo);
      }
    });
  }
}

