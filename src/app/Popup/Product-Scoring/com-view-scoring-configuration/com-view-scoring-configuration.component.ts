import { Component, Input, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-com-view-scoring-configuration',
  templateUrl: './com-view-scoring-configuration.component.html',
  styleUrls: ['./com-view-scoring-configuration.component.scss']
})
export class ComViewScoringConfigurationComponent implements OnInit {

 
  @Input() popUpObj: any;
  editConfigurationParamter:any={};
  byIdData:any={};
  constructor(public activeModal: NgbActiveModal) { }

  ngOnInit(): void {
    this.editConfigurationParamter=this.popUpObj.editConfigurationParamter;
    console.log(this.editConfigurationParamter)
  }
}