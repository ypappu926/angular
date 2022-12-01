import { Component, Input, OnInit, ViewChild, OnDestroy, Output, EventEmitter } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { EligibilityModel, EquatedIncome, MarginModel, LTVLoanAmountIncome } from './eligibility.model';
import * as _ from 'lodash';
import { SnackbarService } from 'src/app/CommoUtils/common-services/SnackbarService';
import { CommonService } from 'src/app/CommoUtils/common-services/common.service';
import { Subscription } from 'rxjs';
import { Constants } from 'src/app/CommoUtils/constants';
import { ProductService } from 'src/app/services/product.service';

@Component({
  selector: 'app-eligibility-model',
  templateUrl: './eligibility-model.component.html',
  styleUrls: ['./eligibility-model.component.scss']
})
export class EligibilityModelComponent implements OnInit, OnDestroy {

  @Input() contentType;
  @Input() productType;
  @Output() dataSavedEvent = new EventEmitter();
  @ViewChild('eligModelForm') eligModelForm: NgForm;
  submitted = false;
  selectValue = [{ label: 'Education Loan', value: 1 }];
  selectValueHl = [{ label: 'Home Loan Eligibility', value: 2 }];

  loanAmountBasedOnList = [{ value: 1, label: 'Loan Amount' }, { value: 2, label: 'Property Value' }];

  eligibilityModel = new EligibilityModel();
  multiplierOption = [];
  loanRatioOption = [];
  fpProductId;
  editMode = false;
  roleId;
  loanTypeId;
  businessTypeId;
  typeId!: number;
  routeMainPath!: any;
  islocationIndia = false;
  islocationOutOfIndia = false;
  schemeId!: number;

  byIdData: any = {};
  roles

  saveEventSubscripiton: Subscription;
  oldProduct;
  isFromView;
  object;
  constructor(
    private activatedRoute: ActivatedRoute,
    private productService: ProductService,
    private snackbarService: SnackbarService,
    private commonService: CommonService,
    private prodService: ProductService,
    private router: Router,
  ) {
    this.fillMultiplierOption();
    this.activatedRoute.queryParams.subscribe(data => {
      if (data) {
        this.fpProductId = CommonService.decryptFunction(data.id);
        this.typeId =Number(CommonService.decryptFunction(data.tab)); 
        this.oldProduct = CommonService.decryptFunction(data.old);
        this.isFromView = CommonService.decryptFunction(data.isFromView);
        // console.log(this.typeId,"==",this.oldProduct);
      }
    });
    this.saveEventSubscripiton = this.productService.saveSubjectSubscriber$.subscribe(data => {
      if (data && (data === 'save' || data === 'save&Exit'||data=='saveEligibilityForApprovel')) {
        this.object=data;
         this.onSaveBusinessLoan(data);
        

      }
    });
  }

  ngOnInit(): void {
    this.roleId = Number(CommonService.getStorage(Constants.httpAndCookies.ROLEID, true));
  this.businessTypeId = 1
    this.schemeId =9;
    this.roles = this.commonService.getConstant().UserRoleList;
    
      this.eligibilityModel.assessmentMethodId = 3; // business


    if (this.fpProductId) {
      if (this.typeId == 5) {
        if (this.oldProduct === 'true' ||this.oldProduct === true) {
          this.getEligibilityModelMasterById();
        }else{
          this.getEligibilityModelById();
        }
      } else {
       
        if (this.typeId == 1&&(this.isFromView === 'true' ||this.isFromView === true)) {
          this.getEligibilityModelMasterById();
        }else{
          this.getEligibilityModelById();
          this.getProductDetailById(this.fpProductId, this.businessTypeId, this.schemeId);
        }
       
      }
    }
  }


  ngOnDestroy(): void {
    this.saveEventSubscripiton.unsubscribe();
  }


  getProductDetailById(id: number, businessTypeId: number, schemeid: number) {
    this.prodService.getProductById(id, businessTypeId, 1).subscribe(data => {

      if (data.data && data.data.productTypeTempResponses != null && data.data.productTypeTempResponses != undefined) {
        data.data.productTypeTempResponses.forEach(product => {
          if (product.masterId === 1 && product.masterType === "LOAN_TYPE") {
            this.islocationIndia = true;
            // console.log("INDIA  :::::{}",this.islocationIndia);
          }
          if (product.masterId === 2 && product.masterType === "LOAN_TYPE") {
            this.islocationOutOfIndia = true;
            // console.log("OUT OF INDIA  :::::{}",this.islocationOutOfIndia);
          }
          
        });
      }
    },
      error => {
        console.log(error);
      });
  }


  addMarginModel(): void {
    // this.eligibilityModel.marginModelAry.push(new MarginModel());
    // // for margin
    // const lastIndex = _.findLastIndex(this.eligibilityModel.marginModelAry);
    // if (lastIndex !== -1) {
    //   this.eligibilityModel.marginModelAry[lastIndex].loanAmountMax = 9223372036854776000;
    // }
    // if (lastIndex === 0) {
    //   this.eligibilityModel.marginModelAry[lastIndex].loanAmountMin = 0;
    // } else if (lastIndex > 0) {
    //   // this.eligibilityModel.marginModelAry[lastIndex].loanAmountMin = Number(this.eligibilityModel.marginModelAry[lastIndex - 1].loanAmountMax) + 1;
    //   this.eligibilityModel.marginModelAry[lastIndex - 1].loanAmountMax = null;
    // }
  }

