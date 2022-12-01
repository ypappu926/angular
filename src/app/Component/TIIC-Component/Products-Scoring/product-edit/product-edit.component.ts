import { Component, ElementRef, HostListener, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal, NgbModalConfig } from '@ng-bootstrap/ng-bootstrap';
import * as _ from 'lodash';
import { CommonService } from 'src/app/CommoUtils/common-services/common.service';
import { Constants } from 'src/app/CommoUtils/constants';
import { ComViewProductConfigurationComponent } from 'src/app/Popup/Product-Scoring/com-view-product-configuration/com-view-product-configuration.component';
import { ProductCommonComponent } from 'src/app/Popup/Product-Scoring/product-common/product-common.component';
import { ProductParametersComponent } from 'src/app/Popup/Product-Scoring/product-parameters/product-parameters.component';
import { UnsavePopupComponent } from 'src/app/Popup/unsave-popup/unsave-popup.component';
import { ProductService } from 'src/app/services/product.service';


declare var jQuery: any;
declare var $: any;

@Component({
  selector: 'app-product-edit',
  templateUrl: './product-edit.component.html',
  styleUrls: ['./product-edit.component.scss']
})
export class ProductEditComponent implements OnInit {

  tab: any;
  isActive = false;
  // bread crumb data
  breadCrumbItems!: Array<{}>;

  isCollapsed!: boolean;

  submitted = false;
  selectValue!: string[];


  value: number = 100;
  highValue: number = 60;
  maxValue!: 100;

  marked = false;
  theCheckbox = false;
  theCheckbox1 = false;
  workflowRes: any;
  jobId: any;
  actionButtons: any;
  actionButton: any;


  count: number = 0;
  allData: any;
  byIdData: any = {};
  numArray: any;
  productId: any;
  productFields: any = {
    productName: String,
  };
  fields: any = {};
  subFields: any;
  saveData: any[] = new Array();
  fieldLength: number = 0;
  ab: number = 0;
  productSubField: any = {};
  tabValue!: Boolean;
  roleId: any;
  roles: any = [];
  checkBoxes = [];
  maxScoringRange: number;


  typeId: any;
  isEdit = false;
  userRoleIds: any = [];
  businessTypeId: number;
  index: number = 1;

  popUpObj: any = {};
  showActionButtons = false;
  totalScore = 0;
  totalScoreCoApp = 0;
  noRange = 0;
  range = '';
  routeMainPath!: any;
  userPermissionList: any = [];
  maximumIncome = Number.MAX_SAFE_INTEGER;

  schemeId!: number;

  isMendetorySaved: Boolean = false;
  isOptionalSaved: Boolean = false;
  isEligiblitySaved: Boolean = false;
  isScallingSaved: Boolean = false;

  previousTab: number;

  selectedCheckBox: any = [];
  editConfiParam: any = {};
  editConfigurationParamter: any = {};
  productType;
  bureauRange: any = [];
  maxLoanAmount: Number;
  minLoanAmount: Number;
  minTenure: Number;
  maxTenure: Number;
  constant: any;
  updatedDetails: any;
  tmpScalingWithScoringObj: any = {};
  tmpScalingWithNoScoringObj = {};
  scalingConfig: any = {};
  isScalingLoanAmntConfig = false;
  constructor(public NPconfig: NgbModalConfig,
    private modalService: NgbModal,
    private commonService: CommonService,
    private prodService: ProductService,
    private route: ActivatedRoute,
    private router: Router) {
    NPconfig.backdrop = 'static';
    this.roleId = Number(CommonService.getStorage(Constants.httpAndCookies.ROLEID, true));
    this.roles = Constants.UserRoleList;
    this.routeMainPath = CommonService.getCurrentPath();
    this.userPermissionList = _.split(CommonService.getStorage('UserPermission', true), ',');
    this.constant = Constants;

  }

