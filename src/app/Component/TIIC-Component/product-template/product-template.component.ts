import { Component, Input, OnInit } from '@angular/core';
import { LabelType, Options } from 'ng5-slider';
import { CommonService } from 'src/app/CommoUtils/common-services/common.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ComIndustrySectorPopupComponent } from 'src/app/Popup/Product-Scoring/com-industry-sector-popup/com-industry-sector-popup.component';
import { GeographicalAreasPopupComponent } from 'src/app/Popup/Product-Scoring/geographical-areas-popup/geographical-areas-popup.component';
import { ProductService } from 'src/app/services/product.service';
import { ProductEditComponent } from '../Products-Scoring/product-edit/product-edit.component';
@Component({
  selector: 'app-product-template',
  templateUrl: './product-template.component.html',
  styleUrls: ['./product-template.component.scss']
})
export class ProductTemplateComponent implements OnInit {

  @Input() tab: number;
  @Input() productFields: any;
  @Input() index: number;
  @Input() productId: number;
  @Input() submitted: Boolean;
  @Input() businessTypeId: Boolean;
  @Input() schemeId: Boolean;
  marked = false;
  ngModel = false;

  popUpObj: any = {};
  lowValue: number = 0;
  highValue: number = 0;
  maxValue!: 100;
  options: Options = {
    floor: 0,
    ceil: 10,
    step: 1,
    showTicks: false,
    draggableRange: true,
    translate: function(value) {
      if ((value === this.floor)) {
        return value + '' ;
      }
      if(value === this.ceil){
        return value + '' ;
      }
      return  value +'';
    }
    
  }
  options1: Options = {
    floor: 0,
    ceil: 10,
    step: 1,
    showTicks: false,
    draggableRange: true,
    translate: function(value) {
      if ((value === this.floor)) {
        return value + '<i> &below</i> ' ;
      }
      if(value === this.ceil){
        return value + '<i> &above</i> ' ;
      }
      return  value +'';
    }
    
  }
  options3: Options = {
    floor: 0.0,
    ceil: 10.0,
    step: 0.1,
    showTicks: false,
    draggableRange: true,
    translate: function(value) {
      if ((value === this.floor)) {
        return value + '<i> &below</i> ' ;
      }
      if(value === this.ceil){
        return value + '<i> &above</i> ' ;
      }
      return  value +'';
    }
    
  }
  options2: Options = {
    floor: 0,
    ceil: 10,
    step: 1,
    showTicks: false,
    draggableRange: true,
    translate: function(value) {
      if(value === this.ceil){
        return value + '<i> &above</i> ' ;
      }
      return  value +'';
    }
    
  }
  count: number = 0;
  productSubField: any;
  ab: number = 0;
  cityStateCount!: String;
  industryCount!: String;
  constructor(public productEditComponent: ProductEditComponent,
    private modalService: NgbModal, private productService: ProductService, private commonService: CommonService) { }

