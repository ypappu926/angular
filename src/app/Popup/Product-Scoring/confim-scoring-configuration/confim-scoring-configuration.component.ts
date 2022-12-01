import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { CommonService } from 'src/app/CommoUtils/common-services/common.service';
import { Constants } from 'src/app/CommoUtils/constants';

@Component({
  selector: 'app-confim-scoring-configuration',
  templateUrl: './confim-scoring-configuration.component.html',
  styleUrls: ['./confim-scoring-configuration.component.scss']
})
export class ConfimScoringConfigurationComponent implements OnInit {
  @Input() public user: any;
  @Input() public typeId: any;
  @Input() public statusId: any;
  @Input() public currentObj: any;
  public roleId: any;
  routeMainPath: any;
  constructor(
    public activeModal: NgbActiveModal,
    private router: Router,
    private commonService: CommonService,
  ) {
    this.routeMainPath = "TIIC";
  }

  ngOnInit(): void {
    this.roleId = Number(CommonService.getStorage(Constants.httpAndCookies.ROLEID, true));
  }

  editScoring() {
    this.activeModal.close();
    let scoringId;
    if (this.typeId === 1) {
      let type = "1";
      scoringId = this.user.id;
      if (this.statusId == 3) {
        type = "2"
        scoringId = this.user.scoringModelTempId;
      }

      this.router.navigate([this.routeMainPath + '/Scoring-Edit', CommonService.encryptFunction(scoringId), CommonService.encryptFunction(type)]);
    } else {
      this.router.navigate([this.routeMainPath + '/Scoring-New'], { queryParams: { id: CommonService.encryptFunction(this.user.id) } });
      // this.router.navigate(['/Education-Loan/EL-Product-Scoring/Scoring-New'],  {queryParams:{ id: this.commonService.toBTOA(this.user.id)}});

    }

  }

  closeModal() {
    this.activeModal.close();
  }

}
