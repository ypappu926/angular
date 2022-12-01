import { Component, HostListener, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal, NgbModalConfig } from '@ng-bootstrap/ng-bootstrap';
import * as _ from 'lodash';
import { Options } from 'ng5-slider';
import { CommonService } from 'src/app/CommoUtils/common-services/common.service';
import { Constants } from 'src/app/CommoUtils/constants';
import { ComViewScoringConfigurationComponent } from 'src/app/Popup/Product-Scoring/com-view-scoring-configuration/com-view-scoring-configuration.component';
import { ConfimScoringConfigurationComponent } from 'src/app/Popup/Product-Scoring/confim-scoring-configuration/confim-scoring-configuration.component';
import { ProductScoringViewComponent } from 'src/app/Popup/Product-Scoring/product-scoring-view/product-scoring-view.component';
import { ScoringCommonComponent } from 'src/app/Popup/Product-Scoring/scoring-common/scoring-common.component';
import { ScoringService } from 'src/app/services/scoring.service';

declare var jQuery: any;
declare var $: any;
@Component({
  selector: 'app-scoring-view',
  templateUrl: './scoring-view.component.html',
  styleUrls: ['./scoring-view.component.scss']
})
export class ScoringViewComponent implements OnInit {

  // bread crumb data
  breadCrumbItems!: Array<{}>;

  isFinancialRiskCollapsed: boolean = false;
  isPersonalRiskCollapsed: boolean = false;

  isCollapsed: boolean = false;
  isCollapsed1!: boolean;
  isCollapsed2!: boolean;

  tab: number;
  request!: Request;
  isActive = false;
  routeMainPath: any;
  scoringId: any;
  type: any;
  scoringModelData: any = {};
  riskParameterIds: any = [{ id: 1, value: "Risky" }, { id: 2, value: "Moderate" }, { id: 3, value: "Safe" }];
  amberCategoryIds: any = [{ id: 1, value: "Risky" }, { id: 2, value: "Moderate" }, { id: 3, value: "Safe" }];
  selectValue: string[] = [];
  symbolForScal: string
  productList: any = [];
  value: number = 60;
  highValue: number = 100;
  options: Options = {
    floor: 0,
    ceil: 100,
  };

  totalParameters: number = 0;
  typeOfFacility = { "TL": "Term Loan", "WC": "Working Capital" };
  public roleId: number;
  businessTypeId: number =1;
  public roles: any = {};

  salariedInfo: string;
  userPermissionList: any = [];

  schemeId: number=9;
  isCheker = false;
  isTabAvailable = false;

  popUpObj: any = [];  
  scoringObj: any = {};
  resEnum: any = [];
  responseEnum: any = [];

  isConfig = false;
  editMode: boolean;
  data: any = {
    userOrgId: 0,
    userId: 0,
    id: 0,
    businessTypeId: 0,
    loanTypeId: 0,
    productAvailFor: 0,
    productName: null,
    scoringTypeTempResponses: []

  };
  idList = [];
  editConfigurationParamter: any = {};
  totalParameter=0;
  tabId:any;
  constructor(
    public NPconfig: NgbModalConfig,
    private modalService: NgbModal,
    private autoRenewal: ScoringService,
    private commonService: CommonService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    NPconfig.backdrop = 'static';
    this.scoringId = Number(CommonService.decryptFunction(this.route.snapshot.paramMap.get('scoringId')));
    this.type = Number(CommonService.decryptFunction(this.route.snapshot.paramMap.get('type')));
    this.tabId = Number(CommonService.decryptFunction(this.route.snapshot.paramMap.get('tab')));
    this.roleId = Number(CommonService.getStorage(Constants.httpAndCookies.ROLEID, true));
    // this.businessTypeId = Number(CommonService.getStorage(Constants.httpAndCookies.BUSINESS_TYPE_ID, true));
    this.roleId = Number(CommonService.getStorage(Constants.httpAndCookies.ROLEID, true));
    // this.schemeId = Number(CommonService.getStorage(Constants.httpAndCookies.SCHEME_ID, true));
    this.roles = this.commonService.getConstant().UserRoleList;
    this.routeMainPath = CommonService.getCurrentPath();
    this.salariedInfo = '';
    this.symbolForScal = '';
    this.tab = 0;
    this.userPermissionList = _.split(CommonService.getStorage('UserPermission', true), ',');
  }

