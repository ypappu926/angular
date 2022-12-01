import { Component, OnInit, AfterViewInit, Inject, HostListener, ViewChild, ElementRef } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { NgbModal, NgbModalConfig } from '@ng-bootstrap/ng-bootstrap';
import { CommonService } from 'src/app/CommoUtils/common-services/common.service';
import { ActivatedRoute, Router } from '@angular/router';
import * as _ from 'lodash';
import { Constants } from 'src/app/CommoUtils/constants';
import { ProductService } from 'src/app/services/product.service';
import { ComIndustrySectorPopupComponent } from 'src/app/Popup/Product-Scoring/com-industry-sector-popup/com-industry-sector-popup.component';
import { ComViewProductConfigurationComponent } from 'src/app/Popup/Product-Scoring/com-view-product-configuration/com-view-product-configuration.component';
import { GeographicalAreasPopupComponent } from 'src/app/Popup/Product-Scoring/geographical-areas-popup/geographical-areas-popup.component';
import { ProductCommonComponent } from 'src/app/Popup/Product-Scoring/product-common/product-common.component';


declare var jQuery: any;
declare var $: any;

@Component({
  selector: 'app-product-view',
  templateUrl: './product-view.component.html',
  styleUrls: ['./product-view.component.scss']
})
export class ProductViewComponent implements OnInit {

  tab: any;
  isActive = false;
  // bread crumb data
  breadCrumbItems!: Array<{}>;
  isCollapsed!: boolean;
  productId: any;
  tempProductId:any;
  productFields: any = {
    productName: String,
  };
  businessTypeId: number;
  orgId: number;
  roleId: number;
  roles: any = {};
  selectValue!: string[];
  tabPara: any;
  workflowRes: any;
  jobId: any;
  actionButtons: any;
  userRoleIds: any = [];
  byIdData: any = {};
  popUpObj: any = [];
  scoringObj: any = {};
  routeMainPath!: any;
  baseRate: any;
  userPermissionList: any = [];
  schemeId!: number;
  editConfigurationParamter: any = {};
  editConfiParam: any = {};

  industryCount!: String;

  productType;
  oldProduct;

  updatedDetails: any = {};
  constructor(@Inject(DOCUMENT) document: any,
    public NPconfig: NgbModalConfig,
    private modalService: NgbModal,
    private commonService: CommonService,
    private prodService: ProductService,
    private route: ActivatedRoute,
    private router: Router) {
    NPconfig.backdrop = 'static';
    this.roleId = Number(CommonService.getStorage(Constants.httpAndCookies.ROLEID, true));
    this.businessTypeId =1;
    this.schemeId =9;
    this.roles = this.commonService.getConstant().UserRoleList;
    this.routeMainPath = 'TIIC';
    this.userPermissionList = _.split(CommonService.getStorage('UserPermission', true), ',');
  }


  ngOnInit(): void {
    this.breadCrumbItems = [{ label: 'Dashboard', path: this.routeMainPath + '/dashboard' }, { label: 'Product', path: this.routeMainPath + '/Product-List' }, { label: 'View Product', path: '/', active: true }];

    this.selectValue = ['Alaska', 'Hawaii', 'California', 'Nevada', 'Oregon', 'Washington', 'Arizona', 'Colorado', 'Idaho', 'Montana', 'Nebraska', 'New Mexico', 'North Dakota', 'Utah', 'Wyoming', 'Alabama', 'Arkansas', 'Illinois', 'Iowa'];
    this.userRoleIds.push(CommonService.getStorage(Constants.httpAndCookies.ROLEID, true));
    // tabs
    this.tab = 1;
    this.changeTab(1);
    this.route.queryParams.subscribe(params => {
      this.productId = CommonService.decryptFunction(params['id']);
      this.tabPara = CommonService.decryptFunction(params['tab']);
      this.oldProduct = CommonService.decryptFunction(params['old']);
    });
    this.getData();
  }
exit(){
  this.router.navigate([this.routeMainPath + '/Product-List']);
       
}
  getData() {
    console.log(this.tabPara);
    if((this.oldProduct === 'true'||this.oldProduct === true)||this.tabPara==='1') {
      this.getProductDetailByIdFromMaster(this.productId);
      this.getMasterViewData(this.productId);
      this.getScallingMasterData();
    } else {
      this.getProductDetailById(this.productId, this.businessTypeId, this.schemeId);
      this.getViewData(this.productId);
      this.getScallingData();
    }

    // }
   
  }