  ngOnInit() {
    this.breadCrumbItems = [{ label: 'Dashboard', path: this.routeMainPath + '/dashboard' }, { label: 'Product', path: this.routeMainPath + '/Product-List' }, { label: 'Edit Product', path: '/', active: true }];
    this.route.queryParams.subscribe(params => {
      this.productId = CommonService.decryptFunction(params['id']);
      this.typeId = CommonService.decryptFunction(params['tab']);
    });
    this.userRoleIds.push(CommonService.getStorage(Constants.httpAndCookies.ROLEID, true));
    // Collapse value
    this.isCollapsed = false;
    this.schemeId = 9;
    this.businessTypeId = 1;

    if (this.typeId && this.typeId == 1) {
      this.isEdit = false;
    }

    // tabs
    this.tab = 1;

    if (!(this.typeId == 5)) {
      this.getDataFromTemp();
    } else {
      this.showActionButtons = true
      this.getDataFromMaster();
    }

    // This Add Nikul Don't Remove
    (function ($) {
      $(document).ready(function () {
        var parentwidth = $(".parent").width();
        $(".fix-to-top").width(parentwidth);
      })

      $(window).resize(function () {
        var parentwidth = $(".parent").width();
        $(".fix-to-top").width(parentwidth);
      });

    })(jQuery);
    // This Add Nikul Don't Removedeclare var
    if (this.typeId != 1 && this.typeId != 5) {
      this.getApprovalFlag();
    }
    // this.scoringObj.isNoScoring = false;

  }


  getCount() {
    if (this.productFields && this.productFields.productFieldTempMappings != null) {

      for (let dd of this.productFields.productFieldTempMappings) {
        for (let sub of dd.productSubFieldTempResponse) {
          if (sub.controlType === 3 || sub.controlType === 1) {
            if (!this.commonService.isObjectNullOrEmpty(sub.value)) {
              dd.value = sub.value;
            }
          }

        }
      }
    }
  }

  getDataFromTemp() {
    this.getFieldsByProduct(this.productId, this.tab);
    this.getProductDetailById(this.productId, this.businessTypeId, this.schemeId);
    // this.getScalingConfig();
  }

  Confirm_Product_Confirmation_Popup() {
    const config = {
      windowClass: 'Mediam-model',
    };
    this.popUpObj.productId = this.productId
    this.popUpObj.type = 9;
    this.commonService.openPopUp(this.popUpObj, ProductCommonComponent, false, config).result.then(result => {

    });
  }

  NP_View_Product_Confirmation_Popup(): void {
    const config = {
      //windowClass: 'popup-650',
      size: 'lg'
    };
    this.popUpObj.editConfigurationParamter = this.editConfigurationParamter;
    this.popUpObj.byIdData = this.byIdData;
    this.commonService.openPopUp(this.popUpObj, ComViewProductConfigurationComponent, false, config).result.then(result => {

    });
  }

  getDataFromMaster() {
    // this.getAllFieldsFromMaster(this.productId);
    this.getFieldsByProductFromMaster(this.productId);
    this.getProductDetailByIdFromMaster(this.productId);
  }

  getWorkflowRes() {
    if (this.commonService.isObjectNullOrEmpty(this.jobId)) {
      this.commonService.errorSnackBar('Something went wrong.this.jobId');
      //this.createJob();
    }
    let request = { roleIds: this.userRoleIds, jobId: this.jobId, workflowId: 4 };
    this.prodService.getActiveSteps(request).subscribe(res => {
      if (this.commonService.isObjectNullOrEmpty(res)) {
        this.commonService.errorSnackBar('Something went wrong.res');
        return;
      }
      if (!this.commonService.isObjectNullOrEmpty(res.data)) {
        this.actionButtons = res.data.step.stepActions;
      } else {
        this.actionButtons = [];
      }
    }, error => {
      this.commonService.errorSnackBar(error);
    });
  }