  ngOnInit(): void {
    this.breadCrumbItems = [{ label: 'Dashboard', path: this.routeMainPath + '/dashboard' }, { label: 'Scoring Model', path: this.routeMainPath + '/Scoring-List' }, { label: 'Scoring View', path: '/', active: true }];
    // this.breadCrumbItems = [{ label: 'Dashboard', path: '/' }, { label: 'Scoring Model', path: '/' }, { label: 'Scoring View', path: '/', active: true }];
    this.selectValue = ['Alaska', 'Hawaii', 'California', 'Nevada', 'Oregon', 'Washington', 'Arizona', 'Colorado', 'Idaho', 'Montana', 'Nebraska', 'New Mexico', 'North Dakota', 'Utah', 'Wyoming', 'Alabama', 'Arkansas', 'Illinois', 'Iowa'];

    // Collapse value
    this.isCollapsed = false;
    this.isCollapsed1 = false;
    this.isCollapsed2 = false;

    /**
 * fetches data
 */

    //  if(this.businessTypeId === Constants.businessType.HOME_LOAN || this.businessTypeId === Constants.businessType.EDUCATION_LOAN){
      this.isTabAvailable = true;
      this.tab = 1;
      // this.changeTab(1);
    // }else{
    //   this.tab = 0;
    // }
    this.getScoringModel(this.tab);
    if(this.roleId === Constants.UserRoleList.ADMIN_CHECKER.id){
      this.isCheker = true;
    }
  }

  checkButtonPermission(buttton: any): boolean {
    const index: number = this.userPermissionList.indexOf(buttton);
    if (index != -1)
      return true;
    else
      return false;
  }

  changeTab(tabId: number) {
    this.tab = tabId;
    if(tabId == 1){
      this.getScoringModel(this.tab);
    // }else if (tabId == 2){
    //   this.getScoringModel(this.tab);
    }
  }


