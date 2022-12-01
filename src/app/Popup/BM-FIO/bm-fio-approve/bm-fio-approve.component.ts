import { Component, Input, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { CommonMethods } from 'src/app/CommoUtils/common-services/common-methods';

@Component({
  selector: 'app-bm-fio-approve',
  templateUrl: './bm-fio-approve.component.html',
  styleUrls: ['./bm-fio-approve.component.scss']
})
export class BMFIOApproveComponent implements OnInit {
  @Input() popUpObj;
  selectValue;
  data;
  reason;
  constructor(public activeModal: NgbActiveModal, private commonMethods: CommonMethods) { }

  
  ngOnInit(): void {
    this.selectValue = this.popUpObj?.list;
  }

  close(type) {
    if(type == 1) {
      // if(!this.data) {
      //   this.commonMethods.warningSnackBar("To proceed further please select reason.")
      //   return;
      // } 
      // else if(this.data == 3 && !this.reason) {
      //   this.commonMethods.warningSnackBar("Please Enter reject reason.")
      //   return;
      // }
      // const data = {
      //   statusId : this.data,
      //   reason: this.reason
      // }
      this.activeModal.close(1);
    } else {
      this.activeModal.close();
    }
  }

}