  Send_Checker_Approval_Popup(action: any) {
    // if (!this.isValidScaling(true)) {
    //   return;
    // }
    const config = {
      windowClass: 'popup-650',
    };
    this.popUpObj.name = this.byIdData.productName;

    if (action.action.id === 53) {
      this.popUpObj.type = 7;
    } else {

      this.popUpObj.type = 4;
    }
    this.commonService.openPopUp(this.popUpObj, ProductCommonComponent, false, config).result.then(result => {
      if (result === 'Ok') {
        // console.log("calling....")
        // this.sendForApproval(action);
        this.saveSubFieldsValueSendForApprovel(this.productFields, action)
      }
    });
  }


  sendForApproval(action: any) {

    // if (this.tab == 4 && this.commonService.isObjectNullOrEmpty(this.baseRate)) {
    //   this.commonService.warningSnackBar('Please create or approved REPO/MCLR.');
    //   return;
    // }

    action.jobId = this.jobId;
    action.currentStep = action.workflowStep;
    action.toStep = action.nextworkflowStep;
    action.actionId = action.action.id;
    this.byIdData.workflowRequest = action;
    this.byIdData.productTypeTempResponses = [];
    this.prodService.sendForApproval(this.byIdData).subscribe(res => {
      this.getWorkflowRes();
      if (!this.commonService.isObjectNullOrEmpty(res)) {
        if (action.action.id === 16) {
          this.commonService.successSnackBar("Successfully Sent for Approval ");
          this.router.navigate(['TIIC/Product-List'])
        }
      }
    }, error => {
      this.commonService.errorSnackBar(error);
    })
  }
  createJob() {
    let request = { 'workflowId': 4 };
    this.prodService.createWorkflowJob(request).subscribe(res => {
      if (this.commonService.isObjectNullOrEmpty(res)) {
        this.commonService.errorSnackBar('Something went wrong.');
        return;
      }
      this.jobId = 101;
      this.getWorkflowRes();
    }, error => {
      this.commonService.errorSnackBar(error);
    });
  }


  toggleVisibility(e: any) {
    this.marked = e.target.checked;
  }


  changeTab(tabId: number) {

    this.savePreviousTabData(this.tab, this.productFields);
    this.tab = tabId;

    // commented by vinita for loanamount sync
    // if (this.typeId != 5) {
    //   this.getFieldsByProduct(this.productId, this.tab);
    // }
    if (this.tab == 4) {
      // this.getScalingData();
    } else if (this.tab == 1 || this.tab == 2) {
      if (this.typeId != 5) {
        this.getFieldsByProduct(this.productId, this.tab);
      }
    }
  }
  // Scroll table For Nikul Don't Remove  05-Feb-2021 Start
  @ViewChild('tabScrollNP', { read: ElementRef }) public tabScrollNP!: ElementRef<any>;

  public TabscrollRight(): void {
    this.tabScrollNP.nativeElement.scrollTo({ left: (this.tabScrollNP.nativeElement.scrollLeft + 200), behavior: 'smooth' });
  }

  public TabscrollLeft(): void {
    this.tabScrollNP.nativeElement.scrollTo({ left: (this.tabScrollNP.nativeElement.scrollLeft - 200), behavior: 'smooth' });
  }
  // @ViewChild('MandatoryScrollNP', { read: ElementRef }) public MandatoryScrollNP!: ElementRef<any>;

  // public scrollRight(): void {
  //   this.MandatoryScrollNP.nativeElement.scrollTo({ left: (this.MandatoryScrollNP.nativeElement.scrollLeft + 150), behavior: 'smooth' });
  // }

  // public scrollLeft(): void {
  //   this.MandatoryScrollNP.nativeElement.scrollTo({ left: (this.MandatoryScrollNP.nativeElement.scrollLeft - 150), behavior: 'smooth' });
  // }
  //  This js On Window Scroll Top set Cont Dont Remove @Nikul