  addEquatedIncome(): void {
    // this.eligibilityModel.equatedIncomeAry.push(new EquatedIncome());
    // // for income
    // const lastIndex = _.findLastIndex(this.eligibilityModel.equatedIncomeAry);
    // if (lastIndex !== -1) {
    //   this.eligibilityModel.equatedIncomeAry[lastIndex].incomeMax = 9223372036854776000;
    // }
    // if (lastIndex === 0) {
    //   this.eligibilityModel.equatedIncomeAry[lastIndex].incomeMin = 0;
    // } else if (lastIndex > 0) {
    //   // this.eligibilityModel.equatedIncomeAry[lastIndex].incomeMin = Number(this.eligibilityModel.equatedIncomeAry[lastIndex - 1].incomeMax) + 1;
    //   this.eligibilityModel.equatedIncomeAry[lastIndex - 1].incomeMax = null;
    // }
  }


  // for Home Loan
  addLTVLoanAmountRange(): void {
    // this.eligibilityModel.ltvLoanAmtArray.push(new LTVLoanAmountIncome());
    // const lastIndex = _.findLastIndex(this.eligibilityModel.ltvLoanAmtArray);
    // if (lastIndex !== -1) {
    //   this.eligibilityModel.ltvLoanAmtArray[lastIndex].incomeMax = 9223372036854776000;
    // }
    // if (lastIndex === 0) {
    //   this.eligibilityModel.ltvLoanAmtArray[lastIndex].incomeMin = 0;
    // } else if (lastIndex > 0) {
    //   this.eligibilityModel.ltvLoanAmtArray[lastIndex - 1].incomeMax = null;
    // }
  }





  fillMultiplierOption(): void {
    for (let index = 0; index < 49; index++) {
      this.multiplierOption.push(index);
    }
    for (let index = 1; index < 11; index++) {
      this.loanRatioOption.push({ value: index, label: index +" Times"});
    }
  }

  onSaveBusinessLoan(saveType): void {
    this.submitted = false;
    setTimeout(() => {
      this.submitted = true;
    }, 0);
    if (this.eligModelForm.valid) {
      this.eligibilityModel.fpProductId = this.fpProductId;
      this.productService.saveEligibilityModel(this.eligibilityModel).subscribe(res => {
        if (saveType === 'save&Exit') {
          this.router.navigate([this.routeMainPath + '/Product-List']);
        } else {
          if(this.object=='saveEligibilityForApprovel'){
            this.dataSavedEvent.emit('eligibilityApprovel');
          }else{
            this.dataSavedEvent.emit('eligibilitySaved');
          }
        }
      });
    }
    else
    { this.snackbarService.openSnackBar('Data not saved please fill careful', null, 'warning');
      this.dataSavedEvent.emit('notSaved');
        return;
    }
  }



  // onBlurRange(index, type): any {
  //   if (type === 'income') {
  //     if (this.eligibilityModel.equatedIncomeAry[index].incomeMax <= this.eligibilityModel.equatedIncomeAry[index].incomeMin) {
  //       this.eligibilityModel.equatedIncomeAry[index].incomeMax = null;
  //       this.eligibilityModel.equatedIncomeAry[index + 1].incomeMin = null;
  //       return;
  //     }
  //     if (index > 0 && !this.eligibilityModel.equatedIncomeAry[index - 1].incomeMax) {
  //       this.eligibilityModel.equatedIncomeAry[index].incomeMax = null;
  //       return;
  //     }
  //     this.eligibilityModel.equatedIncomeAry[index + 1].incomeMin = Number(this.eligibilityModel.equatedIncomeAry[index].incomeMax) + 1;

  //   } else if (type === 'ltv') { // for home loan
  //     if (this.eligibilityModel.ltvLoanAmtArray[index].incomeMax <= this.eligibilityModel.ltvLoanAmtArray[index].incomeMin) {
  //       this.eligibilityModel.ltvLoanAmtArray[index].incomeMax = null;
  //       this.eligibilityModel.ltvLoanAmtArray[index + 1].incomeMin = null;
  //       return;
  //     }
  //     if (index > 0 && !this.eligibilityModel.ltvLoanAmtArray[index - 1].incomeMax) {
  //       this.eligibilityModel.ltvLoanAmtArray[index].incomeMax = null;
  //       return;
  //     }
  //     this.eligibilityModel.ltvLoanAmtArray[index + 1].incomeMin = Number(this.eligibilityModel.ltvLoanAmtArray[index].incomeMax) + 1;

