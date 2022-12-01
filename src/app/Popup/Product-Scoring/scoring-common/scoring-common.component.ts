import { Component, Input, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ScoringService } from 'src/app/services/scoring.service';


@Component({
  selector: 'app-scoring-common',
  templateUrl: './scoring-common.component.html',
  styleUrls: ['./scoring-common.component.scss']
})
export class ScoringCommonComponent implements OnInit {

  @Input() popUpObj: any;
  scoringObj: any = {};
  remarks: any;
  constructor(public activeModal: NgbActiveModal, private autoRenewal: ScoringService) { }

  ngOnInit(): void {
    console.log(this.popUpObj);
  }

  sendBackToMaker() {
    this.scoringObj.id = this.popUpObj.id;
    this.scoringObj.remarks = this.remarks;
    this.autoRenewal.approveScoringModel(this.scoringObj, 2).subscribe(success => {
      if (success.status === 200) {
        this.activeModal.close('Ok');
      }
    });
  }
}