  getScoringModel(tabType?: any) {
    // console.log(this.scoringId);
    // console.log(this.type);
    this.totalParameter=0;
    let scoringId = this.scoringId;
    this.autoRenewal.getScoringModel(scoringId, this.type,tabType).subscribe(
      success => {
        if (success.status === 200) {
          this.scoringModelData = success.dataObject;
          // console.log("this.scoringModelData :: ",this.scoringModelData);
          this.scoringModelData.total = (this.scoringModelData.total === undefined) ? this.highValue : this.scoringModelData.total;

          if (this.scoringModelData.titleList.length < 1) {
            // this.scoreFieldAdd(this.scoringId).then(result => {
            //   if (result === 'Ok') {
            //     this.getScoringModel();
            //   }
            // });
          } else {
            this.scoringModelData.titleList.forEach(element => {// For Title list get
              if (!this.commonService.isObjectNullOrEmpty(element.fieldsList)) { // For Field List add range or LOVs
                element.fieldsList.forEach((element1: any) => {
                  element1.isCollapsed1 = false;
                  element1.isConsider = this.commonService.isObjectNullOrEmpty(element1.isConsider) ? false : element1.isConsider;
                  element1.maxScore = this.commonService.isObjectNullOrEmpty(element1.maxScore) ? 0 : element1.maxScore;
                  if (element1.type === 1) { // Type 1 is For min max range
                    element1.range = this.commonService.isObjectNullOrEmpty(element1.range) ? element1.minRangeNumber : element1.range.toString();
                    if (element1.field === 'BUREAU_SCORE') {
                      if (element1.modelParameterList.length == 0) {
                        // if (this.schemeId === Constants.SchemeMaster.PRADHAN_MANTRI_MUDRA_YOJNA.id) {
                        //   element1.modelParameterList.push({ minRange: -1, maxRange: -1, score: 0, isDisabled: true })
                        //   element1.modelParameterList.push({ minRange: 1, maxRange: 1, score: 0, isDisabled: true })
                        //   element1.modelParameterList.push({ minRange: 2, maxRange: 2, score: 0, isDisabled: true })
                        //   element1.modelParameterList.push({ minRange: 3, maxRange: 3, score: 0, isDisabled: true })
                        //   element1.modelParameterList.push({ minRange: 4, maxRange: 4, score: 0, isDisabled: true })
                        //   element1.modelParameterList.push({ minRange: 5, maxRange: 5, score: 0, isDisabled: true })
                        //   element1.modelParameterList.push({ minRange: element1.min, maxRange: null, score: 0 })
                        //   element1.modelParameterList.push({ minRange: null, maxRange: element1.max, score: 0 })
                        //   element1.range = 8
                        // } else {
                        //   element1.modelParameterList.push({ minRange: -1, maxRange: -1, score: 0, isDisabled: true })
                        //   element1.modelParameterList.push({ minRange: 0, maxRange: 0, score: 0, isDisabled: true })
                        //   element1.modelParameterList.push({ minRange: 1, maxRange: 1, score: 0, isDisabled: true })
                        //   element1.modelParameterList.push({ minRange: element1.min, maxRange: null, score: 0 })
                        //   element1.modelParameterList.push({ minRange: null, maxRange: element1.max, score: 0 })
                        //   element1.range = 5
                        // }

                      } else {
                        this.addScoreParameterList(element1);
                      }
                    } else {
                      this.addScoreParameterList(element1);
                    }
                  }
                  if(element1.isConsider){
                    this.totalParameter++;
                  }

                  if (element1.type === 2) { // For LOVs 
                    if (element1.modelParameterList.length <= 0) {
                      element1.modelParameterList = JSON.parse(element1.list);
                    }
                  }
                  if (element1.type === 3) {// For min max and LOV Redio
                    if (element1.modelParameterList.length <= 0) {
                      element1.lovList = JSON.parse(element1.list);
                      element1.range = this.commonService.isObjectNullOrEmpty(element1.range) ? element1.minRangeNumber : element1.range.toString();
                      this.addScoreParameterList(element1);
                    } else {
                      element1.lovList = JSON.parse(element1.list);
                    }
                  }
                  if (element1.type === 4) {// For min max and LOV List
                    if (element1.modelParameterList.length <= 0) {
                      element1.lovList = JSON.parse(element1.list);
                      element1.lovList[0].score = 0;
                      element1.lovList[0].minRange = 0;
                      element1.lovList[0].maxRange = 0;
                      element1.range = this.commonService.isObjectNullOrEmpty(element1.range) ? element1.minRangeNumber : element1.range.toString();
                      this.addScoreParameterList(element1);
                    } else {
                      element1.lovList = element1.lovList;
                    }
                  }
                });
                // element.fieldsList[0].isCollapsed1 = false;
              }
            });
          }
          // Get For Product by score id
          this.getProductBySocreId();
          this.getScoringData()
        }
      }, function (error) {
        if (error.status == 401) {
          // this.commonMethod.logoutUser();
        }
      }
    );
  }

  getStatus(status) {
    return Constants.ScoringStatus.find(res => res.id === status).name;
  }

  addScoreParameterList(field: any, type?: any) {
    // console.log(field);
    const lastlength = field.modelParameterList.length - 1;
    if (lastlength == field.maxRangeNumber) {
      return;
    }
    if (type == 1) {
      field.range = Number(field.range) + 1;
    }
    if (field.modelParameterList.length < Number(field.range)) {
      field.modelParameterList.push({ 'score': 0 });
      if (lastlength !== -1) {
        field.modelParameterList[lastlength].maxRange = null;
      }
      this.addScoreParameterList(field);
    }
    if (field.range < field.modelParameterList.length) {
      field.modelParameterList.splice(field.modelParameterList.indexOf(field.modelParameterList.length), 1);
      this.addScoreParameterList(field);
    }

    if (field.modelParameterList.length === Number(field.range)) {
      if (field.field !== ('BUREAU_SCORE')) {
        field.modelParameterList[0].minRange = field.min;
      }
      field.modelParameterList[field.modelParameterList.length - 1].maxRange = field.max;
    }
  }
  checkSalaried(data: any) {
    if (data.isSalaried && data.isNonSalaried) {
      this.salariedInfo = 'Salaried & Non-Salaried'
    } else if (data.isSalaried) {
      this.salariedInfo = 'Salaried'
    } else if (data.isNonSalaried) {
      this.salariedInfo = 'Non-Salaried'
    }
  }


