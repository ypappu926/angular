import { Component, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-bm-fio-common-proposal',
  templateUrl: './bm-fio-common-proposal.component.html',
  styleUrls: ['./bm-fio-common-proposal.component.scss']
})
export class BMFIOCommonProposalComponent implements OnInit {

  selectValue: string[];
  constructor(private activeModal: NgbActiveModal) { }

  ngOnInit(): void {
  }

  close(type){
    this.activeModal.close(type);
  }
}