  getScallingMasterData() {
    let request = { productId: this.productId };
    this.prodService.getScalingMatrixMaster(request).subscribe(res => {
      if (this.commonService.isObjectNullOrEmpty(res) || this.commonService.isObjectNullOrEmpty(res.data)) {
        this.commonService.errorSnackBar('Something went wrong.');
        return;
      }
      this.scoringObj = res.data;
      this.scoringObj.grossMonth = {};
      this.scoringObj.grossMonth.isCollapsed = false;
      this.scoringObj.netMonthGrad = {};
      this.scoringObj.netMonthGrad.isCollapsed = false;
      this.scoringObj.riskGrad = {};
      this.scoringObj.riskGrad.isCollapsed = false;
      this.scoringObj.loanAmountGrad = {};
      this.scoringObj.loanAmountGrad.isCollapsed = false;
      this.scoringObj.bureauRange = {};
      this.scoringObj.bureauRange.isCollapsed = false;
      this.scoringObj.typeOfBorrower = {};
      this.scoringObj.typeOfBorrower.isCollapsed = false;
      
      this.getBaseRate();
    }, error => {
      this.commonService.errorSnackBar(error);
    });
  }
  getBaseRate() {
    let request = { businessTypeId: this.businessTypeId, status: 3, baseRateTypeId: this.scoringObj.baseRateType, schemeId: this.schemeId };
    this.prodService.getBaseRate(request).subscribe(success => {
      if (this.commonService.isObjectNullOrEmpty(success) || this.commonService.isObjectNullOrEmpty(success.data)) {
        // this.commonService.warningSnackBar('Please create or approved REPO/MCLR.');
        return;
      }
      this.baseRate = success.data;
    }, error => {
      this.commonService.errorSnackBar(error);
    });
  }

  getScallingData() {
    let request = { productId: this.productId };
    // if (!(this.tabPara == 5)) {
    //   this.prodService.getScalingMatrixMaster(request).subscribe(res => {
    //     if (this.commonService.isObjectNullOrEmpty(res) || this.commonService.isObjectNullOrEmpty(res.data)) {
    //       this.commonService.errorSnackBar('Something went wrong.');
    //       return;
    //     }
    //     this.scoringObj = res.data;
    //    
    this.prodService.getScalingMatrix(request).subscribe(res => {
      if (this.commonService.isObjectNullOrEmpty(res) || this.commonService.isObjectNullOrEmpty(res.data)) {
        this.commonService.errorSnackBar('Something went wrong.');
        return;
      }
      this.scoringObj = res.data;
      this.scoringObj.grossMonth = {};
      this.scoringObj.grossMonth.isCollapsed = false;
      this.scoringObj.netMonthGrad = {};
      this.scoringObj.netMonthGrad.isCollapsed = false;
      this.scoringObj.riskGrad = {};
      this.scoringObj.riskGrad.isCollapsed = false;
      this.scoringObj.loanAmountGrad = {};
      this.scoringObj.loanAmountGrad.isCollapsed = false;
      this.scoringObj.bureauRange = {};
      this.scoringObj.bureauRange.isCollapsed = false;
      this.scoringObj.typeOfBorrower = {};
      this.scoringObj.typeOfBorrower.isCollapsed = false;
      
      
      this.getBaseRate();
    }, error => {
      this.commonService.errorSnackBar(error);
    });
    // }
  }
  // Scroll table For Nikul Don't Remove  05-Feb-2021 Start
  @ViewChild('tabScrollNP', { read: ElementRef }) public tabScrollNP!: ElementRef<any>;