  //  This js On Window Scroll Top set Cont Dont Remove @Nikul
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
  exitScoringModel() {
    this.router.navigate([this.routeMainPath + '/Scoring-List']);
  }
  Confirm_scoring_Confiration_Popup(typeId?) {
    const config = {
      windowClass: 'Mediam-model',
    };
    const modalRef = this.modalService.open(ConfimScoringConfigurationComponent, config);
    modalRef.componentInstance.user = this.scoringModelData;
    if (typeId != undefined) {
      modalRef.componentInstance.typeId = typeId;
    }
    modalRef.componentInstance.currentObj = this;
    return modalRef
  }

  adjustWidth() {
    var parentwidth = $(".parent").width();
    $(".fix-to-top").width(parentwidth);
  }
 
  

  Com_Approve_sp() {
    let data: any = {};
    data.name = this.scoringModelData.scoreModelName;
    data.id = this.scoringId;
    data.type = 5;
    this.commonPopUp(data).then(result => {
      if (result === 'Ok') {
        this.autoRenewal.approveScoringModel(data, 1).subscribe(success => {
          if (success.status === 200) {
            this.router.navigate([this.routeMainPath + '/Scoring-List']);
          }
        });
      }
    });
  }

  Com_Approve_InActive() {
    let data: any = {};
    data.name = this.scoringModelData.scoreModelName;
    data.id = this.scoringId;
    data.type = 11;
    this.commonPopUp(data).then(result => {
      if (result === 'Ok') {
        this.autoRenewal.inActiveScoringModel(this.scoringId, 1).subscribe(success => {
          if (success.status === 200) {
            this.router.navigate([this.routeMainPath + '/Scoring-List']);
          }
        });
      }
    });
  }

  ApproveActiveFromMaker(){
    let data: any = {};
    data.name = this.scoringModelData.scoreModelName;
    data.id = this.scoringId;
    data.type = 13;
    this.commonPopUp(data).then(result => {
      if (result === 'Ok') {
        this.autoRenewal.sendActivateScoringModelForChecker(this.scoringId, 1).subscribe(success => {
          if (success.status === 200) {
            this.router.navigate([this.routeMainPath + '/Scoring-List']);
          }
        });
      }
    });
  }

  ApproveInActiveFromMaker(){
    let data: any = {};
    data.name = this.scoringModelData.scoreModelName;
    data.id = this.scoringId;
    data.type = 14;
    this.commonPopUp(data).then(result => {
      if (result === 'Ok') {
        this.autoRenewal.sendActivateScoringModelForChecker(this.scoringId, 3).subscribe(success => {
          if (success.status === 200) {
            this.router.navigate([this.routeMainPath + '/Scoring-List']);
          }
        });
      }
    });
  }

  Com_Approve_Active() {
    let data: any = {};
    data.name = this.scoringModelData.scoreModelName;
    data.id = this.scoringId;
    data.type = 12;
    this.commonPopUp(data).then(result => {
      if (result === 'Ok') {
        this.autoRenewal.sendInActiveScoringModelForChecker(this.scoringId, 2).subscribe(success => {
          if (success.status === 200) {
            this.router.navigate([this.routeMainPath + '/Scoring-List']);
          }
        });
      }
    });
  }

  sendActiveForChecker(scoringModel: any, type: any) {
    let data: any = {};
      data.type = 8;
      data.name = scoringModel.scoreModelName;
      data.title = type == 1 ? 'Deactivation' : 'Activation';
      this.commonPopUp(data).then(result => {
        if (result === 'Ok') {
          this.autoRenewal.sendActivateScoringModelForChecker(scoringModel.id, type).subscribe(success => {
            if (success.status === 200) {
              this.router.navigate([this.routeMainPath + '/Scoring-List']);
            }
          });
        };
      });
  }

  Com_Send_Bank_To_Maker_sp() {
    let data: any = {};
    data.id = this.scoringId;
    data.name = this.scoringModelData.scoreModelName;
    data.type = 6;
    this.commonPopUp(data).then(result => {
      if (result === 'Ok') {
        this.router.navigate([this.routeMainPath + '/Scoring-List']);
      }
    });
  }
  // PRODUCT_BY_SCORE_ID: productUrl+'/getProductByScoringId/',
  commonPopUp(data: any) {
    const config = {
      windowClass: 'popup-650',
    };
    const modalRef = this.modalService.open(ScoringCommonComponent, config);
    modalRef.componentInstance.popUpObj = data;
    return modalRef.result;
  }

