import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-proposal-bifurcation-popup',
  templateUrl: './proposal-bifurcation-popup.component.html',
  styleUrls: ['./proposal-bifurcation-popup.component.scss']
})
export class ProposalBifurcationPopupComponent implements OnInit {
  selectValue!: string[];
  constructor() { }

  ngOnInit(): void {
    this.selectValue = ['TIIC', 'TAICO'];
  }

}
