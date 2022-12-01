import { Component, Input, OnInit, Output } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import * as _ from 'lodash';
import { CommonService } from 'src/app/CommoUtils/common-services/common.service';
import { ProductService } from 'src/app/services/product.service';

@Component({
  selector: 'app-com-industry-sector-popup',
  templateUrl: './com-industry-sector-popup.component.html',
  styleUrls: ['./com-industry-sector-popup.component.scss']
})
export class ComIndustrySectorPopupComponent implements OnInit {

  @Input() popUpObj: any = {};
  @Output() countInsutrySector!: string;

  industryList: any = []; industryMasterList: any = [];
  sectorList: any = []; sectorMasterList: any = [];
  subSectorList: any = []; subSectorMasterList: any = [];

  selectedIndustry: any = [];
  selectedSector: any = [];
  selectedSubSector: any = [];

  isSelectAllIndustry = false;
  isSelectAllSubSector = false;
  isSelectAllSector = false;
  viewTab!: boolean;

  productId!: number;
  industryCount = 0;
  sectorCount = 0;
  subSectorCount = 0;

  field!: any;

  industryFilter;
  sectorFilter;
  subSectorFilter;


  constructor(
    public activeModal: NgbActiveModal,
    private productService: ProductService,
    private commonService: CommonService) { }

  ngOnInit(): void {
    setTimeout(() => {
      this.getIndustryList();
      this.field = this.popUpObj.productFields;
      this.productId = this.popUpObj.productId;
      this.viewTab = this.popUpObj.viewTab;
    }, 0);
  }

  // get Industry
  getIndustryList(): void {
    this.productService.getIndustryList().subscribe(res => {
      if (res.status === 200) {
        this.industryList = _.cloneDeep(res.listData);
        this.industryMasterList = _.cloneDeep(res.listData);
        if (this.field) {
          this.setEditModeIndustry();
        }
      }
    });
  }

  // get Sector
  getSectorList(isEditMode?): void {
    const industryIdsAry = _.map(_.filter(this.industryList, o => o.isChecked), 'id');

    this.industryCount = _.size(industryIdsAry);
    if (this.industryCount === _.size(this.industryList)) {
      this.isSelectAllIndustry = true;
    } else {
      this.isSelectAllIndustry = false;
    }

    const selectedSectors = _.map(_.filter(this.sectorList, o => o.isChecked), 'id');
    if (industryIdsAry && industryIdsAry.length > 0) {
      this.productService.getSectorList(industryIdsAry).subscribe(res => {
        if (res.status === 200) {
          this.sectorList = _.cloneDeep(res.listData);
          this.sectorMasterList = _.cloneDeep(res.listData);
          if (isEditMode) {
            this.setEditModeSector();
          }
        }

        if (this.sectorMasterList && this.sectorMasterList.length > 0) {
          for (const data of selectedSectors) {
            const index = _.findIndex(this.sectorList, ['id', data]);
            if (index !== -1) {
              this.sectorList[index].isChecked = true;
            }
          }
          this.setSectorCount();
          this.setSubsectorCount();
        }
      });
    } else {
      this.sectorList = [];
      this.sectorMasterList = [];
      this.subSectorList = [];
      this.subSectorMasterList = [];
      this.setSectorCount();
      this.setSubsectorCount();
    }
  }

  // get Sub Sector
  getSubSectorList(isEditMode?): void {
    const sectorIdAry = _.map(_.filter(this.sectorList, o => o.isChecked), 'id');

    const selectedSubSectors = _.map(_.filter(this.subSectorList, o => o.isChecked), 'id');
    if (sectorIdAry && sectorIdAry.length > 0) {
      this.productService.getSubSectorList(sectorIdAry).subscribe(res => {
        if (res.status === 200) {
          this.subSectorList = _.cloneDeep(res.listData);
          this.subSectorMasterList = _.cloneDeep(res.listData);
          if (isEditMode) {
            this.setEditModeSubSector();
          }
        }

        if (this.subSectorMasterList && this.subSectorMasterList.length > 0) {
          for (const data of selectedSubSectors) {
            const index = _.findIndex(this.subSectorList, ['id', data]);
            if (index !== -1) {
              this.subSectorList[index].isChecked = true;
            }
          }
          this.setSectorCount();
          this.setSubsectorCount();
        }
      });
    } else {
      this.subSectorList = [];
      this.subSectorMasterList = [];
      this.setSectorCount();
      this.setSubsectorCount();
    }
  }

  setSectorCount(): void {
    const sectorIdAry = _.map(_.filter(this.sectorList, o => o.isChecked), 'id');
    this.sectorCount = _.size(sectorIdAry);
    if (this.sectorCount > 0 && this.sectorCount === _.size(this.sectorList)) {
      this.isSelectAllSector = true;
    } else {
      this.isSelectAllSector = false;
    }
  }
  setSubsectorCount(): void {
    const subSectorIdAry = _.map(_.filter(this.subSectorList, o => o.isChecked), 'id');
    this.subSectorCount = _.size(subSectorIdAry);
    if (this.subSectorCount > 0 && this.subSectorCount === _.size(this.subSectorList)) {
      this.isSelectAllSubSector = true;
    } else {
      this.isSelectAllSubSector = false;
    }
  }