  inActiveScoring(scoringModel: any, type: any) {
    this.getProductBySocreId();
    // console.log(this.productList);
    if (this.productList !== null) {
      let data: any = {};
      data.type = 10;
      data.name = scoringModel.scoreModelName;
      data.title = type == 1 ? 'Deactivation' : 'Activation';
      this.commonPopUp(data).then(result => {
        // console.log(result);
      });
    } else {
      let data: any = {};
      data.type = 8;
      data.name = scoringModel.scoreModelName;
      data.title = type == 1 ? 'Deactivation' : 'Activation';
      this.commonPopUp(data).then(result => {
        if (result === 'Ok') {
          this.autoRenewal.sendInActiveScoringModelForChecker(scoringModel.id, type).subscribe(success => {
            if (success.status === 200) {
              this.router.navigate([this.routeMainPath + '/Scoring-List']);
            }
          });
          // this.autoRenewal.inActiveScoringModel(scoringModel.id, type).subscribe(success => {
          //   if (success.status === 200) {
          //     this.router.navigate([this.routeMainPath + '/Scoring-List']);
          //   }
          // });
        };
      });
    }
  }
  openExistingProduct() {
    const config: any = {
      windowClass: 'Common-PS-Para',
      size: 'lg',
      keyboard: false,
      ignoreBackdropClick: true
    };
    config['backdrop'] = 'static';
    const data = this.productList;
    this.commonService.openPopUp(data, ProductScoringViewComponent, false, config).result.then(result => {
      if (result === 'Ok') {
      }
    });

  }

  getProductBySocreId() {
    let scoringId = this.scoringId;
    if (!this.commonService.isObjectNullOrEmpty(this.scoringModelData.scoringModelId)) {
      scoringId = this.scoringModelData.scoringModelId
    }
    if (!this.commonService.isObjectNullOrEmpty(scoringId)) {
      this.autoRenewal.getProductSByscoringId(scoringId).subscribe((success: any) => {
        // console.log(success);
        if (success.status === 200) {
          this.productList = success.data;
        }
      }, function (error: any) {
        this.commonService.errorSnackBar(error);
      });
    }
  }

  getScoringData() {
    
    this.autoRenewal.getScoringData(this.scoringId,this.type).subscribe(success => {
      if (success.status === 200) {
        this.scoringObj = success.dataObject;
        this.scoringObj.remarks = 'editTime';
        this.editMode = true;
        this.data.scoringTypeTempResponses = this.scoringObj.configList;
        if (!this.commonService.isObjectNullOrEmpty(this.scoringObj.configList)) {
          this.scoringObj.configList.forEach(element => {
            this.idList.push(element.masterId);
          });

        }
        
        this.getScoringConfignPara(this.businessTypeId, this.schemeId);
      }
    }, function (error) {
      if (error.status == 401) {
        // this.commonMethod.logoutUser();
      }
    });
  }

  getScoringConfignPara(businessTypeId: number, schemeId: number) {
    this.autoRenewal.getScoringConfignPara(businessTypeId, schemeId).subscribe(response => {
      if (response.status === 200) {
        this.resEnum = response.dataObject;
        if (this.resEnum.length > 0) {
          this.isConfig = true;
          this.resEnum.forEach(element => {
            element.list = JSON.parse(element.list);
            if (!this.commonService.isObjectNullOrEmpty(this.scoringObj.configList)) {
              element.list.forEach(field => {
                const elements = this.scoringObj.configList.filter(res => res.masterType === element.enumName && res.masterId === field.id);
                if (elements.length > 0) {
                  field.checked = true;
                } else {
                  field.checked = false;
                }
              });
            }
          });
          this.responseEnum = this.resEnum;
          this.resEnum = _.orderBy(this.resEnum, ['sequence'], ['asc'])
          
          this.resEnum.forEach(element => {
            element.enumName =_.capitalize(element?.enumName)
            element.enumName =_.startCase(element?.enumName)
          });
          // this.editConfigurationParamter = _.groupBy(this.resEnum, 'enumName');
          this.editConfigurationParamter=_.cloneDeep( this.resEnum);

        }
      }
    });
  }
  NP_View_Scoring_Confirmation_Popup(): void {
    const config = {
      //windowClass: 'popup-650',
      size: 'lg'
    };
    this.popUpObj.editConfigurationParamter = this.editConfigurationParamter;
    this.commonService.openPopUp(this.popUpObj, ComViewScoringConfigurationComponent, false, config).result.then(result => {

    });
  }
}