  //   } else {
  //     if (this.eligibilityModel.marginModelAry[index].loanAmountMax <= this.eligibilityModel.marginModelAry[index].loanAmountMin) {
  //       this.eligibilityModel.marginModelAry[index].loanAmountMax = null;
  //       this.eligibilityModel.marginModelAry[index + 1].loanAmountMin = null;
  //       return;
  //     }
  //     if (index > 0 && !this.eligibilityModel.marginModelAry[index - 1].loanAmountMax) {
  //       this.eligibilityModel.marginModelAry[index].loanAmountMax = null;
  //       return;
  //     }
  //     this.eligibilityModel.marginModelAry[index + 1].loanAmountMin = Number(this.eligibilityModel.marginModelAry[index].loanAmountMax) + 1;
  //   }
  // }


  // MAX CO-APP ALLOWED
  // onBlurRangeNew(event, value): void {
  //   const numberText = value;
  //   if (numberText != null && numberText != undefined) {
  //     if (value > 3 || value < 0) {
  //       this.eligibilityModel.noOfCoApplicant = null;
  //     }
  //   }
  // }

  // // MAX AGE ALLOWED
  // onBlurRangeMaxAge(event, value): void {
  //   const numberText = value;
  //   if (numberText != null && numberText != undefined) {
  //     if (value > 100 || value < 0) {
  //       this.eligibilityModel.maxAgeAllowed = null;
  //     }
  //   }
  // }



  getEligibilityModelById(): void {
    this.productService.getEligibilityByProductId(this.fpProductId).subscribe(res => {
      console.log(res.data);
      if (res.data && res.data.length > 0) {
        this.editMode = true;
        this.eligibilityModel = res.data[0];
          this.eligibilityModel.assessmentMethodId = 3; // business
       
      }
    });
  }

  getEligibilityModelMasterById(): void {
    this.productService.getEligibilityModelMasterById(this.fpProductId).subscribe(res => {
      console.log(res.data);
      if (res.data?.length > 0) {
        this.editMode = true;
        this.eligibilityModel = res.data[0];
      
          this.eligibilityModel.assessmentMethodId = 3; // business
        
      }
    });
  }

  onSend(): void {
    const obj = {
      id: this.eligibilityModel.id
    };
    this.productService.sendEligibilityForApproval(obj).subscribe(res => {
      console.log(res);
    });
  }

  // onDeleteRange(index, type): void {
  //   if (type === 'marginModel') {
  //     this.eligibilityModel.marginModelAry.splice(index, 1);
  //     const arySize = _.size(this.eligibilityModel.marginModelAry);
  //     if (arySize > 0) {
  //       this.eligibilityModel.marginModelAry[arySize - 1].loanAmountMax = 9223372036854776000;
  //     }
  //   } else if (type === 'equatedIncome') {
  //     this.eligibilityModel.equatedIncomeAry.splice(index, 1);
  //     const arySize = _.size(this.eligibilityModel.equatedIncomeAry);
  //     if (arySize > 0) {
  //       this.eligibilityModel.equatedIncomeAry[arySize - 1].incomeMax = 9223372036854776000;
  //     }
  //   } else if (type === 'ltvLoanAmt') {
  //     this.eligibilityModel.ltvLoanAmtArray.splice(index, 1);
  //     const arySize = _.size(this.eligibilityModel.ltvLoanAmtArray);
  //     if (arySize > 0) {
  //       this.eligibilityModel.ltvLoanAmtArray[arySize - 1].incomeMax = 9223372036854776000;
  //     }
  //   }
  // }

  blurForMax(event, fieldName): void {
    const numberText = event.target.value;
    if (Number(numberText) > 100) {
      this.eligibilityModel[fieldName] = '';
      if (fieldName === 'totalSantionedAmnt') {
        this.eligibilityModel.totalSantionedAmnt = '';
       
      } else if (fieldName === 'totalOutStandingAmnt') {
        this.eligibilityModel.totalOutStandingAmnt = '';
      }
    }
  }

  // onChangeMudraCategoryCheckbox(event): void {
  //   // if (!event) {
  //   //   this.eligibilityModel.minorityCommunityRate = null;
  //   //   this.eligibilityModel.womenRate = null;
  //   // }
  // }

  // onCheckboxClick(event, fieldName): void {
  //   // if (!event) {
  //   //   if (fieldName === 'isBaseOnIncome') {
  //   //     this.eligibilityModel.baseOnIncome = null;
  //   //   } else if (fieldName === 'isMultiplierIncome') {
  //   //     this.eligibilityModel.multiplierIncome = null;
  //   //     this.eligibilityModel.multiplier = null;
  //   //   } else if (fieldName === 'isMarginBasedModel') {
  //   //     this.eligibilityModel.marginModel = null;
  //   //     this.eligibilityModel.marginModelAry = [];
  //   //   } else if (fieldName === 'isEquatedIncome') {
  //   //     this.eligibilityModel.equatedIncome = null;
  //   //     this.eligibilityModel.equatedIncomeAry = [];
  //   //   } else if (fieldName === 'isLoanToAssestValue') {
  //   //     this.eligibilityModel.loanToAssestValue = null;
  //   //     this.eligibilityModel.ltvLoanAmtArray = [];
  //   //   }
  //   // }
  // }
}
