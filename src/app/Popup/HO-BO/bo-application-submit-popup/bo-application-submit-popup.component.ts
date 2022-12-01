import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { CommonMethods } from 'src/app/CommoUtils/common-services/common-methods';
import { CommonService } from 'src/app/CommoUtils/common-services/common.service';
import { Constants } from 'src/app/CommoUtils/constants';

@Component({
  selector: 'app-bo-application-submit-popup',
  templateUrl: './bo-application-submit-popup.component.html',
  styleUrls: ['./bo-application-submit-popup.component.scss']
})
export class BOApplicationSubmitPopupComponent implements OnInit {

  roleId : any;
  constructor(public activeModal: NgbActiveModal,private router: Router,private commonMethods: CommonMethods) { 
  }

  ngOnInit(): void {
    this.roleId = CommonService.getStorage(Constants.httpAndCookies.ROLEID, true);
  }

  close(type){
   this.activeModal.close(type);
  }
}