  // dynamic header function
  isLargeScreen() {
    const width = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
    if (width < 1650) {
      return true;
    } else {
      return false;
    }
  }
  // Windi scroll Function
  @HostListener('window:scroll', ['$event'])
  onWindowScroll(e: any) {
    if (window.pageYOffset > window.innerHeight) {
      let element: any = document.getElementById('stick-headerN');
      element.classList.add('fix-to-top');
      this.adjustWidth();
    } else {
      let element: any = document.getElementById('stick-headerN');
      element.classList.remove('fix-to-top');
      //this.adjustWidthRemove();]
      // Fix After Remove Css
      let stickN: any = document.getElementById("stick-headerN");
      stickN.style.width = "100%"
    }
  }

  adjustWidth() {
    var parentwidth = $(".parent").width();
    $(".fix-to-top").width(parentwidth);
  }
  //  This js On Window Scroll Top set Cont Dont Remove @Nikul


  Unsave_Changes_Popup(object: any) {
    const config = {
      windowClass: 'popup-650',
    };
    const modalRef = this.modalService.open(UnsavePopupComponent, config).result.then((result) => {
    }, (reason) => {
      if (reason === 'exitWithoutSave') {
        this.router.navigate([this.routeMainPath + '/Product-List']);
      } else if (reason === 'saveExit') {
        if (this.tab === 1 || this.tab === 2) {
          this.saveProductSubFieldValue(object);
          this.router.navigate([this.routeMainPath + '/Product-List']);
        } else if (this.tab === 3) {
          this.onSave('save&Exit');
          this.router.navigate([this.routeMainPath + '/Product-List']);
        } else if (this.tab === 4) {
          // if(this.saveScoringData()){
          this.onScallingSave('save&ExitScaling');
          this.router.navigate([this.routeMainPath + '/Product-List']);
          // }
        }
      }
    });
    return modalRef;
  }

  Product_Parameters_Popup(objData: any, tab: number) {
    const config = {
      windowClass: 'Common-PS-Para',
      size: 'lg',
      keyboard: false,
      ignoreBackdropClick: true
    };
    objData.productId = this.productId;
    objData.editConfigurationParamter = this.editConfiParam;
    objData.selectedField = this.productFields;
    objData.isMandetory = tab == 1 ? true : false;
    this.commonService.openPopUp(objData, ProductParametersComponent, false, config).result.then(result => {
      if (result === 'ok') {
        this.getFieldsByProduct(this.productId, tab);
      } else if (result === 'close') {
        this.getFieldsByProduct(this.productId, tab);
      }
    });
  }



  getProductDetailById(id: number, businessTypeId: number, schemeId: number) {
    // console.log("------",id);
    this.prodService.getProductById(id, businessTypeId, schemeId)
      .subscribe(
        data => {
          this.byIdData = data.data;
          // console.log(this.byIdData);
          this.jobId = this.byIdData.jobId;
          if (!this.commonService.isObjectIsEmpty(this.byIdData.productTypeTempResponses)) {
            this.byIdData.productTypeTempResponses.forEach(element => {
              if (element.masterType === 'TYPE_OF_PRODUCT') {
                this.productType = element.masterId;
              }
            });
          }

          this.editConfiParam = _.groupBy(this.byIdData.productTypeTempResponses, 'masterType');
          this.byIdData.productTypeTempResponses.forEach(element => {
            element.masterType = _.capitalize(element.masterType)
            element.masterType = _.startCase(element.masterType)
          });
          this.editConfigurationParamter = _.groupBy(this.byIdData.productTypeTempResponses, 'masterType');
          // console.log(this.productType);
          this.getWorkflowRes();

        },
        error => {
          console.log(error);
        });
  }
  getProductDetailByIdFromMaster(id: number) {
    this.prodService.getProductByIdFromMaster(id, this.typeId)
      .subscribe(
        data => {
          this.byIdData = data.data;
          this.jobId = this.byIdData.jobId;
          // console.log(this.byIdData);
          this.getWorkflowRes();
        },
        error => {
          console.log(error);
        });
  }
  getFieldsByProduct(id: number, tab: number) {

    if (tab === 1) {
      this.tabValue = true;
    } else if (tab == 2) {
      this.tabValue = false;
    }
    this.prodService.getFieldsByProduct(id, this.tabValue)
      .subscribe(
        data => {
          this.productFields = data.data;
          if (!this.commonService.isObjectNullOrEmpty(this.productFields)) {
            this.productFields.productFieldTempMappings.forEach(element1 => {
              element1.productSubFieldTempResponse.forEach(element2 => {
                if (this.commonService.isObjectNullOrEmpty(element2.value) && element2.controlType != 1 && element2.controlType != 3) {
                  if (element2.controlType == 6) {
                    element2.value = [];
                  } else {
                    element2.value = {};
                    element2.valueforCoApp = {};
                    element2.value.minValue = element2.defaultMinValue
                    element2.value.maxValue = element2.defaultMaxValue
                  }

                }
                if (element2.key === "LOAN_AMOUNT") {
                  this.minLoanAmount = element2.value.minValue;
                  this.maxLoanAmount = element2.value.maxValue;
                }
              });
            });
          }
          // this.getApprovalFlag();

          this.getCount();
        },
        error => {
          console.log(error);
        });

  }
  getFieldsByProductFromMaster(id: number) {
    this.prodService.getFieldsByProductFromMaster(id)
      .subscribe(
        data => {
          this.productFields = data.data;
          // console.log("==========",this.productFields);
        },
        error => {
          console.log(error);
        });

  }

