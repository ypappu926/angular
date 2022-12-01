import { Component, Input, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-com-view-product-configuration',
  templateUrl: './com-view-product-configuration.component.html',
  styleUrls: ['./com-view-product-configuration.component.scss']
})
export class ComViewProductConfigurationComponent implements OnInit {

  @Input() popUpObj: any;
  editConfigurationParamter:any={};
  byIdData:any={};
  constructor(public activeModal: NgbActiveModal) { }

  ngOnInit(): void {
    this.editConfigurationParamter=this.popUpObj.editConfigurationParamter;
    this.byIdData=this.popUpObj.byIdData;
    // console.log(this.editConfigurationParamter);
  }

}
