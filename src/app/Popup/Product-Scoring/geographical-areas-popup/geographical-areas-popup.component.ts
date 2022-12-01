import { Component, Input, OnInit, Output } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import * as _ from 'lodash';
import { CommonService } from 'src/app/CommoUtils/common-services/common.service';
import { Constants } from 'src/app/CommoUtils/constants';
import { ProductService } from 'src/app/services/product.service';

@Component({
  selector: 'app-geographical-areas-popup',
  templateUrl: './geographical-areas-popup.component.html',
  styleUrls: ['./geographical-areas-popup.component.scss']
})
export class GeographicalAreasPopupComponent implements OnInit {
  @Input() popUpObj: any = {};
  @Output() cityState!: any;
  stateList: any = []; stateListTemp: any = [];
  stateMasterList: any = [];
  searchState:any=[];
  searchCity:any=[];
  cityList: any = [];
  cityMasterList: any = [];
  cityListTemp: any = [];

  isSelectAll: boolean;
  isSelectAllCity: boolean;
  addressType: Number = 2;

  selectedState: any = [];
  selectedCity: any = [];
  data: any = {};
  isMandatory: boolean = false;
  productId!: number;
  field!: any;
  id: any;
  stateCount: number = 0;
  cityCount: number = 0;

  saveField: any = [];
  viewTab!: Boolean;

  isForCoApp: any;

  isStatesSearch:Boolean=false;

  constructor(private productService: ProductService, private commonService: CommonService, public activeModal: NgbActiveModal) {
    this.isSelectAll = false;
    this.isSelectAllCity = false;
  }

  ngOnInit(): void {
    setTimeout(() => {
      if (Constants.AddressType.LOCAL === this.addressType) {
        this.getStateList(101);
      } else if (Constants.AddressType.LDG === this.addressType) {
        this.getLDGStateList()
      }
      this.field = this.popUpObj.productFields;
      this.productId = this.popUpObj.productId;
      this.viewTab = this.popUpObj.viewTab;
      this.isForCoApp = this.popUpObj.isforCoApp;  
    }, 0);    
    // console.log("this.field==", this.popUpObj.isforCoApp)
  }

  //Get State List
  getStateList(countryId) {
    this.productService.getStateList(countryId).subscribe(res => {
      if (res.status == 200) {
        this.stateList = _.cloneDeep(res.listData)
        this.stateMasterList = _.cloneDeep(res.listData)
        // console.log(this.stateList.length);
        // this.getGeographicalDetail();
        if (this.isForCoApp == null || this.isForCoApp == null || this.isForCoApp == 1) {
          this.getApplicantSelectedState();
        } else {
          this.getCoApplicantSelectedState();
        }
      }

    });

  }

  //Get LDG State List
  getLDGStateList() {
    this.productService.getLDGStateList().subscribe(res => {
      if (res.status == 200) {
        this.stateList = _.cloneDeep(res.data);
        this.stateMasterList = _.cloneDeep(res.data);
        // console.log("this.stateList.length", res);
        // this.getGeographicalDetail();
        if (this.isForCoApp == null || this.isForCoApp == null || this.isForCoApp == 1) {
          this.getApplicantSelectedState();
        } else {
          this.getCoApplicantSelectedState();
        }
      }

    });

  }

  getApplicantSelectedState() {

    const savedData = this.field.productSubFieldTempResponse[0].value;
    
    if (savedData && !_.isEmpty(savedData.state)) {
      for (const data of savedData.state) {
        // this.selectedState.push(data);
        const index = _.findIndex(this.stateList, ['id', data]);
        const index1 = _.findIndex(this.stateMasterList, ['id', data]);
        if (index !== -1) {
          this.stateList[index].isChecked = true;
          this.stateMasterList[index1].isChecked = true;
        }
      }
      this.stateListTemp=_.cloneDeep(this.stateList);
      // console.log(this.stateList);
      // console.log(this.stateMasterList);
    }
    this.getApplicantCitiesList(true);
  }

