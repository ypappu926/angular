import { Component, Input, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { CommonMethods } from 'src/app/CommoUtils/common-services/common-methods';
import { Constants } from 'src/app/CommoUtils/constants';
import { TnService } from 'src/app/services/tn.service';

@Component({
  selector: 'app-committe-branch-transfer-popup',
  templateUrl: './committe-branch-transfer-popup.component.html',
  styleUrls: ['./committe-branch-transfer-popup.component.scss']
})
export class CommitteBranchTransferPopupComponent implements OnInit {

  @Input() popUpObj;
  constructor(private commonMethods: CommonMethods, private activeModal: NgbActiveModal,private tnService:TnService) { }

  districtList:any=[];
  lbmUserList:any=[];
  gmUserList:any=[];
  // minDate;
  ngOnInit() {

    // const current = new Date();
    // this.minDate = {
    //   year: current.getFullYear(),
    //   month: current.getMonth() + 1,
    //   day: current.getDate()
    // };

    setTimeout(() => {
      this.getDistrictList();      
    }, 0);
  }

  getDistrictList(){
    this.tnService.getDistrictList().subscribe(success =>{
      if(success && success.data){
        this.districtList = success.data;
        return;
      }
      this.commonMethods.warningSnackBar("Failed to get district list");
    });
  } 

  getLbmGmUserList(){
    this.popUpObj.lbmUserId = undefined;
    this.popUpObj.gmUserId = undefined;
    if(this.popUpObj && this.popUpObj.districtId){
      this.getLbmUserList(this.popUpObj.districtId);
      this.getGmUserList(this.popUpObj.districtId);
    }
  }

  getLbmUserList(districtId){
    this.lbmUserList = [];
    this.tnService.getUserListByRoleIdAndDistrictId(Constants.UserRoleList.LEAD_BANK_MANAGER.id,districtId).subscribe(success =>{
        if(success && success.data){
          this.lbmUserList = success.data;
        }
    });
  }

  getGmUserList(districtId){
    this.gmUserList = [];
    this.tnService.getUserListByRoleIdAndDistrictId(Constants.UserRoleList.GENERAL_MANAGER.id,districtId).subscribe(success =>{
      if(success && success.data){
        this.gmUserList = success.data;
      }
  });
  }

  selectValue: string[];

  close(type){
    this.popUpObj.type = type;
    if(this.popUpObj.type ==1){
      if(!this.popUpObj || !this.popUpObj.districtId){
        this.commonMethods.warningSnackBar('Please select district.');
        return;
      }else if(!this.popUpObj.lbmUserId){
        this.commonMethods.warningSnackBar('Please select LBM user.');
        return;
      }else if(!this.popUpObj.gmUserId){
        this.commonMethods.warningSnackBar('Please select Gm user.');
        return;
      }else if(!this.popUpObj.meetingLink){
        this.commonMethods.warningSnackBar('Please Enter Meeting link.');
        return;
      }else if(!this.popUpObj.meetingDate){
        this.commonMethods.warningSnackBar('Please Select Meeting Date.');
        return;
      }else if(!this.popUpObj.meetingTime){
        this.commonMethods.warningSnackBar('Please Select Meeting Time.');
        return;
      }
      this.activeModal.close(this.popUpObj);
    }else if(this.popUpObj.type ==2){
      this.activeModal.close();
    }
  }
}
