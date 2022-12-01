import { Component, Input, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { CommonMethods } from 'src/app/CommoUtils/common-services/common-methods';

@Component({
  selector: 'app-app-customer-record-eligiblity-view-popup',
  templateUrl: './app-customer-record-eligiblity-view-popup.component.html',
  styleUrls: ['./app-customer-record-eligiblity-view-popup.component.scss']
})
export class AppCustomerRecordEligiblityViewPopupComponent implements OnInit {

  @Input() popUpObj: any;
  eligibilityDetails: any;
  constructor(public activeModal: NgbActiveModal, private commonMethod: CommonMethods) { }

  ngOnInit(): void {
    this.eligibilityDetails = this.popUpObj;
  }

  copyToClipBoard(data, isJson) {
    this.commonMethod.copyToClipBoard(data, isJson);
  }

}