  public TabscrollRight(): void {
    this.tabScrollNP.nativeElement.scrollTo({ left: (this.tabScrollNP.nativeElement.scrollLeft + 180), behavior: 'smooth' });
  }

  public TabscrollLeft(): void {
    this.tabScrollNP.nativeElement.scrollTo({ left: (this.tabScrollNP.nativeElement.scrollLeft - 180), behavior: 'smooth' });
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
    // console.log(parentwidth);
  }
  //  This js On Window Scroll Top set Cont Dont Remove @Nikul

  changeTab(tabId: number) {
    this.tab = tabId;
    // console.log(this.tab);
  }

  Com_Reject_sp(action: any) {
    const config = {
      windowClass: 'popup-650',
    };
    this.popUpObj.name = this.byIdData.productName;
    this.popUpObj.type = 5;
    this.commonService.openPopUp(this.popUpObj, ProductCommonComponent, false, config).result.then(result => {
      if (result === 'Ok') {
        this.sendForApproval(action);
      }
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
  Com_Approve_sp(action: any) {
    const config = {
      windowClass: 'popup-650',
    };
    this.popUpObj.name = this.byIdData.productName;
    this.popUpObj.type = 5;
    this.commonService.openPopUp(this.popUpObj, ProductCommonComponent, false, config).result.then(result => {
      if (result === 'Ok') {
        this.sendForApproval(action);
      }
    });
  }
  Com_Send_Bank_To_Maker_sp(action: any) {
    const config = {
      windowClass: 'popup-650',
    };
    this.popUpObj.name = this.byIdData.productName;
    this.popUpObj.type = 6;
    this.commonService.openPopUp(this.popUpObj, ProductCommonComponent, false, config).result.then(result => {
      if (this.commonService.isObjectNullOrEmpty(result) || !(this.commonService.isObjectNullOrEmpty(result))) {
        action.remarks = result;
        // console.log(action.remark)
        if (result !== 'Cancel') {
          this.sendForApproval(action);
        }
      }
    });
  }
  commonPopUP(action: any) {
    if (action.action.id == 11) {
      this.Com_Approve_sp(action);
    }
    if (action.action.id == 12) {
      this.Com_Send_Bank_To_Maker_sp(action);
    }
    if (action.action.id == 13) {
      this.Com_Reject_sp(action);
    }
  }

  sendForApproval(action: any) {
    action.jobId = this.jobId;
    action.currentStep = action.workflowStep;
    action.toStep = action.nextworkflowStep;
    action.actionId = action.action.id;
    this.byIdData.workflowRequest = action;
    this.byIdData.productTypeTempResponses=[];
    // console.log(this.byIdData);

    this.prodService.sendForApproval(this.byIdData).subscribe(res => {
      if (!this.commonService.isObjectNullOrEmpty(res)) {
        this.commonService.successSnackBar('Successfully');

        if (action.currentStep == 8 && action.actionId == 11 && this.byIdData.productStatusId != 3) {// Active or Deactive product
          if (this.byIdData.productStatusId == 7) {
            this.inActiveProduct(this.byIdData, Number(1));
          }
          if (this.byIdData.productStatusId == 6) {
            this.inActiveProduct(this.byIdData, Number(2));
          }
        }
        this.router.navigate([this.routeMainPath + '/Product-List'])
        return;
      }
      // workflowRequest.getCurrentStep() == 79 && workflowRequest.getActionId() == 54 // save after edit action
      // if (action.currentStep == 78 && action.actionId == 53) {
      //   this.prodService.getTempProductId(this.productId).subscribe(res => {
      //     if (res && res.data) {
      //       this.productId = res.data;
      //       this.getData();
      //     }
      //   })
      // }


      // if (action.currentStep == 79 && action.actionId == 54) {
      //   this.router.navigate([this.routeMainPath + '/Product-Edit'], { queryParams: { id:CommonService.encryptFunction(this.productId.toString()) } })
      // }
      this.getWorkflowRes();
    }, error => {
      this.commonService.errorSnackBar(error);
    })
  }
  getWorkflowRes() {
    if (this.commonService.isObjectNullOrEmpty(this.jobId)) {
      return;
    }
    let request = { roleIds: this.userRoleIds, jobId: this.jobId, workflowId: 4 };
    this.prodService.getActiveSteps(request).subscribe(res => {
      if (this.commonService.isObjectNullOrEmpty(res)) {
        this.commonService.errorSnackBar('Something went wrong.');
        return;
      }
      if (!this.commonService.isObjectNullOrEmpty(res.data)) {
        this.actionButtons = res.data.step.stepActions;
        for (let i = 0; i < this.actionButtons.length; i++) {
          // console.log("this.actionButtons[i].buttonText ", this.actionButtons[i].action.buttonText);
        }
        // console.log('this.actionButtons :: ', this.actionButtons);
      }
    }, error => {
      this.commonService.errorSnackBar(error);
    });
  }


  getViewData(id: number) {
    this.prodService.getViewData(id)
      .subscribe(
        data => {
          this.productFields = data.data;
          this.jobId = this.productFields.jobId;
          //  console.log(" this.productFields ", this.productFields );
          this.getWorkflowRes();
        },
        error => {
          console.log(error);
        });
  }
  getMasterViewData(id: number) {
    this.prodService.getMasterViewData(id)
      .subscribe(
        data => {
          this.productFields = data.data;
          // console.log(this.productFields);
          if (this.oldProduct !== 'true'&&this.oldProduct !== true) {
            this.getWorkflowRes();
          }
          this.prodService.checkProductEditable(this.productId).subscribe(response => {
            if (response&&response.status === 200 ){
            if(response.data!=null&&!response.data) {
              this.productFields.producStatusId=3;
            }
          }
        });
        },
        error => {
          console.log(error);
        });
  }

  getProductDetailById(id: number, businessTypeId: number, schemeId: number) {
    this.prodService.getProductById(id, businessTypeId, schemeId)
      .subscribe(
        data => {
          this.byIdData = data.data;
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
          // console.log(this.editConfigurationParamter);

        },
        error => {
          console.log(error);
        });
  }

  getProductDetailByIdFromMaster(id: number) {

    this.prodService.getProductByIdFromMaster(id, this.tabPara)
      .subscribe(
        data => {
          this.byIdData = data.data;
          // this.jobId = this.byIdData.jobId;
          console.log(this.byIdData);
          if (!this.commonService.isObjectIsEmpty(this.byIdData.productTypeTempResponses)) {
            this.byIdData.productTypeTempResponses.forEach(element => {
              if (element.masterType === 'TYPE_OF_PRODUCT') {
                this.productType = element.masterId;
              }
            });
          }
          this.byIdData.productTypeTempResponses.forEach(element => {
            element.masterType =_.capitalize(element.masterType)
            element.masterType =_.startCase(element.masterType)
          });
          console.log(this.byIdData.productTypeTempResponses);
          this.editConfigurationParamter = _.groupBy(this.byIdData.productTypeTempResponses, 'masterType');
          // console.log(this.editConfigurationParamter);

        },
        error => {
          console.log(error);
        });
  }
  Active_Deactive_Popup(action: any, product: any, type: any) {
    const config = {
      windowClass: 'popup-650',
    };
    this.popUpObj.title = type == 1 ? 'Deactivation' : 'Activation';
    this.popUpObj.name = this.byIdData.productName;
    this.popUpObj.type = 8;
    this.commonService.openPopUp(this.popUpObj, ProductCommonComponent, false, config).result.then(result => {
      if (result === 'Ok') {
        this.getScoringUpdatedDetails(action);
      }
    });
  }

  getScoringUpdatedDetails(action:any) {
    if (this.scoringObj.isNoScoring !== null && !this.scoringObj.isNoScoring) {
      this.prodService.getUpdatedScoringDetails(this.scoringObj.scoringModelId).subscribe(response => {
        if (!this.commonService.isObjectIsEmpty(response)) {
          if (!this.commonService.isObjectIsEmpty(response.dataObject)) {
            if(response.dataObject.isActive===false){
              this.commonService.warningSnackBar("Please active the depandend scoring model first")
              return;
            }else{
              this.sendForApproval(action);
            }
          }
        }
      });
    }

  }
  Edit_Product_Parameter_Popup() {
    const config = {
      windowClass: 'popup-650',
    };
    this.popUpObj.productId = this.productId;
    this.popUpObj.type = 7;
    this.commonService.openPopUp(this.popUpObj, ProductCommonComponent, false, config).result.then(result => {
      if (result === 'Ok') {
        if(this.tabPara ==='1'){
          this.prodService.getTempProductId(this.productId).subscribe(res => {
            if (res && res.data) {
              this.tempProductId = res.data;
              // console.log(this.tempProductId);
              this.router.navigate([this.routeMainPath + '/Product-Edit'], { queryParams: { id:  CommonService.encryptFunction(res.data.toString()), tab: CommonService.encryptFunction(this.tabPara.toString()),isFromView:CommonService.encryptFunction(false)}});
           } });
        }else{
          this.router.navigate([this.routeMainPath + '/Product-Edit'], { queryParams: { id: CommonService.encryptFunction(this.productId.toString()), tab: CommonService.encryptFunction(this.tabPara.toString()) } })
        }
       
      }
    });
  }
  inActiveProduct(product: any, type: any) {
    // console.log(product)
    if (this.tabPara == 2) {
      this.prodService.removeProduct(product.id).subscribe(success => {
        if (success.status === 200) {
          this.router.navigate([this.routeMainPath + '/Product-List']);
        }
      });
    } else {
      let data: any = {};
      data.name = product.productName;
      data.title = type == 1 ? 'Deactivation' : 'Activation';
      this.prodService.inActiveProduct(product.productMasterId, type).subscribe(success => {
        if (success.status === 200) {
          this.router.navigate([this.routeMainPath + '/Product-List']);
        }
      });

    }
  }

  getTxtById(id) {
    if (id == 1) {
      return 'Risk Score'
    } else if (id == 2) {
      return 'Cibil Score'
    } else if (id == 3) {
      return 'Gross Annual Income'
    } else if (id == 4) {
      return 'Net Annual Income'
    } else if (id == 5) {
      return 'Loan Amount'
    }else if (id == 7) {
      return 'Bureau'
    }else if (id == 8) {
      return 'Type Of Borrower'
    }
    return '-';
  }

  Select_Geo_Graphical_Popup(field: any, viewTab: Boolean) {
    const config = {
      windowClass: 'Mediam-model',
      size: 'lg'
    };
    // console.log(this.productId);
    // console.log(field);
    this.popUpObj.viewTab = viewTab;
    this.popUpObj.productFields = field;
    this.popUpObj.productId = this.productId;
    this.commonService.openPopUp(this.popUpObj, GeographicalAreasPopupComponent, false, config).result.then(result => {
      if (result === 'Ok') {

      }
    });
  }
  Select_Industry_Sector_Popup(field: any, viewTab: Boolean) {
    const config = {
      windowClass: 'Mediam-model',
      size: 'xl'
    };
    // console.log(this.productId);
    // console.log(field);
    this.popUpObj.viewTab = viewTab;
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


  checkButtonPermission(buttton: any): boolean {
    const index: number = this.userPermissionList.indexOf(buttton);
    if (index != -1)
      return true;
    else
      return false;
  }
}
