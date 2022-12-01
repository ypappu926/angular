import { importType } from '@angular/compiler/src/output/output_ast';
import { Component, Input, OnInit, Output } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import * as _ from 'lodash';
import { CommonService } from 'src/app/CommoUtils/common-services/common.service';
import { Constants } from 'src/app/CommoUtils/constants';
import { ProductService } from 'src/app/services/product.service';

@Component({
  selector: 'app-product-parameters',
  templateUrl: './product-parameters.component.html',
  styleUrls: ['./product-parameters.component.scss']
})
export class ProductParametersComponent implements OnInit {

  selectValue!: any[];
  gruoupBy!: any[];
  @Input() popUpObj: any = {};
  count: number = 0;
  fields!: any[];
  fieldLength: number = 0;
  productId: any;
  tab: Boolean;
  mainList!: any[];
  searchText: any = "";
  selectedField: any = [];
  businessTypeId: number;
  groupByFields: any;
  selectAllFields: boolean = false;
  schemeId!: number;

  subLoanId: number = null;
  editConfigurationParamter: any = {};
  fieldRequest: any = {};

  itrType: any = {
    AUDIT_ITR: 1,
    NO_ITR: 2,
    BOTH: 3
  }

  borrowerType: any = {
    isSalaried: 1,
    isNonSalaried: 2
  }

  financialType: any = [];
  selectedFinType: any = [];
  selectedBorrowrType: any = [];

  constructor(public activeModal: NgbActiveModal,
    private productService: ProductService,
    private route: ActivatedRoute,
    private commonService: CommonService) {

    this.schemeId =9;
    this.businessTypeId = 1;

  }

  ngOnInit(): void {
    this.editConfigurationParamter = this.popUpObj.editConfigurationParamter;
    // if(Constants.SchemeMaster.STAND_UP_INDIA_SCHEME.id != this.schemeId){
    //   this.getSubLoanId();
    // }

    this.getSubLoanId();

    this.productId = this.popUpObj.productId;

    this.fieldRequest.id = Number(this.productId);
    this.fieldRequest.businessTypeId = this.businessTypeId;
    this.fieldRequest.schemeId = this.schemeId;
    // if (this.schemeId == Constants.SchemeMaster.PRADHAN_MANTRI_MUDRA_YOJNA.id || this.schemeId == Constants.SchemeMaster.STAND_UP_INDIA_SCHEME.id) {
    //   this.fieldRequest.subLoanId = this.subLoanId;
    // }
    this.fieldRequest.borrowrTypeIds = this.selectedBorrowrType;
    // this.selectedBorrowrType
    console.log(this.selectedBorrowrType);
    this.getAllFields(this.fieldRequest);
// console.log(this.fieldRequest);
    if (this.popUpObj.selectedField != undefined && this.popUpObj.selectedField != null) {
      this.selectValue = this.popUpObj.selectedField.productFieldTempMappings;

      // this.count = this.selectValue.length;
    }
    this.tab = this.popUpObj.isMandetory;


  }
  selectAll() {
    // this.count = 0;
    if (this.selectAllFields) {
      this.fields.forEach(element => {
        if (element.id === 0) {
          element.product = Number(this.popUpObj.productId);
          if (this.popUpObj.isMandetory == true) {
            element.isMandatory = true;
            element.isConsidered = true;
            let data =_.findIndex(this.selectedField,['fieldId', element.fieldId]);
            if(data == -1){
              this.selectedField.push(element);
            }
            
          }
          else {
            if (element.fieldId != 1 || element.fieldId != 20) {
              element.isMandatory = false;
              element.isConsidered = true;
              let data =_.findIndex(this.selectedField,['fieldId', element.fieldId]);
              if(data == -1){
                this.selectedField.push(element);
              }
            }
          }
          this.count++;
        }
      });
    } else {
      this.count = 0;
      this.fields.forEach(element => {
        if (!element.isDisabled) {
          const i = this.selectedField.indexOf(element);
          element.isConsidered = false;
          this.selectedField.splice(i, 1);
        }
      });
    }
  }
  closeModal() {
    this.selectedField = [];
    this.activeModal.close('close');

  }
  addParameter() {
    // console.log(this.selectedField);
    this.productService.saveProductFields(this.selectedField).subscribe(response => {
      if (response.status === 200) {
        this.activeModal.close('ok');
        // console.log(this.selectedField);
        this.commonService.successSnackBar("Parameter added sucessfully");
      }
    }, function (error) {
      if (error.status == 401) {
      }
    });
  }

