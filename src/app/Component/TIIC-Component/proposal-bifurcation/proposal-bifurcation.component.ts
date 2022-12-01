import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ProposalBifurcationCommonPopupComponent } from 'src/app/Popup/proposal-bifurcation-common-popup/proposal-bifurcation-common-popup.component';
import { ProposalBifurcationPopupComponent } from 'src/app/Popup/proposal-bifurcation-popup/proposal-bifurcation-popup.component';

@Component({
  selector: 'app-proposal-bifurcation',
  templateUrl: './proposal-bifurcation.component.html',
  styleUrls: ['./proposal-bifurcation.component.scss']
})
export class ProposalBifurcationComponent implements OnInit {

  tab: any;
  isActive = false;
  // bread crumb data
  breadCrumbItems!: Array<{}>;
  selectValue!: string[];

  constructor(private modalService: NgbModal) { }

  ngOnInit(): void {
    this.breadCrumbItems = [{ label: 'Dashboard', path: '/' }, { label: 'proposal bifurcation', path: '/',active: true }];
  }

  Change_proposal_bifurcation_Popup() {
    const config = {
      windowClass: 'popup-650',
    };
    const modalRef = this.modalService.open(ProposalBifurcationPopupComponent, config);
    return modalRef;
  }
  Common_proposal_bifurcation_Popup() {
    const config = {
      windowClass: 'popup-650',
    };
    const modalRef = this.modalService.open(ProposalBifurcationCommonPopupComponent, config);
    return modalRef;
  }
}