  getAllFieldsFromMaster(id: number) {
    this.prodService.getFieldsFromMaster(id)
      .subscribe(
        data => {
          this.fields = data.data;
          // console.log(this.fields);
        },
        error => {
          console.log(error);
        });
  }

  checkValidation(): boolean {
    let isValidated = true;
    if (this.productFields) {
      if (this.productFields.productFieldTempMappings) {
        this.productFields.productFieldTempMappings.forEach((field: any) => {

          if (field.isConsidered) {
            this.ab = 0;
            // if (this.businessTypeId == 9 && field.controlType !== 6 && field.controlType !== 1) {
            //   if (this.commonService.isObjectNullOrEmpty(field.isCoApplicant) && this.commonService.isObjectNullOrEmpty(field.isApplicant)) {
            //     this.commonService.warningSnackBar('Applicant and Co-applicant Should not be null or empty');
            //     isValidated = false;
            //     return isValidated;
            //   }
            // }
            if (field.productSubFieldTempResponse.length > 0) {
              field.productSubFieldTempResponse.forEach(list => {

                if (list.controlType != 1 && list.controlType != 6 && list.controlType != 8 && list.controlType != 3) {
                  if (this.commonService.isObjectNullOrEmpty(list.value.maxValue)) {
                    this.commonService.warningSnackBar(' ( ' + field.fieldParameter + ')' + 'Maximum Amount Should not be null or empty');
                    isValidated = false;
                    return isValidated;
                  }
                  if (this.commonService.isObjectNullOrEmpty(list.value.minValue)) {
                    this.commonService.warningSnackBar(' ( ' + field.fieldParameter + ')' + 'Minimum Amount Should not be null or empty');
                    isValidated = false;
                    return isValidated;
                  }
                  if (field.key === 'LOAN_AMOUNT'||list.controlType == 5) {
                    if (!(this.commonService.isObjectNullOrEmpty(list.value.maxValue)) && !(this.commonService.isObjectNullOrEmpty(list.value.minValue))) {
                      if (Number(list.value.minValue) > Number(list.value.maxValue)){
                        this.commonService.warningSnackBar(' ( ' + field.fieldParameter + ')' + ' ( ' + list.value.minValue + ')' + ' Value Should be less then ' + ' ( ' + list.value.maxValue + ')');
                        isValidated = false;
                        return isValidated;
                      }
                    }
                    if (this.isScalingLoanAmntConfig == true) {
                      if (this.minLoanAmount != list.value.minValue || this.maxLoanAmount != list.value.maxValue) {
                        this.minLoanAmount = list.value.minValue;
                        this.maxLoanAmount = list.value.maxValue;
                        console.log("this.scoringObj22", this.minLoanAmount)
                        this.commonService.warningSnackBar("It seems you have edited loan amount parameter range. Kindly make necessary changes in scaling matrix loan amount range also");
                      }
                    }

                  }
                  if (!(this.commonService.isObjectNullOrEmpty(list.value.maxValue)) && !(this.commonService.isObjectNullOrEmpty(list.value.minValue))) {
                    if (list.value.maxValue > list.defaultMaxValue) {
                      this.commonService.warningSnackBar(' ( ' + field.fieldParameter + ')' + 'Value Should be less then ' + ' ( ' + list.defaultMaxValue + ')');
                      isValidated = false;
                      return isValidated;
                    }
                  }
                  if (!(this.commonService.isObjectNullOrEmpty(list.value.maxValue)) && !(this.commonService.isObjectNullOrEmpty(list.value.minValue))) {
                    if (list.value.minValue < list.defaultMinValue) {
                      this.commonService.warningSnackBar(' ( ' + field.fieldParameter + ')' + 'Value Should be greater then ' + ' ( ' + list.defaultMinValue + ')');
                      isValidated = false;
                      return isValidated;
                    }
                  }
                }
                // if (field.fieldId == 26 && list.controlType == 8 && this.businessTypeId != 9) {
                //   if (this.commonService.isObjectIsEmpty(list.value)) {
                //     this.commonService.warningSnackBar(' ( ' + field.fieldParameter + ')' + ' Value Should not be null or empty');
                //     isValidated = false;
                //     return isValidated;
                //   }
                //   if (list.value.state == undefined || list.value.state == 0) {
                //     this.commonService.warningSnackBar(' ( ' + field.fieldParameter + ')' + ' Please select state');
                //     isValidated = false;
                //     return isValidated;
                //   }

                // }
                if (list.controlType == 8) {
                  if (!(this.commonService.isObjectNullOrEmpty(list.value.maxValue)) && !(this.commonService.isObjectNullOrEmpty(list.value.minValue))) {
                    if (list.value.maxValue > list.defaultMaxValue) {
                      this.commonService.warningSnackBar(' ( ' + field.fieldParameter + ')' + 'Value Should be less then ' + ' ( ' + list.defaultMaxValue + ')');
                      isValidated = false;
                      return isValidated;
                    }
                  }
                }

                if (list.controlType == 3) {
                  list.value = field.value
                  // console.log(list.value)
                  if (this.commonService.isObjectNullOrEmpty(list.value)) {
                    this.commonService.warningSnackBar(' ( ' + field.fieldParameter + ')' + ' Value Should not be null or empty');
                    isValidated = false;
                    return isValidated;
                  }
                }

                return isValidated;
              });
            }
            if (field.controlType == 1) {
              this.selectedCheckBox = [];
              field.productSubFieldTempResponse.forEach(list => {
                if (list.value === list.subFieldsId) {
                  this.ab = this.ab + 1;
                  this.selectedCheckBox.push(this.ab);
                }

              });
              if (!(this.selectedCheckBox.length >= 1)) {
                this.commonService.warningSnackBar(' ( ' + field.fieldParameter + ')' + ' Value Should not be null or empty');
                isValidated = false;

                return isValidated;
              }

            }

            // console.log(isValidated+"======================="+field.fieldParameter)
          }
          return isValidated;
        });
        return isValidated;
      }
      return isValidated;
    }
    return isValidated;
  }

