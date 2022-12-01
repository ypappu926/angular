import { Component, Input, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { CommonMethods } from 'src/app/CommoUtils/common-services/common-methods';
import { TnService } from 'src/app/services/tn.service';

@Component({
  selector: 'app-bmfios-send-for-approved',
  templateUrl: './bmfios-send-for-approved.component.html',
  styleUrls: ['./bmfios-send-for-approved.component.scss']
})
export class BMFIOSSendForApprovedComponent implements OnInit {

  @Input() popUpObj;
  constructor(private commonMethods: CommonMethods, private activeModal: NgbActiveModal,private tnService:TnService) { }

  ngOnInit(): void {
    console.log('popUpObj: ',this.popUpObj);
  }

  close(type) {
    this.activeModal.close(type);
  }

}
