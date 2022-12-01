import { Component, Input, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { CommonMethods } from 'src/app/CommoUtils/common-services/common-methods';
import { CommonService } from 'src/app/CommoUtils/common-services/common.service';
import { Constants } from 'src/app/CommoUtils/constants';

@Component({
  selector: 'app-bmfios-give-recommedation',
  templateUrl: './bmfios-give-recommedation.component.html',
  styleUrls: ['./bmfios-give-recommedation.component.scss']
})
export class BmfiosGiveRecommedationComponent implements OnInit {
  userRoleId;
  remarks;
  keypressEvent;
  constructor(private activeModal: NgbActiveModal, private commonService: CommonService, public commonMethods: CommonMethods) {
    this.userRoleId = CommonService.getStorage(Constants.httpAndCookies.ROLEID, true);
  }

  ngOnInit(): void {
  }

  close(flag) {
    const data: any = {};
    if (!flag) {
      data.isSaved = false;
    } else {
      if(this.commonService.isObjectNull(this.remarks)) {
        this.commonService.warningSnackBar('Please fill remarks');
        return;
      }
      data.isSaved = true;
      if (this.userRoleId == Constants.UserRoleList.BRANCH_MANAGER.id) {
        data.bmRemarks = this.remarks;
      } else if (this.userRoleId == Constants.UserRoleList.LEAD_BANK_MANAGER.id) {
        data.lbmRemarks = this.remarks;
      } else if (this.userRoleId == Constants.UserRoleList.GENERAL_MANAGER.id) {
        data.gmRemarks = this.remarks;
      }
    }
    this.activeModal.close(data);
  }
}