  getCites(i?){
    if(i!=undefined){
      this.stateMasterList[i].isChecked = this.stateMasterList[i].isChecked ? true : false
    }
   
    if (this.isForCoApp == null || this.isForCoApp == null || this.isForCoApp == 1) {
      this.getApplicantCitiesList(true);
    } else {
      this.getCoApplicantCitiesList(true);
    }
  }
  getApplicantSelectedCities() {
    if (this.field && this.field.productSubFieldTempResponse && this.field.productSubFieldTempResponse.length > 0
      && this.field.productSubFieldTempResponse[0].value) {
      const savedData = this.field.productSubFieldTempResponse[0].value;
     
      if (savedData && !_.isEmpty(savedData.city)) {
        for (const iterator of savedData.city) {
          const index = _.findIndex(this.cityList, ['id', iterator]);
          const index1 = _.findIndex(this.cityMasterList, ['id', iterator]);
          if (index !== -1) {
            this.cityList[index].isChecked = true;
            this.cityMasterList[index1].isChecked = true;
          }
        }
        this.cityListTemp=_.cloneDeep(this.cityList);
      //   console.log(this.cityList);
      // console.log(this.cityMasterList);
      }
    }
  }
  getCoApplicantSelectedCities() {
    if (this.field && this.field.productSubFieldTempResponse && this.field.productSubFieldTempResponse.length > 0
      && this.field.productSubFieldTempResponse[0].valueforCoApp) {
      const savedData = this.field.productSubFieldTempResponse[0].valueforCoApp;
      this.cityListTemp=this.field.productSubFieldTempResponse[0].valueforCoApp.city;
      if (savedData && !_.isEmpty(savedData.city)) {
        for (const iterator of savedData.city) {
          const index = _.findIndex(this.cityList, ['id', iterator]);
          const index1 = _.findIndex(this.cityMasterList, ['id', iterator]);
          if (index !== -1) {
            this.cityList[index].isChecked = true;
            this.cityMasterList[index1].isChecked = true;
          }
        }
      }
    }
  }
  getApplicantCitiesList(isEditMode?) {
    
    if(this.isStatesSearch){
      this.searchState=null;
      this.isStatesSearch=false;
      this.stateList= _.cloneDeep(this.stateMasterList);
    }
    let stateIdsAry = _.map(_.filter(this.stateList, o => o.isChecked), 'id');
    
    this.stateCount = _.size(stateIdsAry);
    if (this.stateCount === _.size(this.stateMasterList)) {
      this.isSelectAll = true;
    } else {
      this.isSelectAll = false;
    }
    const selectedCities = _.map(_.filter(this.cityList, o => o.isChecked), 'id');
    if (stateIdsAry && stateIdsAry.length > 0) {
      if (Constants.AddressType.LOCAL === this.addressType) {
        this.productService.getCityList(stateIdsAry).subscribe(res => {
            this.cityMasterList = [];
            this.cityList = _.cloneDeep(res.data);
            this.cityMasterList = _.cloneDeep(res.data);
            if (isEditMode) {
              this.getApplicantSelectedCities();
            }

          if (this.cityMasterList && this.cityMasterList.length > 0) {
            for (const data of selectedCities) {
              const index = _.findIndex(this.cityList, ['id', data]);
              const index1 = _.findIndex(this.cityMasterList, ['id', data]);
              if (index !== -1) {
                this.cityList[index].isChecked = true;
                this.cityMasterList[index1].isChecked = true;
              }
            }
            this.setCityCount();

          }
        });
      } else if (Constants.AddressType.LDG === this.addressType) {
        this.productService.getLDGDistrictList(stateIdsAry).subscribe(res => {
          if (res.status === 200) {
              this.cityMasterList = [];
              this.cityList = _.cloneDeep(res.data);
              this.cityMasterList = _.cloneDeep(res.data);
              if (isEditMode) {
                this.getApplicantSelectedCities();
              }
          }

          if (this.cityMasterList && this.cityMasterList.length > 0) {
            for (const data of selectedCities) {
              const index = _.findIndex(this.cityList, ['id', data]);
              const index1 = _.findIndex(this.cityMasterList, ['id', data]);
              if (index !== -1 && this.cityMasterList[index1]) {
                this.cityList[index].isChecked = true;
                this.cityMasterList[index1].isChecked = true;
              }
            }
            this.setCityCount();

          }
        });
      }

    } else {
      if(!this.isStatesSearch){
      this.cityList = [];
      this.cityMasterList = [];
      this.setCityCount();
      }else{
        this.stateList=this.stateMasterList;
        this.getApplicantCitiesList();
      }
      
    }
  }
  getCoApplicantCitiesList(isEditMode?) {
    if(this.isStatesSearch){
      this.searchState=null;
      this.isStatesSearch=false;
      this.stateList= _.cloneDeep(this.stateMasterList);
    }
    const stateIdsAry = _.map(_.filter(this.stateList, o => o.isChecked), 'id');
    this.stateCount = _.size(stateIdsAry);
    if (this.stateCount === _.size(this.stateList)) {
      this.isSelectAll = true;
    } else {
      this.isSelectAll = false;
    }
    const selectedCities = _.map(_.filter(this.cityList, o => o.isChecked), 'id');
    if (stateIdsAry && stateIdsAry.length > 0) {
      if (Constants.AddressType.LOCAL === this.addressType) {
        this.productService.getCityList(stateIdsAry).subscribe(res => {
          if (res.status === 200) {
            // if(!this.isStatesSearch){
              this.cityMasterList = [];
              this.cityList = _.cloneDeep(res.data);
              this.cityMasterList = _.cloneDeep(res.data);
              if (isEditMode) {
                this.getCoApplicantSelectedCities();
              }
            // }else{
            //   this.cityMasterList = _.cloneDeep(res.data);
            //   this.searchState=null;
            //   this.stateList= _.cloneDeep(this.stateMasterList);
            //   this.cityList= _.cloneDeep(this.cityList.concat(this.cityMasterList));
            //   this.stateCount = _.size(_.filter(this.stateList, o => o.isChecked));
            //   this.isStatesSearch=false;
            // }
          }

          if (this.cityMasterList && this.cityMasterList.length > 0) {
            for (const data of selectedCities) {
              const index = _.findIndex(this.cityList, ['id', data]);
              const index1 = _.findIndex(this.cityList, ['id', data]);
              if (index !== -1) {
                this.cityList[index].isChecked = true;
                this.cityMasterList[index1].isChecked = true;
              }
            }
            this.setCityCount();

          }
        });
      } else if (Constants.AddressType.LDG === this.addressType) {
        this.productService.getLDGDistrictList(stateIdsAry).subscribe(res => {
          if (res.status === 200) {
            //  if(!this.isStatesSearch){
              this.cityMasterList = [];
              this.cityList = _.cloneDeep(res.data);
              this.cityMasterList = _.cloneDeep(res.data);
              if (isEditMode) {
                this.getCoApplicantSelectedCities();
              }
            // }else{
            //   this.cityMasterList = _.cloneDeep(res.data);
            //   this.searchState=null;
            //   this.stateList= _.cloneDeep(this.stateMasterList);
            //   this.cityList= _.cloneDeep(this.cityList.concat(this.cityMasterList));
            //   this.stateCount = _.size(_.filter(this.stateList, o => o.isChecked));
            //   this.isStatesSearch=false;
            
            // }
            
          
          }

          if (this.cityMasterList && this.cityMasterList.length > 0) {
            for (const data of selectedCities) {
              const index = _.findIndex(this.cityList, ['id', data]);
              const index1 = _.findIndex(this.cityList, ['id', data]);
              if (index !== -1) {
                this.cityList[index].isChecked = true;
                this.cityMasterList[index].isChecked = true;
              }
            }
            this.setCityCount();

          }
        });
      }

    } else {
      if(!this.isStatesSearch){
        this.cityList = [];
        this.cityMasterList = [];
        this.setCityCount();
        }else{
          this.stateList=this.stateMasterList;
          this.getCoApplicantCitiesList();
        }
        
    }
  }


