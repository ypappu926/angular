import { ReturnStatement } from '@angular/compiler/src/output/output_ast';
import { Component, Input, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';
import { CommonMethods } from 'src/app/CommoUtils/common-services/common-methods';
import { CommonService } from 'src/app/CommoUtils/common-services/common.service';
import { Constants } from 'src/app/CommoUtils/constants';
import { TnService } from 'src/app/services/tn.service';
@Component({
  selector: 'app-bm-fio-transfer-proposal',
  templateUrl: './bm-fio-transfer-proposal.component.html',
  styleUrls: ['./bm-fio-transfer-proposal.component.scss']
})
export class BMFIOTransferProposalComponent implements OnInit {

  selectValue: string[];
  data;
  inputData:any={};
  reason;
  districtList=[];
  branchList=[];
  orgTypeList=[];
  fioList;
  orgId:any;
  
  @Input() popUpObj;

  constructor(private commonMethods: CommonMethods, private activeModal: NgbActiveModal,private tnService:TnService) { 
    this.inputData.transferType = 1;

    
    

  }


  getAdminConfigs(){
    this.tnService.getAdminConfig(-1).subscribe(success =>{

      let isEnabledTransfer = false;
        if(success && success.status && success.data){
          isEnabledTransfer = success.data.isEnableTransfer;
          if(isEnabledTransfer){
            this.orgTypeList.push({orgId:Constants.department.DIC.id,orgName:Constants.department.DIC.name});
            //this.orgTypeList.push({orgId:303,orgName:"TAICO"});
          }
          return;
        }
        this.commonMethods.warningSnackBar("Failed to get admin configs");
    },error =>{
      this.commonMethods.warningSnackBar("Failed to get admin configs");
    });
  }


  changeTab(tabId){
    this.inputData={};
    this.inputData.transferType=tabId;

    if(tabId ==2){
      this.getDistrictList();
    }
  }

  ngOnInit(): void {
    this.orgId = (CommonService.getStorage(Constants.httpAndCookies.ORGID, true));  
    if(this.orgId == Constants.department.TIIC.id){
      this.orgTypeList = [
        {orgId:Constants.department.TIIC.id,orgName:Constants.department.TIIC.name},
      ];
    }else if(this.orgId == Constants.department.TAICO.id){
      this.orgTypeList = [
        {orgId:Constants.department.TAICO.id,orgName:Constants.department.TAICO.name}
      ];
    }
  }

  close(type) {
    if (type != -1) {
      if (type == 2) {
        
          if (!this.inputData.districtId) {
            this.commonMethods.warningSnackBar("To proceed further please select district.")
            return;
          }

          if (!this.inputData.branchId) {
            this.commonMethods.warningSnackBar("To proceed further please select branch.")
            return;
          }

          if (!this.inputData.transferReasonId) {
            this.commonMethods.warningSnackBar("To proceed further please select reason.")
            return;
          }

          if (this.inputData.transferReasonId == 4 && !this.inputData.otherTransferReason) {
            this.commonMethods.warningSnackBar("To proceed further please input reason.")
            return;
          }
      } else if (type == 1) {
          if (!this.inputData.fioDepartmentId) {
            this.commonMethods.warningSnackBar("To proceed further please select fio department.")
            return;
          }

          if (!this.inputData.subsidiaryFioUserId) {
            this.commonMethods.warningSnackBar("To proceed further please select fio.")
            return;
          }

          if (!this.inputData.transferReasonId)  {
            this.commonMethods.warningSnackBar("To proceed further please select reason.")
            return;
          }

          if (this.inputData.transferReasonId == 3 && !this.inputData.otherTransferReason) {
            this.commonMethods.warningSnackBar("To proceed further please input reason.")
            return;
          }

          if(this.inputData.fioDepartmentId == Constants.department.TIIC.id){
            this.inputData.transferType = 3; // to identify in backend transfer to other tiic fio
          }
       }
      this.activeModal.close(this.inputData);
    } else {
      this.activeModal.close();
    }
  }

  getFioList(){
    if(!this.inputData.fioDepartmentId){
      this.fioList = [];
      return;
    }
    this.tnService.getFioUsersList(this.inputData.fioDepartmentId,this.popUpObj.proposalMappingId).subscribe(success =>{

      if(success && success.status == 200 && success.data){
        this.fioList = success.data;
        for(let i=0;i<this.fioList.length;i++){
          this.fioList[i].name = this.fioList[i].firstName + " " + this.fioList[i].lastName;
        }
        return;
      }
      this.commonMethods.warningSnackBar("Failed to get fio users list");
    },error =>{
        this.commonMethods.warningSnackBar("Failed to get fio users list");
    });
  }

  getBranchDetails(){

  }

  getBranchList(){

  }

  getDistrictList(){
    this.tnService.getDistrictList().subscribe(success =>{
      if(success &&success.status == 200 && success.data ){
        this.districtList = success.data;
        return;
      }
      this.commonMethods.warningSnackBar("Failed to get district list.")
    },error =>{
      this.commonMethods.warningSnackBar("Failed to get district list.")
    })
  }

  getPincodeList(){

    if(!this.inputData.districtId){
      this.inputData.branchId = null;
      this.branchList = [];
      return;
    }
    this.tnService.getBranchListByDistrictId(this.inputData.districtId,this.popUpObj.proposalMappingId).subscribe(success =>{
      if(success && success.status == 200 && success.data){

        this.branchList = success.data;
        if(this.branchList.length == 0){
          this.commonMethods.warningSnackBar("No branch register in district.")
          return;
        }
      }
    },error =>{
      this.commonMethods.warningSnackBar("No branch register in district.")
    })
  }

}