  savePreviousTabData(prevtab: number, data: any) {
    if (prevtab == 1 || prevtab == 2) {
      this.saveSubFieldsValue(data);
    } else if (prevtab == 4) {
      // this.saveScoringData();
      this.onScallingSave('saveScaling');
    } else if (prevtab == 3) {
      this.onSave('save');
    }
  }
  saveProductSubFieldValue(data: any) {
    this.submitted = true;
    if (this.tab == 1 || this.tab == 2) {
      this.saveSubFieldsValue(data);
    } else if (this.tab == 4) {
      // this.saveScoringData();
      this.onScallingSave('saveScaling');
    } else if (this.tab == 3) {
      this.onSave('save');
    }
    return;
  }
  saveSubFieldsValue(data: any): Boolean {
    if (this.checkValidation()) {
      if (data) {
        // console.log(data);
        this.prodService.saveProductSubFields(data.productFieldTempMappings)
          .subscribe(
            data => {
              this.productSubField = data.data;
              // this.getApprovalFlag();
            },
            error => {
              console.log(error);
            });
      }
      return true;
    }
    else {
      return false;
    }
  }

  onChange(event) {
    let index = this.productSubField.indexOf(event.target.value);
    if (index == -1) {
      this.productSubField.push(event.target.value);
    } else {
      this.productSubField.splice(index, 1);
    }
  }
  onSave(saveType): void {
    if (this.tab === 3) {
      // this.isEligiblitySaved=true;
      this.prodService.emitSaveEvent(saveType);     // save or save&Exit
    }
    if (saveType === 'save&Exit' && this.tab === 1 && this.tab === 2) {
      this.router.navigate([this.routeMainPath + '/Product-List']);
    }
  }
  onScallingSave(saveType): void {
    if (this.tab === 4) {
      this.prodService.emitSaveEvent(saveType);     // save or save&Exit
    }
    if (saveType === 'save&ExitScaling' && this.tab === 1 ) {
      this.router.navigate([this.routeMainPath + '/Product-List']);
    }
  }
  /**
   * Check conditions to enable Send for Approval btn
   */
  getApprovalFlag(): void {
    this.showActionButtons = false;
    this.prodService.getApprovalFlag(this.productId).subscribe(res => {

      // && this.isValidScaling(false)
      // 
      if (res && res.data && res.data.mandatoryFlag &&res.data.eligibilityFlag && res.data.scalingFlag) {
        this.showActionButtons = true;
      }
    });
  }

