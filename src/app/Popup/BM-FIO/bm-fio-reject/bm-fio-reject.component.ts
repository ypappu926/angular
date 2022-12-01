import { Component, Input, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { CommonMethods } from 'src/app/CommoUtils/common-services/common-methods';

@Component({
  selector: 'app-bm-fio-reject',
  templateUrl: './bm-fio-reject.component.html',
  styleUrls: ['./bm-fio-reject.component.scss']
})
export class BMFIORejectComponent implements OnInit {

  selectValue;
  data;
  reason;
  @Input() popUpObj;
  constructor(private commonMethods: CommonMethods, private activeModal: NgbActiveModal) { }

  ngOnInit(): void {
    this.selectValue = this.popUpObj?.list;
  }

  close(type) {
    if(type == 1) {
      if(!this.data) {
        this.commonMethods.warningSnackBar("To proceed further please select reason.")
        return;
      } else if(this.data == this.popUpObj.otherValue && !this.reason) {
        this.commonMethods.warningSnackBar("Please Enter reject reason.")
        return;
      }
      const data = {
        statusId : this.data,
        reason: this.reason
      }
      this.activeModal.close(data);
    } else {
      this.activeModal.close();
    }
  }


}
