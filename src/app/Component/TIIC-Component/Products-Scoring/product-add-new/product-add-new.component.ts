import { Component, OnInit, Renderer2, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import * as _ from 'lodash';
import { CommonService } from 'src/app/CommoUtils/common-services/common.service';
import { Constants } from 'src/app/CommoUtils/constants';
import { ProductService } from 'src/app/services/product.service';

@Component({
  selector: 'app-product-add-new',
  templateUrl: './product-add-new.component.html',
  styleUrls: ['./product-add-new.component.scss']
})
export class ProductAddNewComponent implements OnInit {
  @ViewChild('productForm') productForm: NgForm;
  // bread crumb data
  breadCrumbItems!: Array<{}>;
  selectValue: any = [];
  submitted = false;
  productId: number = 0;
  data: any = {
    userOrgId: 0,
    userId: 0,
    id: 0,
    businessTypeId: 0,
    loanTypeId: 0,
    productAvailFor: 0,
    productName: null,
    productTypeTempResponses: []

  };
  mId: number = 0;
  productData!: any[];
  type!: any[]
  num: any;
  businessTypeId: number;
  loanTypeId: Number;
  routeMainPath!: any;
  productAvailable: any = [];
  loanType: any = [];
  OCCUPATION: any = [];
  purposeOfLoan: any = [];
  construction: any = [];
  repairs: any = [];
  borrowerTypeHome: any = [];
  borrowerGroup: any = [];
  responseEnum: any = [];
  requestEnum: any[];
  resEnum: any = [];

  schemeId!: number;

  selectedData!: Boolean;

  allBLApprovedData: any = [];
  allApprovedData: any = [];
  configList: any = [];

  constructor(private modelService: NgbModal,
    private commonService: CommonService,
    private router: Router, private route: ActivatedRoute,
    private productService: ProductService, private renderer: Renderer2) {
    this.routeMainPath = 'TIIC';
  }

  ngOnInit() {
    this.breadCrumbItems = [{ label: 'Dashboard', path: this.routeMainPath + '/dashboard' }, { label: 'Product', path: this.routeMainPath + '/Product-List' }, { label: 'Add New Product', path: '/', active: true }];
    this.businessTypeId = 1;
    this.schemeId = 9;
    this.route.queryParams.subscribe(params => {
      if (!CommonService.isObjectNullOrEmpty(params)) {
        if (!CommonService.isObjectNullOrEmpty(params.id)) {
          this.productId = Number(CommonService.decryptFunction(params['id']));
        }
      }
      // this.addDefaultSelected();
    });
   
    this.getAllApprovedProduct();

    this.getProductConfignPara(this.businessTypeId, this.schemeId);
  }

  onSubmit() {
    this.submitted = true;
    this.createProduct();

  }
  onCancel() {
    this.router.navigate([this.routeMainPath + '/Product-List'])
  }

  selectForRadio(event: any, fieldId: any, type: string, config: any) {
    this.mId = fieldId;
    if (event) {
      config?.list.forEach(element => {
        if (element?.id !== this.mId) {
          element.checked = 0;
        }
        if (element?.id == this.mId) {
          element.isChecked = true;
          this.getAllBLApprovedProduct(fieldId,type);
        }else{
          element.isChecked = false;
        }
      });
      return;
    }
  }
  getProductById(id: number) {
    this.productService.getProductById(id, this.businessTypeId, this.schemeId).subscribe(
      response => {
        if (response.status === 200) {
          this.data = response.data;
          // console.log(this.data.productTypeTempResponses)
          if (this.resEnum) {
            this.resEnum.forEach(config => {
              config.list.forEach(element => {
                // console.log(config.enumName,"==============="  ,element.id )
                const request = _.filter(this.data.productTypeTempResponses, x => config.enumName == x.masterType && element.id == x.masterId);
                if (!_.isEmpty(request)) {
                  element.isChecked = true;
                  element.checked = element.id;
                }else{
                  element.isChecked = false;
                  element.checked = 0;
                }
              });
            });
            console.log(this.resEnum);
          }
        }
      }, (error: any) => {
        this.commonService.errorSnackBar(error);
      });
  }
  checkValidation(): boolean {
    let isValidated = true;
    if (this.commonService.isObjectNullOrEmpty(this.data.productName)) {
      this.commonService.warningSnackBar('Product name should not be null or empty');
      isValidated = false;
      return isValidated;
    }
    if (this.resEnum) {
      this.resEnum.forEach(config => {
        const index = _.findIndex(config.list, ['isChecked', true]);
        if (index == -1) {
          // console.log(config.enumName);
          isValidated = false;
          this.commonService.warningSnackBar('Please select any of ' + config.title + " value.");
          return;
        }
        return;
      });
    }


    return isValidated;
  }
  createProduct() {
    if (this.checkValidation() && this.productForm.valid ) {
      this.data.id = Number(this.productId);
      if (this.productId == undefined) {
        this.data.id = 0;
      }
      this.data.businessTypeId = this.businessTypeId;
      this.data.schemeId = this.schemeId;
      this.data.productStatusId = 2;
      this.data.isActive = true;
      this.data.loanTypeId = this.loanTypeId;
      this.resEnum.forEach(config => {
        const data = _.filter(config.list, ['isChecked', true]);
        if (this.commonService.isObjectNullOrEmpty(data)) {
          return;
        } else {
          data.forEach(d=>{
            this.configList.push(d);
          })
          
        }
        return;
      });
      this.data.configList = this.configList;
      // console.log("this.data::",this.data);
      this.productService.createNewProduct(this.data).subscribe(
        response => {
          if (response.status === 200) {
            const responseData = response.data;
            this.router.navigate([this.routeMainPath + '/Product-Edit'], { queryParams: { id: CommonService.encryptFunction(responseData.id.toString()) } });
          }
        }, (error: any) => {
          this.commonService.errorSnackBar(error);
          window.location.reload();
        });
    }else{
      this.commonService.warningSnackBar('Please Enter valid details.');
    }
  }
  getAllApprovedProduct() {
    this.productService.getAllMasterProduct(this.businessTypeId, this.schemeId).subscribe(
      response => {
        if (response.status === 200) {
          this.allApprovedData = response.data;
          // this.selectValue=_.cloneDeep(this.allApprovedData);
          this.getAllBLApprovedProduct(2,"TYPE_OF_LOAN");
        }
      }
    )
  }


  getProductConfignPara(businessTypeId: number, schemeId: number) {
    this.productService.getProductConfignPara(businessTypeId, schemeId).subscribe(
      response => {
        if (response.status === 200) {
          this.resEnum = response.data;
          this.resEnum.forEach(element => {
            element.list = JSON.parse(element.list);
          });
          this.responseEnum = this.resEnum;
          this.resEnum = _.orderBy(this.resEnum, ['sequence'], ['asc'])
          if (this.productId !== 0) {
            this.getProductById(this.productId);
          }
      
        }
      });


  }
  getAllBLApprovedProduct(subLoanID: any, subLoan: any) {
    if (subLoan === "TYPE_OF_LOAN") {
      // this.filterApprovedProduct(1);
      let data = _.cloneDeep(this.allApprovedData);
      for (let element of data) {
        let result = _.filter(element.productTypeResponses, obj => obj.masterType === subLoan);
        if (result[0].masterId != subLoanID) {
          let index = _.findIndex(this.selectValue, ['id', element.id]);
          if (index != -1) {
            this.selectValue.splice(index, 1);
          }
        } else {
          let index1 = _.findIndex(this.selectValue, ['id', element.id]);
          if (index1 == -1) {
            this.selectValue.push(element)
          }
        }
      }
      this.selectValue = _.cloneDeep(this.selectValue);
      // console.log("selectValue", this.selectValue)
    }

  }
}
