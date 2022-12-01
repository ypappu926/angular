import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { CommonService } from 'src/app/CommoUtils/common-services/common.service';
import { Constants } from 'src/app/CommoUtils/constants';
import { ScoringService } from 'src/app/services/scoring.service';

@Component({
  selector: 'app-com-confim-configuration',
  templateUrl: './com-confim-configuration.component.html',
  styleUrls: ['./com-confim-configuration.component.scss']
})
export class ComConfimConfigurationComponent implements OnInit {

  @Input() public user: any;
  @Input() public typeId: any;
  @Input() public statusId: any;
  @Input() public currentObj: any;
  public roleId: number;

  constructor(
    public activeModal: NgbActiveModal,
    private router: Router,
    private commonService: CommonService,
    private autoRenewal: ScoringService
  ) { 
    this.roleId = 0;
  }

  ngOnInit(): void {
    console.log('user===========>', this.user);
    console.log('typeId===========>', this.typeId);
    this.roleId = Number(CommonService.getStorage(Constants.httpAndCookies.ROLEID, true));
  }

  editScoring() {
    this.activeModal.close();
    if(this.typeId === 1){
      let type = "1";
      let scoringId  = this.user.id;
      if (this.statusId == 3) {
        type = "2"
      }
        // scoringId = this.user.scoringModelTempId;
        const data = { type: 7 }

    this.router.navigate(['/Product-Scoring/Scoring-Edit', CommonService.encryptFunction(scoringId), CommonService.encryptFunction(type)]);
    }else{
      this.router.navigate(['/Product-Scoring/Scoring-New'],  {queryParams:{ id: CommonService.encryptFunction(this.user.id)}});

    }
    
  }

  closeModal(){
    this.activeModal.close();
  }

}
