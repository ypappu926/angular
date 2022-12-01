import { Component, Input, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { CommonMethods } from 'src/app/CommoUtils/common-services/common-methods';

@Component({
  selector: 'app-app-customer-record-parameter-popup',
  templateUrl: './app-customer-record-parameter-popup.component.html',
  styleUrls: ['./app-customer-record-parameter-popup.component.scss']
})
export class AppCustomerRecordParameterPopupComponent implements OnInit {

  @Input() popUpObj: any;
  parameterList: any = [];

  constructor(public activeModal: NgbActiveModal,
    private commonMethod: CommonMethods) { }

  ngOnInit(): void {

    this.parameterList = this.popUpObj;

  }

}
