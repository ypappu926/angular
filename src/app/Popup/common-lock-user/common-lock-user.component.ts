import { Component, Input, OnInit } from '@angular/core';
import { CommonService } from 'src/app/CommoUtils/common-services/common.service';
import { TnService } from 'src/app/services/tn.service';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-common-lock-user',
  templateUrl: './common-lock-user.component.html',
  styleUrls: ['./common-lock-user.component.scss']
})
export class CommonLockUserComponent implements OnInit {

  @Input() popUpObj: any = {};
  emailId: any;
  userId: any;
  isLocked:any;

  constructor(public activeModal: NgbActiveModal, private tnService: TnService, private commonService: CommonService, private modalService: NgbModal, private router: Router) { }

  ngOnInit(): void {
    this.emailId = this.popUpObj.emailId;
    this.userId = this.popUpObj.userId;
    this.isLocked = this.popUpObj.isLocked;
  }

  isUserLocked() {
    this.tnService.isUserLocked({ userId: this.userId }).subscribe(res => {
      if (res && res.status == 200) {
        this.commonService.successSnackBar(res.message);
        this.cancelPopup();


      }

    });
  }

  cancelPopup() {
    this.activeModal.close('ok');


    //this.router.navigate(['/TIIC/AllUser-List']);
  }

}