  setCityCount(set?,id?,event?) {
    const cityIdAry = _.map(_.filter(this.cityList, o => o.isChecked), 'id');
    this.cityCount = _.size(cityIdAry);
    if (this.cityCount > 0 && this.cityCount === _.size(this.cityMasterList)) {
      this.isSelectAllCity = true;
    } else {
      this.isSelectAllCity = false;
    }
    if(set==1){
      const index=_.findIndex(this.cityMasterList,['id',id]);
      this.cityMasterList[index].isChecked=event;
      this.searchCity=null;
      this.cityList = _.cloneDeep(this.cityMasterList);
      this.cityCount=_.map(_.filter(this.cityList, o => o.isChecked), 'id').length;
    }
  }

  getCoApplicantSelectedState() {
    const savedData = this.field.productSubFieldTempResponse[0].valueforCoApp;
    if (savedData && !_.isEmpty(savedData.state)) {
      for (const data of savedData.state) {
        // this.selectedState.push(data);
        const index = _.findIndex(this.stateList, ['id', data]);
        const index1 = _.findIndex(this.stateMasterList, ['id', data]);
        if (index !== -1) {
          this.stateList[index].isChecked = true;
          this.stateMasterList[index1].isChecked = true;
        }
      }
    }
    this.getCoApplicantCitiesList(true);

  }