  /**
   * Event will come here on saving eligibility
   */
  eligibilitySavedEvent(event): void {
    // console.log(event)
    if (event === 'eligibilitySaved') {
      this.getApprovalFlag();
    }else if(event === 'eligibilityApprovel'){
      this.sendForApproval(this.actionButton);
    }else{
      this.commonService.warningSnackBar('please save data')
      this.showActionButtons=false;
    }
  }
  scalingSavedEvent(event): void {
    if (event === 'scalingSaved') {
      this.getApprovalFlag();
    }else if(event === 'scalingApprovel'){
      this.sendForApproval(this.actionButton);
    }else{
      this.commonService.warningSnackBar('please save data')
      this.showActionButtons=false;
    }
  }


  numberOnly(event): boolean {

    const charCode = (event.which) ? event.which : event.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
      return false;
    }
    return true;
  }

  checkButtonPermission(buttton: any): boolean {
    const index: number = this.userPermissionList.indexOf(buttton);
    if (index != -1)
      return true;
    else
      return false;
  }
  saveSubFieldsValueSendForApprovel(data: any, action: any): Boolean {
    if (this.checkValidation()) {
      if (data) {
        this.prodService.saveProductSubFields(data.productFieldTempMappings)
          .subscribe(
            data => {
              this.productSubField = data.data;
              if(this.tab==3){
                this.prodService.emitSaveEvent('saveEligibilityForApprovel');
              }else if(this.tab==4){
                this.prodService.emitSaveEvent('saveScalingForApprovel');
              }
              this.actionButton=action;
            },
            error => {
              console.log(error);
            });
      }else{
        if(this.tab==3){
          this.prodService.emitSaveEvent('saveEligibilityForApprovel');
          this.actionButton=action;
        }else if(this.tab==4){
          this.prodService.emitSaveEvent('saveScalingForApprovel');
          this.actionButton=action;
        }
      }
      return true;
    }
    else {
      return false;
    }
  }

}
