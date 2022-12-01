import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { ControlContainer, NgForm } from '@angular/forms';
import { CommonService } from 'src/app/CommoUtils/common-services/common.service';
import { TnService } from 'src/app/services/tn.service';
import { AddressMasterModel } from 'src/app/Component/TIIC-Component/Ho-Bo/ho-bo-datafields/ho-bo-datafields-model';
import { CommonMethods } from 'src/app/CommoUtils/common-services/common-methods';
@Component({
  selector: 'app-address-master',
  templateUrl: './address-master.component.html',
  styleUrls: ['./address-master.component.scss'],
  viewProviders: [{provide: ControlContainer, useExisting: NgForm }]
})
export class AddressMasterComponent implements OnInit, OnChanges {
  stateList: any = [
    {
      id: 35,
      value: 'Tamil Nadu'
    }
  ];

  cityList: any = [];
  districtList: any = [];
  pincodeList: any = [];
  blockList: any = [];
  flag = false;

  @Input() address = new AddressMasterModel();
  @Input() isDisable = false;
  @Input() otherDisableFlag = false;
  @Input() isHoBoValidation = false;
  @Input() isBmFioValidation = false;
  @Input() data;
  @Input() isValidationShow = true;
  @Input() isRemoveRequired = false;
  @Input() submitted = false;
  @Input() formName;

  @Output() onFieldBlur = new EventEmitter<any>();
  // @Input() form;

  @Input() campOrgId;

  constructor(private service: TnService, public commonService: CommonService, private commonMethods:CommonMethods) { }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.campOrgId) {
      this.campOrgId = changes.campOrgId;
      if (this.address.districtId && changes.campOrgId.previousValue) {
        this.address.pincode = null;
        this.getPincodeList(this.address.districtId,this.campOrgId, false);
      }
    }
  }
  ngOnInit(): void {
    if (this.address) {
      this.getDistrictList();
      this.getCityList();
      if (this.address.districtId) {
        this.pincodeList = [];
        this.getPincodeList(this.address.districtId,this.campOrgId);
        this.getBlockList(this.address.districtId);
      }
      if(!this.address.stateId) {
        this.address.stateId = this.stateList[0].id;
      }
    }
    if(!this.formName) {
      this.formName = 'tempForm';
    }
    this.flag = true;
  }

  getPincodeList(districtId, campOrgId, isDataSetNull?) {

    if(campOrgId?.currentValue){
      campOrgId = campOrgId.currentValue;
    }
    // this.service.getFioCreatedPincodeList().subscribe(res => {
    //   this.pincodeList = [];
    //   if (res && res.status == 200 && res.flag && res?.data?.length > 0) {
    //     this.pincodeList = res.data;
    //   }
    // });
    this.service.getFioCreatedPincodeList(districtId,campOrgId).subscribe(res => {
      this.pincodeList = [];
      if (res && res.status == 200 && res?.data?.length > 0) {
        this.pincodeList = res.data;
        if(isDataSetNull) {
          this.address.pincode = null;
        }
      }
    });
  }

  getDistrictList() {
    this.service.getDistrictList().subscribe(res => {
      this.districtList = [];
      if (res && res.status == 200 && res?.data?.length > 0) {
        this.districtList = res.data;
      }
    });
  }

  getBlockList(districtId, isDataSetNull?) {
    this.service.getBlockList(districtId).subscribe(res => {
      this.blockList = [];
      if (res && res.status == 200 && res?.data?.length > 0) {
        this.blockList = res.data;
        if(isDataSetNull) {
          this.address.blockId = null;
        }
      }
    });
  }

  getCityList() {
    this.service.getCityListByStateId(this.stateList[0].id).subscribe(res => {
      this.cityList = [];
      if (res && res.listData) {
        this.cityList = res.listData;
      } else {
        this.cityList = [];
      }
    });
  }

  // Enter 1 for numbes-only ,2 for character-only ,3 for alphanumeric only ,4 for alphabet-with-space ,5 for alphanumeric with space ,6 no space, 7 no numeric and space value
  keyPressEvent(event, type): boolean {
    return this.commonMethods.keyPressEvent(event,type);
  }

  blurEvent() {
    this.onFieldBlur.emit(true);
  }

}