  closeModal(): void {
    const obj: any = {};
    obj.selectedCountLabel = this.industryCount + ' Industries and ' + this.sectorCount + ' sectors and ' + this.subSectorCount + ' sub-sectors selected';
    this.activeModal.close(obj);
  }

  selectAll(event, type): void {
    if (type === 'industry') {
      this.industryList.forEach(element => {
        element.isChecked = event ? true : false;
      });
      this.getSectorList();
    } else if (type === 'sector') {
      this.sectorList.forEach(element => {
        element.isChecked = event ? true : false;
      });
      this.getSubSectorList();
    } else if (type === 'subSector') {
      this.subSectorList.forEach(element => {
        element.isChecked = event ? true : false;
      });
      this.setSubsectorCount();
    }
  }

  onFilter(event, type): void {
    if (type === 'industry') {
      if (event) {
        event = _.toLower(event);
        this.industryList = _.filter(this.industryMasterList, o => _.toLower(o.value).includes(event));
      } else {
        this.industryList = _.cloneDeep(this.industryMasterList);
      }
      this.uncheckAllSector();
      this.uncheckAllSubSector();
    } else if (type === 'sector') {
      if (event) {
        event = _.toLower(event);
        this.sectorList = _.filter(this.sectorMasterList, o => _.toLower(o.value).includes(event));
      } else {
        this.sectorList = _.cloneDeep(this.sectorMasterList);
      }
      this.uncheckAllSubSector();
    } else if (type === 'subSector') {
      if (event) {
        event = _.toLower(event);
        this.subSectorList = _.filter(this.subSectorMasterList, o => _.toLower(o.value).includes(event));
      } else {
        this.subSectorList = _.cloneDeep(this.subSectorMasterList);
      }
    }
  }

  uncheckAllSector(): void {
    this.sectorList.forEach(element => {
      element.isChecked = false;
    });
  }

  uncheckAllSubSector(): void {
    this.subSectorList.forEach(element => {
      element.isChecked = false;
    });
  }

  setEditModeIndustry(): void {
    if (this.field && this.field.productSubFieldTempResponse && this.field.productSubFieldTempResponse.length > 0
      && this.field.productSubFieldTempResponse[0].value) {
      const savedData = this.field.productSubFieldTempResponse[0].value;
      // industry: (2)[1, 3]
      // maxValue: null
      // minValue: null
      // sector: (2)[261, 262]
      // subSector: (2)[2, 3]
      if (savedData && !_.isEmpty(savedData.industry)) {
        for (const iterator of savedData.industry) {
          const index = _.findIndex(this.industryList, ['id', iterator]);
          if (index !== -1) {
            this.industryList[index].isChecked = true;
          }
        }
        this.getSectorList(true);
      }
    }

  }

  setEditModeSector(): void {
    if (this.field && this.field.productSubFieldTempResponse && this.field.productSubFieldTempResponse.length > 0
      && this.field.productSubFieldTempResponse[0].value) {
      const savedData = this.field.productSubFieldTempResponse[0].value;
      if (savedData && !_.isEmpty(savedData.sector)) {
        for (const iterator of savedData.sector) {
          const index = _.findIndex(this.sectorList, ['id', iterator]);
          if (index !== -1) {
            this.sectorList[index].isChecked = true;
          }
        }
        this.getSubSectorList(true);
      }
    }
  }

  checkValidation():Boolean{
    if(this.industryCount==0){
      this.commonService.warningSnackBar('Please select Industry');
      return false;
    }
    if(this.sectorCount==0){
      this.commonService.warningSnackBar('Please select Sector');
      return false;
    }
    if(this.subSectorCount==0){
      this.commonService.warningSnackBar('Please select Sub-Sector');
      return false;
    }
    return true;
  }
  setEditModeSubSector(): void {
    if (this.field && this.field.productSubFieldTempResponse && this.field.productSubFieldTempResponse.length > 0
      && this.field.productSubFieldTempResponse[0].value) {
      const savedData = this.field.productSubFieldTempResponse[0].value;
      if (savedData && !_.isEmpty(savedData.subSector)) {
        for (const iterator of savedData.subSector) {
          const index = _.findIndex(this.subSectorList, ['id', iterator]);
          if (index !== -1) {
            this.subSectorList[index].isChecked = true;
          }
        }
        this.subSectorCount = _.size(savedData.subSector);
      }
    }
  }

  save(): void {
    this.field.productSubFieldTempResponse.forEach(element => {
      element.value.industry = _.map(_.filter(this.industryList, o => o.isChecked), 'id');
      element.value.sector = _.map(_.filter(this.sectorList, o => o.isChecked), 'id');
      element.value.subSector = _.map(_.filter(this.subSectorList, o => o.isChecked), 'id');
    });
    const ary = [];
    ary.push(this.field);
    if(this.checkValidation()){
      this.productService.saveProductSubFields(ary).subscribe(res => {
        if (res.status === 200) {
          const obj: any = {};
          obj.selectedCountLabel = this.industryCount + ' Industries and ' + this.sectorCount + ' sectors and ' + this.subSectorCount + ' sub-sectors selected';
          this.activeModal.close(obj);
        }
      });
    }
    
  }
}