  ngOnInit(): void {
    this.ab = 0;
    this.getCount(this.productFields);
  }
  numberOnly(event,sub?): boolean { 
    
    const charCode = (event.which) ? event.which : event.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
      return false;
    }
    return true;

  }
  clearValue(event,sub?){ 
    var key = event.keyCode || event.charCode;

    if( key == 8 || key == 46 ){
      sub.value.minValue=null;
    }
  }
  getCount(data: any): number {
    this.count = 0;
    for (let sub of data.productSubFieldTempResponse) {
      if (sub.controlType == 4||sub.controlType==15) {
        this.options1.floor = sub.defaultMinValue;
        this.options1.ceil = sub.defaultMaxValue;

        this.options2.floor = sub.defaultMinValue;
        this.options2.ceil = sub.defaultMaxValue;

        this.options.floor = sub.defaultMinValue;
        this.options.ceil = sub.defaultMaxValue;

        this.options3.floor = sub.defaultMinValue;
        this.options3.ceil = sub.defaultMaxValue;

        if (this.commonService.isObjectNullOrEmpty(sub.value)) {
          sub.value.minValue = this.lowValue;
          sub.value.maxValue = this.highValue;
        }
      }
      if (sub.controlType === 1) {
        if (this.commonService.isObjectNullOrEmpty(sub.value)) {
          sub.value = 0;
        }
      }
      if (sub.controlType === 8) {
        if (!this.commonService.isObjectNullOrEmpty(sub.value.state)) {
          this.cityStateCount=(sub.value.state.length + ' State and ' + sub.value.city.length + ' city selected');
         }
        if (!this.commonService.isObjectNullOrEmpty(sub.value.industry)) {
          this.industryCount = (sub.value.industry.length + ' Industries and ' + sub.value.sector.length + ' sectors and ' + sub.value.subSector.length + ' sub-sectors selected');
         }
         
      }
      if (sub.controlType === 3) {
        if (!this.commonService.isObjectNullOrEmpty(sub.value)) {
          data.value = sub.value;
        }
      }
      this.ab++;
    }
    return this.count;
  }
  onCahngeControl(event: any, data: any) {
    const checked = event.target.checked;
    if (checked) {
      data.value = data.subFieldsId;
    }
    else {
      data.value = 0;
    }
    // console.log("data.value=========================>",data.value)
  }
  forMultiCheckBox(data: any, sub: any) {
    if (!sub.value.includes(data)) {
      sub.value.push(data);
      this.ab++;
    }
    else {
      sub.value.splice(sub.value.indexOf(data), 1);
    }
  }
  Select_Geo_Graphical_Popup(field: any,viewTab:Boolean) {
    const config = {
      windowClass: 'Mediam-model',
      size:'lg'
    };
    // console.log(this.productId);
    console.log(field);
    this.popUpObj.viewTab=viewTab;
    this.popUpObj.productFields = field;
    this.popUpObj.productId = this.productId;
    this.commonService.openPopUp(this.popUpObj, GeographicalAreasPopupComponent, false, config).result.then(result => {
      if (result === 'Ok') {
        console.log(field);
        const state = this.popUpObj.cityState.state.length;
        const city = this.popUpObj.cityState.city.length;
       this.cityStateCount= (state + ' State and ' + city + ' city selected');
      }
    });
  }
  Select_Industry_Sector_Popup(field: any,viewTab:Boolean) {
    const config = {
      windowClass: 'Mediam-model',
      size:'xl'
    };
    // console.log(this.productId);
    // console.log(field);
    this.popUpObj.viewTab=viewTab;
    this.popUpObj.productFields = field;
    this.popUpObj.productId = this.productId;
    this.commonService.openPopUp(this.popUpObj, ComIndustrySectorPopupComponent, false, config).result.then(result => {
      if (result && result.selectedCountLabel) {
       this.industryCount = result.selectedCountLabel;
      } else {
        this.industryCount = '';
      }
    });
  }


  setValue(data: any) {
    if (data.value != 0) {
      this.productFields.value = data.value;
    }
  }
  getMaxValue(value: Boolean, minNum: number, num: number): Array<any> {

    if (value) {
      let array = [];
      for (let i = num; i < minNum + 1; i--) {
        array.push(i);
      }
      return array;
    }
    let array = [];
    for (let i = minNum; i < num + 1; i++) {
      array.push(i);
    }
    return array;
  }
  remove(data: any) {
    data.isConsidered = false;
  }

  toggleVisibility(e: any) {
    this.marked = e.target.checked;
  }
  checkMaxValue(min: number, max: number) {
    // console.log(min);
    if (min > max) {
      this.commonService.warningSnackBar('Value shold be more then  ' + min + '.');
    }
  }
  selectCoApplicant(field, type): void {
    if (type == 1) {
      if (field.isApplicant) {
        field.isCoApplicant = true;
      } else {
        field.isCoApplicant = false;
      }
    }
    if (type == 2) {
      if (field.isCoApplicant) {
        field.isApplicant = true;
      }
    }
  }
}