  getAllFields(fieldRequest: any) {

    this.productService.getFields(fieldRequest)
      .subscribe(
        data => {
          this.fields = data.data;
          this.fields.forEach(element => {
            if (element.isConsidered) {
              element.isDisabled = true;
              this.count = this.count + 1;
            }
          });
          this.getItrTypeBasedParemeter()
          // console.log(this.fields);
          this.groupByFields = _.groupBy(this.fields, 'source');
          // console.log(this.groupByFields);

          if (this.count == this.fields.length) {
            this.selectAllFields = true;
          }
        },
        error => {
          console.log(error);
        });

  }
  selectedFields(fieldsData: any, event: any) {
    const checked = event;
    if (!this.commonService.isObjectNullOrEmpty(this.selectValue)) {
      this.fieldLength = this.selectValue.length;
    } else {
      this.fieldLength = 0;
    }
    if (checked) {
      this.count = this.count + 1;
      if (this.selectedField.indexOf(fieldsData)=== -1) {
        fieldsData.product = Number(this.popUpObj.productId);
        if (this.popUpObj.isMandetory == true) {
          fieldsData.isMandatory = true;
        }
        else {
          fieldsData.isMandatory = false;
        }
        fieldsData.isConsidered = true;
        this.selectedField.push(fieldsData);
      }
    } else {
      this.count = this.count - 1;
      for (var i = 0; i < this.fieldLength; i++) {
        const fieldsData1 = this.selectValue[i];
        if (fieldsData1.id == fieldsData.fieldId) {
          fieldsData.product = Number(this.popUpObj.productId);
          if (this.popUpObj.isMandetory == true) {
            fieldsData.isMandatory = true;
          }
          else {
            fieldsData.isMandatory = false;
          }
          fieldsData.isConsidered = false;
          this.selectedField.splice(i, 1);
        }
      }
    }
  }

  filterText(searchText: any) {
    if (this.commonService.isObjectNullOrEmpty(searchText)) {
      this.mainList = this.fields;
      return;
    }
    this.mainList = this.fields.filter((item) => (item.fieldParameter.toLowerCase().includes(searchText.toLowerCase())))
  }

  getSubLoanId() {
    this.subLoanId = 302;
    // console.log(this.editConfigurationParamter);
    // for (const [key, value] of Object.entries(this.editConfigurationParamter)) {
    //   const data:any= value;
    //   for(let val of data){
    //   if (key == "TYPE_OF_PRODUCT") {
    //     this.subLoanId = val.masterId;
    //   }
    //   if (key == "TYPE_OF_FINANCIAL") {
    //     if (val.masterId == this.itrType.AUDIT_ITR) {
    //       this.selectedFinType.push(val.masterId)
    //     }
    //     if (val.masterId == this.itrType.NO_ITR) {
    //       this.selectedFinType.push(val.masterId)
    //     }
    //   }

    //   if (key == "BORROWER_TYPE") {
    //     if (val.masterId == this.borrowerType.isSalaried) {
    //       this.selectedBorrowrType.push(1)
    //     }
    //     if (val.masterId == this.borrowerType.isNonSalaried) {
    //       this.selectedBorrowrType.push(2)
    //     }
    //   }
      
    //   }
    // }
  //  console.log(this.subLoanId);

  }

  getItrTypeBasedParemeter() {
    const typ=this.selectedFinType[0];
    // console.log(typ);
    // console.log(this.selectedFinType);
    if (this.selectedFinType) {
     if (this.selectedFinType.length != 2) {
       this.fields = _.filter(this.fields, function (value) { return (value.itrType == 3 || value.itrType==typ) });
      }
    }

  }
}
