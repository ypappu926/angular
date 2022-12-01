import { Component, Input, OnInit } from '@angular/core';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ActivatedRoute, Router } from '@angular/router';
import { TnService } from 'src/app/services/tn.service';
import { CommonService } from 'src/app/CommoUtils/common-services/common.service';

@Component({
  selector: 'app-common-reset-password',
  templateUrl: './common-reset-password.component.html',
  styleUrls: ['./common-reset-password.component.scss']
})
export class CommonResetPasswordComponent implements OnInit {

  @Input() popUpObj: any = {};
  emailId: any;
  userId: any;

  constructor(public activeModal: NgbActiveModal, private tnService: TnService, private commonService: CommonService, private modalService: NgbModal, private router: Router) { }

  ngOnInit(): void {
    this.emailId = this.popUpObj.emailId;
    this.userId = this.popUpObj.userId;
  }

  isUserResetPassword() {
    this.tnService.isUserResetPassword({ userId: this.userId }).subscribe(res => {
      if (res && res.status == 200) {
        this.commonService.successSnackBar(res.message);
        this.cancelPopup();

      }

    });
  }

  cancelPopup() {
    this.activeModal.close('close');
    // this.router.navigate(['/TIIC/AllUser-List']);
  }
}