  onFilter(event, type): void {
    if (type === 'state') {
      if (event) {
        this.isStatesSearch=true;
        event = _.toLower(event);
        this.stateList = _.filter(this.stateMasterList, o => _.toLower(o.value).includes(event));
      } else {
        this.isStatesSearch=false;
        this.stateList = _.cloneDeep(this.stateMasterList);
        // this.cityList = _.cloneDeep(this.cityMasterList);
      }
      // this.uncheckAllCity();
    } else if (type === 'city') {
     
      if (event) {
        event = _.toLower(event);
        this.cityList = _.filter(this.cityMasterList, o => _.toLower(o.value).includes(event));
        
      } else {
        this.cityList = _.cloneDeep(this.cityMasterList);
      }
      this.setCityCount();
    } 
    
  }

  uncheckAllCity() {
    this.cityList.forEach(element => {
      element.isChecked = false;
    });
   }

  closeModal(val?) {
    if (val === 0) {
      
      if (this.isForCoApp == null || this.isForCoApp == null || this.isForCoApp == 1) {
        this.popUpObj.cityState = this.field.productSubFieldTempResponse[0].value;
      } else {
        this.popUpObj.cityState = this.field.productSubFieldTempResponse[0].valueforCoApp;
      }
      this.activeModal.close('Ok');
    } else {
      if (this.isForCoApp == null || this.isForCoApp == null || this.isForCoApp == 1) {
        this.popUpObj.cityState = this.field.productSubFieldTempResponse[0].value;
      } else {
        this.popUpObj.cityState = this.field.productSubFieldTempResponse[0].valueforCoApp;
      }
      this.activeModal.close('Ok');
    }
  }
  save() {
    // this.cityListTemp=_.cloneDeep(this.cityList);
    // this.stateListTemp=_.cloneDeep(this.stateList);
    if (this.isForCoApp == null || this.isForCoApp == null || this.isForCoApp == 1) {
      this.field.productSubFieldTempResponse.forEach(element => {
        element.value.city = [];
        element.value.state = [];

      });
      this.field.productSubFieldTempResponse.forEach(element => {
        element.value.city = _.map(_.filter(this.cityList, o => o.isChecked), 'id');
        element.value.state= _.map(_.filter(this.stateList, o => o.isChecked), 'id');
        element.value.addressType = this.addressType;
      
      });
    } else {
      this.field.productSubFieldTempResponse.forEach(element => {
        element.valueforCoApp.city = [];
        element.valueforCoApp.state = [];
      });
      this.field.productSubFieldTempResponse.forEach(element => {
        element.valueforCoApp.city = _.map(_.filter(this.cityList, o => o.isChecked), 'id');
        element.valueforCoApp.state= _.map(_.filter(this.stateList, o => o.isChecked), 'id');
        element.value.addressType = this.addressType;
      
      });
    }
    if (this.checkValidation()) {
      this.productService.saveProductSubFields(this.saveField).subscribe(res => {
        if (res.status == 200) {
            this.closeModal(0);
        }

      });
    }else{
      if (this.isForCoApp == null || this.isForCoApp == null || this.isForCoApp == 1) {
        this.field.productSubFieldTempResponse.forEach(element => {
          element.value.city = [];
          element.value.state = [];
  
        });
        this.field.productSubFieldTempResponse.forEach(element => {
          element.value.city = _.map(_.filter(this.cityListTemp, o => o.isChecked), 'id');
          element.value.state= _.map(_.filter(this.stateListTemp, o => o.isChecked), 'id');
          element.value.addressType = this.addressType;
        
        });
      } else {
        this.field.productSubFieldTempResponse.forEach(element => {
          element.valueforCoApp.city = [];
          element.valueforCoApp.state = [];
        });
        this.field.productSubFieldTempResponse.forEach(element => {
          element.valueforCoApp.city = _.map(_.filter(this.cityListTemp, o => o.isChecked), 'id');
          element.valueforCoApp.state= _.map(_.filter(this.stateListTemp, o => o.isChecked), 'id');
          element.value.addressType = this.addressType;
        
        });
      }
    }
  }
  checkValidation(): Boolean {
    console.log(this.field.productSubFieldTempResponse)
    if (this.isForCoApp == null || this.isForCoApp == null || this.isForCoApp == 1) {
    if (this.commonService.isObjectNullOrEmpty(this.field.productSubFieldTempResponse[0].value.state)||_.size(this.field.productSubFieldTempResponse[0].value.state)==0) {
      this.commonService.warningSnackBar('Please select state');
      return false;
    }
    if (this.commonService.isObjectNullOrEmpty(this.field.productSubFieldTempResponse[0].value.city)||_.size(this.field.productSubFieldTempResponse[0].value.city)==0) {
      this.commonService.warningSnackBar('Please select city');
      return false;
    }
  }else{
    if (this.commonService.isObjectNullOrEmpty(this.field.productSubFieldTempResponse[0].valueforCoApp.state)||_.size(this.field.productSubFieldTempResponse[0].valueforCoApp.state)==0) {
      this.commonService.warningSnackBar('Please select state');
      return false;
    }
    if (this.commonService.isObjectNullOrEmpty(this.field.productSubFieldTempResponse[0].valueforCoApp.city)||_.size(this.field.productSubFieldTempResponse[0].valueforCoApp.city)==0) {
      this.commonService.warningSnackBar('Please select city');
      return false;
    }
  }
    return true;
  }

  selectAll(event, type): void {
    if (type === 'state') {
      this.stateList.forEach(element => {
        element.isChecked = event ? true : false;
      });
      this.stateMasterList.forEach(element => {
        element.isChecked = event ? true : false;
      });
      if(event==true){
        this.getCites();
      }
      if(event==false){
        this.cityList=_.cloneDeep([]);
        this.cityMasterList=_.cloneDeep([]);
        if (this.isForCoApp == null || this.isForCoApp == null || this.isForCoApp == 1) {
          this.field.productSubFieldTempResponse.forEach(element => {
            element.value.city = [];
            element.value.state = [];
    
          });
        } else {
          this.field.productSubFieldTempResponse.forEach(element => {
            element.valueforCoApp.city = [];
            element.valueforCoApp.state = [];
          });
          
        }
        this.setCityCount();
      }
    } else if (type === 'city') {
      this.cityList.forEach(element => {
        element.isChecked = event ? true : false;
      });
      this.cityMasterList.forEach(element => {
        element.isChecked = event ? true : false;
      });
      this.setCityCount()
    } 
  }
}
