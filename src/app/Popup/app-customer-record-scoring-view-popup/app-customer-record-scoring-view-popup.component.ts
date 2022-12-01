import { Component, Input, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-app-customer-record-scoring-view-popup',
  templateUrl: './app-customer-record-scoring-view-popup.component.html',
  styleUrls: ['./app-customer-record-scoring-view-popup.component.scss']
})
export class AppCustomerRecordScoringViewPopupComponent implements OnInit {

  @Input() popUpObj: any;
  scoringDetails: any;

  constructor(public activeModal: NgbActiveModal) { }

  ngOnInit(): void {
    this.scoringDetails = JSON.parse(this.popUpObj);
  }

}
