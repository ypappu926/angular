import { Component, HostListener, OnInit, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal, NgbModalConfig } from '@ng-bootstrap/ng-bootstrap';
import * as _ from 'lodash';
import { constant, forEach } from 'lodash';
import { Options } from 'ng5-slider';
import { CommonService } from 'src/app/CommoUtils/common-services/common.service';
import { Constants } from 'src/app/CommoUtils/constants';
import { ComViewScoringConfigurationComponent } from 'src/app/Popup/Product-Scoring/com-view-scoring-configuration/com-view-scoring-configuration.component';
import { ConfimScoringConfigurationComponent } from 'src/app/Popup/Product-Scoring/confim-scoring-configuration/confim-scoring-configuration.component';
import { ProductScoringViewComponent } from 'src/app/Popup/Product-Scoring/product-scoring-view/product-scoring-view.component';
import { ScoringCommonComponent } from 'src/app/Popup/Product-Scoring/scoring-common/scoring-common.component';
import { ScoringParametersComponent } from 'src/app/Popup/Product-Scoring/scoring-parameters/scoring-parameters.component';
import { ScoringService } from 'src/app/services/scoring.service';


declare var jQuery: any;
declare var $: any;


@Component({
  selector: 'app-scoring-edit',
  templateUrl: './scoring-edit.component.html',
  styleUrls: ['./scoring-edit.component.scss']
})
export class ScoringEditComponent implements OnInit {

  tab: any;
  isActive = false;
  // bread crumb data
  breadCrumbItems!: Array<{}>;

  isFinancialRiskCollapsed: boolean = false;
  isPersonalRiskCollapsed: boolean = false;

  isCollapsed: boolean = false;
  isCollapsed1!: boolean;
  isCollapsed2!: boolean;

  selectValue!: string[];

  scoringId: any;
  type: any;
  scoringModelData: any = {};
  value: number = 60;
  highValue: number = 100;
  symbolForScal: String;
  options: Options = { floor: 0, ceil: 200 }
  optionsamber: Options = { floor: 0, ceil: 200, disabled: true }
  submitted = false;
  checkStaticValidation = false;
  roleId: any;
  roles: any = [];
  routeMainPath: any;
  // checkBoxValidation: String;
  checkBoxes = [];
  @ViewChild('scoringForm') scoringForm: FormControl = new FormControl;
  userPermissionList: any = [];
  schemeId: number;
  productList: any = [];
  businessTypeId: number;
  isTabAvailable = false;

  scoringModelDataForValidateApplicantCoApplicant: any = {};


  popUpObj: any = [];
  resEnum: any = [];
  responseEnum: any = [];
  isConfig = false;
  scoringObj: any = {};
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
  editMode: boolean;
  totalParameter=0;
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
    this.roleId =  this.commonService.getConstant().UserRoleList;
    this.schemeId = 9
    // Number(CommonService.getStorage(Constants.httpAndCookies.SCHEME_ID, true));

    //   this.commonService.getConstant().UserRoleList;
    this.symbolForScal = null as any;
    this.routeMainPath = 'TIIC';
    this.userPermissionList = _.split(CommonService.getStorage('UserPermission', true), ',');
    this.businessTypeId = 1
    //  Number(CommonService.getStorage(Constants.httpAndCookies.BUSINESS_TYPE_ID, true));
  }

  ngOnInit() {
    // alert(this.scoringId + "---" + this.type);
    this.breadCrumbItems = [{ label: 'Dashboard', path: this.routeMainPath + '/dashboard' }, { label: 'Scoring Model', path: this.routeMainPath + '/Scoring-List' }, { label: 'Edit Scoring Model', path: '/', active: true }];
    this.selectValue = ['Alaska', 'Hawaii', 'California', 'Nevada', 'Oregon', 'Washington', 'Arizona'];
 
    this.isTabAvailable = true;
    this.tab = 1;
    // this.changeTab(1);
  

    this.getScoringData();
    this.getScoringModel(this.tab);

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

  }
  checkButtonPermission(buttton: any): boolean {
    const index: number = this.userPermissionList.indexOf(buttton);
    if (index != -1)
      return true;
    else
      return false;
  }
  getScoringModel(tabType?: any) {
    this.totalParameter=0;
    let scoringId = this.scoringId;
    this.autoRenewal.getScoringModel(scoringId, this.type, tabType).subscribe(
      success => {
        if (success.status === 200) {
          this.scoringModelData = success.dataObject;
          this.scoringModelData.isUserRiskWeight=true;
          this.scoringModelData.total = (this.scoringModelData.total === undefined) ? this.highValue : this.scoringModelData.total;

          if (this.scoringModelData.titleList.length < 1) {
          } else {
            this.scoringModelData.titleList.forEach(element => {// For Title list get
              element.riskWeightValue = 100;
              if (element.fieldsList.length > 0) { // For Field List add range or LOVs
               
                element.fieldsList.forEach((element1: any) => {
                  element1.isCollapsed1 = true;
                  element1.isConsider = this.commonService.isObjectNullOrEmpty(element1.isConsider) ? false : element1.isConsider;
                  element1.maxScore = this.commonService.isObjectNullOrEmpty(element1.maxScore) ? 0 : element1.maxScore;
                  if (element1.type === 1) { // Type 1 is For min max range
                    element1.range = this.commonService.isObjectNullOrEmpty(element1.range) ? element1.minRangeNumber : element1.range.toString();
                    // if (element1.field === 'BUREAU_SCORE') { // For add Bureau score
                    //   if (element1.modelParameterList.length == 0) {
                    //     element1.modelParameterList.push({ minRange: -1, maxRange: -1, score: 0, isDisabled: true, isRemove: false })
                    //     element1.modelParameterList.push({ minRange: 1, maxRange: 1, score: 0, isDisabled: true, isRemove: false })
                    //     element1.modelParameterList.push({ minRange: 2, maxRange: 2, score: 0, isDisabled: true, isRemove: false })
                    //     element1.modelParameterList.push({ minRange: 3, maxRange: 3, score: 0, isDisabled: true, isRemove: false })
                    //     element1.modelParameterList.push({ minRange: 4, maxRange: 4, score: 0, isDisabled: true, isRemove: false })
                    //     element1.modelParameterList.push({ minRange: 5, maxRange: 5, score: 0, isDisabled: true, isRemove: false })
                    //     element1.modelParameterList.push({ minRange: element1.min, maxRange: null, score: 0, isRemove: false })
                    //     element1.modelParameterList.push({ minRange: null, maxRange: element1.max, score: 0 })
                    //     element1.range = 8
                    //   } else {
                    //     let elements = element1.modelParameterList.filter(res => res.minRange == -1)[0];
                    //     elements.isDisabled = true; elements.isRemove = false;
                    //     let elements1 = element1.modelParameterList.filter(res => res.minRange == 1)[0];
                    //     elements1.isDisabled = true; elements1.isRemove = false;
                    //     let elements2 = element1.modelParameterList.filter(res => res.minRange == 2)[0];
                    //     elements2.isDisabled = true; elements2.isRemove = false;
                    //     let elements3 = element1.modelParameterList.filter(res => res.minRange == 3)[0];
                    //     elements3.isDisabled = true; elements3.isRemove = false;
                    //     let elements4 = element1.modelParameterList.filter(res => res.minRange == 4)[0];
                    //     elements4.isDisabled = true; elements4.isRemove = false;
                    //     let elements5 = element1.modelParameterList.filter(res => res.minRange == 5)[0];
                    //     elements5.isDisabled = true; elements5.isRemove = false;

                    //     let elements300 = element1.modelParameterList.filter(res => res.minRange == 300)[0];
                    //     elements300.isRemove = false;
                    //     this.addScoreParameterList(element1);
                    //   }
                    // } else {
                      this.addScoreParameterList(element1);
                    // }
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
                element.fieldsList[0].isCollapsed1 = false;
              }
            });
          }
          this.getProductBySocreId();
          if(!this.scoringModelData?.decisionMatrixList||_.isEmpty(this.scoringModelData?.decisionMatrixList)){
            this.scoringModelData.decisionMatrixList=[];
            this.scoringModelData.decisionMatrixList.push({ maxScore:this.scoringModelData.total , minScore: 0, grade:'',interpretation:'',loanStatus:'' });
      
          }
         
        }
      }, function (error) {
        if (error.status == 401) {
          // this.commonMethod.logoutUser();
        }
      }
    );
  }

  removeDecisionRange(index){
    if(this.scoringModelData.decisionMatrixList.length>1){
      this.scoringModelData.decisionMatrixList[index-1].minScore=0;
    }
    
    this.scoringModelData.decisionMatrixList.splice(index);
  }
  addDecisionRange (obj) {
      if (obj.length > 0) {
        if(obj[obj.length - 1].maxScore > (obj[obj.length - 1].minScore)){
          let tmp = obj[obj.length - 1];
          let val = tmp.minScore;
          val--;
          obj.push({ minScore: 0, maxScore:val++ ,grade:'',interpretation:'',loanStatus:'' });
        }else{
          obj.push({ minScore: 0, maxScore:0 ,grade:'',interpretation:'',loanStatus:'' });
        }
      } else {
        obj.push({ maxScore:this.scoringModelData.total , minScore: 0, grade:'',interpretation:'',loanStatus:'' });
      }
    // this.scoringModelData.decisionMatrixList.push({minscore:'',maxscore:'',grade:'',interpretation:'',loanStatus:''})
  }
  checkBoxesValidRemove(event, id) {
   
    if (event.target.checked) {
      const index: number = this.checkBoxes.indexOf(id);
      this.checkBoxes.splice(index, 1);
    }

  }

  chekValidVal(field: any, parameter: any, index: any) {
    const currentIndex = index;
    if (field.modelParameterList.length > 0) {
      if (field.isReverse) {
        if (parseFloat(parameter.minRange) < parseFloat(parameter.maxRange) ||
          parseFloat(parameter.maxRange) < parseFloat(field.modelParameterList[field.modelParameterList.length - 1].maxRange) ||
          (!this.commonService.isObjectNullOrEmpty(field.modelParameterList[currentIndex + 1].maxRange) &&
            parseFloat(parameter.maxRange) < parseFloat(field.modelParameterList[currentIndex + 1].maxRange))) {
          parameter.maxRange = null;
          if (field.modelParameterList[currentIndex + 1]) {
            field.modelParameterList[currentIndex + 1].minRange = null;
          }
          this.commonService.warningSnackBar('Value must between range!!');
        }
        if (parseFloat(field.max) >= parseFloat(parameter.maxRange)) {
          parameter.maxRange = null;
          if (field.modelParameterList[currentIndex + 1]) {
            field.modelParameterList[currentIndex + 1].minRange = null;
          }
          this.commonService.warningSnackBar('Value must between range!!');
        }

      } else {
        if (parseFloat(parameter.minRange) > parseFloat(parameter.maxRange) ||
          parseFloat(parameter.maxRange) > parseFloat(field.modelParameterList[field.modelParameterList.length - 1].maxRange) ||
          (!this.commonService.isObjectNullOrEmpty(field.modelParameterList[currentIndex + 1].maxRange) &&
            parseFloat(parameter.maxRange) > parseFloat(field.modelParameterList[currentIndex + 1].maxRange))) {
          parameter.maxRange = null;
          if (field.modelParameterList[currentIndex + 1]) {
            field.modelParameterList[currentIndex + 1].minRange = null;
          }
          this.commonService.warningSnackBar('Value must between range!!');
        }
        if (parseFloat(field.max) <= parseFloat(parameter.maxRange)) {
          parameter.maxRange = null;
          if (field.modelParameterList[currentIndex + 1]) {
            field.modelParameterList[currentIndex + 1].minRange = null;
          }
          this.commonService.warningSnackBar('Value must between range!!');
        }
      }
    }

  }


  calculateParamScore(field: any, parameterList: any) {
    field.maxScore = 0;
    if (field.type == 4) {
      field.lovList.forEach(element => {
        if (parseFloat(element.score) > field.maxScore) {
          field.maxScore = parseFloat(element.score);
        }
      });
    }
    parameterList.forEach((element: any) => {
      if (parseFloat(element.score) > field.maxScore) {
        field.maxScore = parseFloat(element.score);
      }
      this.calculateTotal();
    });
  }

  validateFirst(field: any, parameter: any) {
    const currentIndex = field.modelParameterList.findIndex((status: any) => status.maxRange === parameter.maxRange);
    var i = 0;
    field.modelParameterList.forEach(element => {
      if (i < currentIndex) {
        if (field.field !== 'BUREAU_SCORE') { // For add Bureau score
          if (!element.maxRange) {
            field.modelParameterList[currentIndex].maxRange = null
            field.modelParameterList[currentIndex + 1].minRange = null;
            this.commonService.warningSnackBar('Invalid max value');
          }
        } else {
          let index = 3
          // if (this.schemeId === Constants.SchemeMaster.PRADHAN_MANTRI_MUDRA_YOJNA.id) {
          //   index = 5;
          // }
          if (!element.maxRange && i > index) {
            field.modelParameterList[currentIndex].maxRange = null
            field.modelParameterList[currentIndex + 1].minRange = null;
            this.commonService.warningSnackBar('Invalid max value');
          }
        }
      }
      i++;

    });
  }
  calculate(field: any, parameter: any) {
    const currentIndex = field.modelParameterList.findIndex((status: any) => status.maxRange === parameter.maxRange);
    if (field.modelParameterList.length > 0 && currentIndex !== 0) {
      if (field.isReverse) {
        if (parseFloat(field.modelParameterList[currentIndex - 1].maxRange) < parseFloat(parameter.maxRange)) {
          field.modelParameterList[currentIndex + 1].minRange = null;
          return;
        }
      } else {
        if (parseFloat(field.modelParameterList[currentIndex - 1].maxRange) > parseFloat(parameter.maxRange)) {
          field.modelParameterList[currentIndex + 1].minRange = null;
          return;
        }
      }

    }
    if (!this.commonService.isObjectNullOrEmpty(parameter.maxRange)) {
      if (field.isReverse) {
        field.modelParameterList[currentIndex + 1].minRange = parseFloat(parameter.maxRange) - (field.isFloatAdd ? 0.01 : 1);
      } else {
        field.modelParameterList[currentIndex + 1].minRange = parseFloat(parameter.maxRange) + (field.isFloatAdd ? 0.01 : 1);
      }

    } else {
      field.modelParameterList[currentIndex + 1].minRange = null;
    }
  }

  calculateTotal() {
    // this.scoringModelData.total = 0.0;
    this.scoringModelData.titleList.forEach((element1: any) => {
      // element1.riskMaxScore = 0;
      element1.fieldsList.forEach((element: any) => {
        if (element.isConsider) {
          element.maxScore = element.maxScore == undefined ? 0 : Number(element.maxScore);
          // this.scoringModelData.total = Number(this.scoringModelData.total) + Number(element.maxScore);
          this.scoringModelData.decisionMatrixList[0].maxScore=this.scoringModelData.total;
          // For Risk max score added
          // element1.riskMaxScore = Number(element1.riskMaxScore) + Number(element.maxScore);
          
        }

      });
    });
  }
  calculateTotalMax() {
    this.scoringModelData.total = 0.0;
    this.scoringModelData.titleList.forEach((element1: any) => {
      // element1.fieldsList.forEach((element: any) => {
      //   if (element.isConsider) {
          // element.maxScore = element.maxScore == undefined ? 0 : Number(element.maxScore);
          this.scoringModelData.total = Number(this.scoringModelData.total) + Number(element1.riskMaxScore);
          this.scoringModelData.decisionMatrixList[0].maxScore=this.scoringModelData.total;
          // For Risk max score added
          // element1.riskMaxScore = Number(element1.riskMaxScore) + Number(element.maxScore);
          
      //   }

      // });
    });
  }

  removeScoreParameter(field: any, parameter: any, parameterList: any) {
    if (field.modelParameterList.length > 1) {
      let index = field.modelParameterList.indexOf(parameter);
      if (index > 0 && index < field.modelParameterList.length - 1) {
        field.modelParameterList[index + 1].minRange = field.modelParameterList[index - 1].maxRange + 1;
      }
      var indx = field.modelParameterList.indexOf(parameter);
      field.modelParameterList.splice(indx, 1);
      field.range = field.modelParameterList.length;
      if (field.field !== ('BUREAU_SCORE')) {
        field.modelParameterList[0].minRange = field.min;
      }
      field.modelParameterList[field.modelParameterList.length - 1].maxRange = field.max;
      this.calculateParamScore(field, parameterList);
    }
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


  scoreFieldAdd(objData: any, scoringId): void {

    this.scoringModelData.tabId = this.tab;
    this.autoRenewal.saveScoringParameterMapping(this.scoringModelData).subscribe((success: any) => {
      if (success.status === 200) {
        const config: any = {
          windowClass: 'Common-PS-Para',
          size: 'lg',
          keyboard: false,
          ignoreBackdropClick: true
        };
        config['backdrop'] = 'static';
        const data = { scoringId: scoringId, riskMapId: objData.riskMapId, tabId: this.tab };
        this.commonService.openPopUp(data, ScoringParametersComponent, false, config).result.then(result => {
          if (result === 'Ok') {
            this.getScoringModel(this.tab);
          }
        });
      }
    }, function (error: any) {
      if (error.status == 401) {
        this.commonMethod.logoutUser();
      }
    });


  }

  valueChange(value: number): void {
    this.scoringModelData.amberMinValue = Number(0);
    this.scoringModelData.amberMaxValue = Number(value) > 0 ? (Number(value) - 1) : 0;
  }

  changeTab(tabId: number) {
    if (this.tab != tabId) {
      this.saveScoringDraftOrsendCheckerApproval(1);
    }

    this.tab = tabId;
    if (tabId == 1) {
      this.getScoringModel(this.tab);
      // this.getScoringModelForValidateApplicantCoApplicant(2);
    // } else if (tabId == 2) {
    //   this.getScoringModel(this.tab);
    //   this.getScoringModelForValidateApplicantCoApplicant(1);
    }
  }
  //  This js On Window Scroll Top set Cont Dont Remove @Nikul
  // Windi scroll Function
  @HostListener('window:scroll', ['$event'])
  onWindowScroll(e: any) {
    if (window.pageYOffset >  window.innerHeight) {
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

  listTOjson(data: any) {
    console.log(data);
    return JSON.parse(data);
  }

  hasOwnProperty(data: any) {
    // debugger;
    return data.hasOwnProperty('list');
  }

  convertArrayFromString(string: any) {
    return JSON.parse(string);
  }

  checkApplicantValidation(): boolean {
    //special for check box
    let isValidated = true;
    this.checkBoxes = [];
    this.scoringModelData.titleList.forEach((riskGrp: any) => {
      if (riskGrp.fieldsList.length > 0) {
        riskGrp.fieldsList.forEach((field: any) => {
          if (field.considerFor != null && field.considerFor != undefined) {
            if (field.isConsider) {
              // alert(field.fieldId);
              if (field.considerFor == 3) {
                if ((this.commonService.isObjectNullOrEmpty(field.isCoApplicant) && this.commonService.isObjectNullOrEmpty(field.isApplicant)) ||
                  (((!this.commonService.isObjectNullOrEmpty(field.isCoApplicant) && !this.commonService.isObjectNullOrEmpty(field.isApplicant)) &&
                    field.isCoApplicant == false && field.isApplicant == false))) {
                  this.checkBoxes.push(field.fieldId);
                  this.commonService.warningSnackBar('Applicant and Co-Applicant is mendetory to select in ' + ' ( ' + field.fieldName + ')');
                  isValidated = false;
                  return isValidated;
                }
              }
              if (field.considerFor == 2) {
                if (this.commonService.isObjectNullOrEmpty(field.isCoApplicant) || (!this.commonService.isObjectNullOrEmpty(field.isCoApplicant) && field.isCoApplicant == false)) {
                  this.checkBoxes.push(field.fieldId);
                  this.commonService.warningSnackBar('Co-Applicant is mendetory to select in ' + ' ( ' + field.fieldName + ')');
                  isValidated = false;
                  return isValidated;
                }
              }
              if (field.considerFor == 1) {
                if (this.commonService.isObjectNullOrEmpty(field.isApplicant) || (!this.commonService.isObjectNullOrEmpty(field.isApplicant) && field.isApplicant == false)) {
                  this.checkBoxes.push(field.fieldId);
                  this.commonService.warningSnackBar('Applicant is mendetory to select in ' + ' ( ' + field.fieldName + ')');
                  isValidated = false;
                  return isValidated;
                }

              }
            }
          }
          return isValidated;
        });
      }
    });
    return isValidated;
  }

  saveScoringDraftOrsendCheckerApproval(type: any) {
    /*** type
     *  1 = save
     *  2 = send to cheker
     *  3 = came from exist
     */
    this.scoringModelData.tabId = this.tab;
    if (type === 2) {
      this.checkStaticValidation = true;
     
      if (this.checkValidation() == false || this.scoringForm.invalid) {
      this.submitted = false
        setTimeout(() => {
          this.submitted = true;
        }, 0);
        //  this.commonService.warningSnackBar('Required fields are missing');
        return;
      }
      if (this.scoringForm.invalid) {
        this.submitted = false
        setTimeout(() => {
          this.submitted = true;
        }, 0);
        this.commonService.warningSnackBar('Required fields are missing');
        return;
      }

      /**
       * This Validation work on only tab view page
       */
     let secondTabName;
      if (this.tab === 1) {
        secondTabName = 'Co-Applicant';
      } else {
        secondTabName = 'Applicant';
      }
     
      /**
       * if form is invallid than show this
       */
      if (this.scoringForm.invalid) {
        this.commonService.warningSnackBar('kindly check score range or score');
        return;
      }

    }


    this.autoRenewal.saveScoringParameterMapping(this.scoringModelData).subscribe((success: any) => {
      if (success.status === 200) {
        if (type === 1 || type === 3) {
          this.commonService.successSnackBar("Scoring model saved successfully");
          if (type === 3) {
            this.router.navigate([this.routeMainPath + '/Scoring-List']);
          }
          this.getScoringModel(this.tab);

        } else if (type === 2) {
          if (this.checkValidation() && this.scoringForm.valid) {
            let data: any = {};
            data.name = this.scoringModelData.scoreModelName;
            data.type = 4;
            // if ((this.scoringModelData.statusId == 6 || this.scoringModelData.statusId == 5) ) {
            //   this.commonService.warningSnackBar("Your request is already sent to checker for approval. Hence you can not edit scoring model");
            //   return;
            // }
            this.commonPopUp(data).then(result => {
              if (result === 'Ok') {
                this.autoRenewal.updateScoringStatus(this.scoringId, Constants.ScoringStatusNew.SEND_TO_CHECKER).subscribe(success => {
                  if (success.status === 200) {
                    this.commonService.successSnackBar('Scoring model send to checker successfully');
                    this.router.navigate([this.routeMainPath + '/Scoring-List']);
                  }
                });
              }
            });
          }


        }


      }
    }, function (error: any) {
      if (error.status == 401) {
        this.commonMethod.logoutUser();
      }
    });
  }



  saveScoringParameters(scoringForm: any, type?: any) {
    this.checkStaticValidation = true;
    this.checkApplicantValidation();


    if (scoringForm.invalid) {
      this.submitted = false
      setTimeout(() => {
        this.submitted = true;
      }, 0);
      this.commonService.warningSnackBar('required fields are missing');
      return;
    }

    if (this.checkValidation() && scoringForm.valid) {
      this.autoRenewal.saveScoringParameterMapping(this.scoringModelData).subscribe((success: any) => {
        if (success.status === 200) {
          this.commonService.successSnackBar("saved scoring model")
          this.getScoringModel(this.tab);
          if (type == 1) {

            this.router.navigate([this.routeMainPath + '/Scoring-List']);
          }
          // this.router.navigate([this.routeMainPath + '/Scoring-List']);
        }
      }, function (error: any) {
        if (error.status == 401) {
          // this.commonMethod.logoutUser();
        }
      });
    }
  }

  checkCoapp(field, type): void {
    if (type == 1) {
      if (field.isApplicant || field.checkCoapp == 3) {
        field.isCoApplicant = true;
      }
    }
    if (type == 2) {
      if (field.isCoApplicant || field.checkCoapp == 3) {
        field.isApplicant = true;
      }
    }
    field.isCollapsed1 = false;
  }

  checkBoxesValid(id: any): boolean {
    if (this.checkBoxes.includes(id)) {
      return true;
    }
    return false;
  }
  checkValidation(): boolean {
    let isValidated = true;

    this.scoringModelData.titleList.forEach((riskGrp: any) => {
      
      if (riskGrp.fieldsList.length > 0) {
        if(this.checkTotalWeightage(riskGrp.fieldsList,riskGrp)==false){
          this.commonService.warningSnackBar(riskGrp.riskName + 'Total Weightage Should not be more than or less than  100');
          isValidated = false;
          return isValidated;
        }
        if(riskGrp.riskMaxScore==0){
          this.commonService.warningSnackBar(riskGrp.riskName + 'Total Max Score Should not be null or empty');
          isValidated = false;
          return isValidated;
        }
        riskGrp.fieldsList.forEach((field: any) => {
          if (field.isConsider) {
            
            if (this.commonService.isObjectNullOrEmpty(field.maxScore)) {
              this.commonService.warningSnackBar('Max Score Should not be null or empty in ' + ' ( ' + field.fieldName + ')');
              isValidated = false;
              return isValidated;
            }
            if (this.commonService.isObjectNullOrEmpty(field.weightage)) {
              this.commonService.warningSnackBar('Weightage Should not be null or empty in ' + ' ( ' + field.fieldName + ')');
              isValidated = false;
              return isValidated;
            }
            field.modelParameterList.forEach((parameter: any) => {
              if ((field.type === 1 || field.type === 4) && (parameter.minRange == null || parameter.maxRange == null || parameter.score == null)) {
                this.commonService.warningSnackBar('Min or Max Range or score Not be null or empty in ' + ' ( ' + field.fieldName + ')');
                isValidated = false;
                return isValidated;
              }
              if (field.type === 2 && (parameter.score == null)) {
                this.commonService.warningSnackBar('Score should Not be null or empty in ' + ' ( ' + field.fieldName + ')');
                isValidated = false;
                return isValidated;
              }
              if (field.type === 3) {
                if ((parameter.minRange == null || parameter.maxRange == null || parameter.score == null)) {
                  this.commonService.warningSnackBar('Score should Not be null or empty in ' + ' ( ' + field.fieldName + ')');
                  isValidated = false;
                  return isValidated;
                }
                if ((field.addiValues == null)) {
                  this.commonService.warningSnackBar('Select Gross and net income in ' + ' ( ' + field.fieldName + ')');
                  isValidated = false;
                }
              }

              return isValidated;
            });
          }
          return isValidated;
        });
      }
      if (riskGrp.fieldsList.length <= 0) {
        this.commonService.warningSnackBar('Please add atleast 1 parameter in ' + riskGrp.riskName);
        isValidated = false;
        return isValidated;
      }
      if (riskGrp.riskMaxScore <= 0) {
        this.commonService.warningSnackBar(riskGrp.riskName + ' Max Score Should not be null or empty');
        isValidated = false;
        return isValidated;
      }
      return isValidated;
    });

   
    if (this.scoringModelData.isUseProportionateScore) {
      if (this.commonService.isObjectNullOrEmpty(this.scoringModelData.proportionateScore) || this.scoringModelData.proportionateScore == 0) {
        this.commonService.warningSnackBar('Total Proportionate should be not null or more than 0');
        return false;
      }
    }
    if (this.scoringModelData.total === 0) {
      this.commonService.warningSnackBar('Total Score should not be 0');
      return false;
    }

    if(_.isEmpty(this.scoringModelData.decisionMatrixList)){
      this.commonService.warningSnackBar('Please fill decision matrix');
      return false;
    }
    this.scoringModelData.decisionMatrixList.forEach(field => {
      if (field.minScore == null || field.maxScore == null || this.commonService.isObjectNullOrEmpty(field.grade) || this.commonService.isObjectNullOrEmpty(field.interpretation)|| this.commonService.isObjectNullOrEmpty(field.loanStatus)) {
        // this.commonService.warningSnackBar('Score Range or Grade or Interpretation or Loan Status Not be null or empty');
        this.commonService.warningSnackBar('Please fill decision matrix');
        isValidated = false; 
      }
      return isValidated;
    });
    // this.scoringModelData.
    return isValidated;
  }
  blurForMax(event, fieldList, type, value?): void {
    const numberText = event.target.value;
    
    if (type === 2) {
      if (Number(numberText) >= value) {
        this.commonService.warningSnackBar('Please enter less then ' + value);
        event.target.value = '';
        // fieldName=null;
        // fieldList.forEach(element => {
        //   if (element.minScore == numberText) {
        //     element.minScore = '';
        //   }
        // });

      }
    }

  }
  onFocusOutEvent(objList, index) {
    if (objList.length > 1) {
      let current = objList[index];
      objList[index + 1].maxScore = (current.minScore - 1)
    }
  }

  removeParameter(data: any): void {
    data.type = 1;
    this.commonPopUp(data).then(result => {
      if (result === 'Ok') {
        data.isConsider = false;
        this.calculateParamScore(data, data.modelParameterList);

      }
    });
  }


  commonPopUp(data: any) {
    const config = {
      windowClass: 'popup-650',
    };
    const modalRef = this.modalService.open(ScoringCommonComponent, config);
    modalRef.componentInstance.popUpObj = data;
    return modalRef.result;
  }

  checkStringisObjectNullOrEmpty(data: any) {
    return this.commonService.isObjectNullOrEmpty(data);
  }


  Confirm_scoring_Confiration_Popup() {
    const config = {
      windowClass: 'Mediam-model',
    };
    const modalRef = this.modalService.open(ConfimScoringConfigurationComponent, config);
    modalRef.componentInstance.user = this.scoringModelData;
    modalRef.componentInstance.currentObj = this;
    console.log("currentObj", modalRef.componentInstance.currentObj);

    return modalRef;
  }


  exitScoringModel() {
    let data: any = {};
    data.type = 3
    this.commonPopUp(data).then(result => {
      if (result === 'Ok') {
        this.saveScoringDraftOrsendCheckerApproval(3);
      } else if (result === 'Exit') {
        this.router.navigate([this.routeMainPath + '/Scoring-List']);
      } else {
        // this.router.navigate([this.routeMainPath + '/Scoring-List']);
      }
    });
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
    if (!this.commonService.isObjectNullOrEmpty(this.scoringModelData.scoringModelId)) {
      this.autoRenewal.getProductSByscoringId(this.scoringModelData.scoringModelId).subscribe((success: any) => {
        if (success.status === 200) {
          this.productList = success.data;
        }
      }, function (error: any) {
        this.commonService.errorSnackBar(error);
      });
    }
  }


 


  getScoringData() {
    this.autoRenewal.getScoringData(this.scoringId, 1).subscribe(success => {
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
            element.enumName = _.capitalize(element?.enumName)
            element.enumName = _.startCase(element?.enumName)
          });
          // this.editConfigurationParamter = _.groupBy(this.resEnum, 'enumName');
          this.editConfigurationParamter = _.cloneDeep(this.resEnum);

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
  checkTotalWeightage(list:any,item:any):Boolean{
    let sum=_.sumBy(list, 'weightage');
    if(sum>item.riskWeightValue||sum<item.riskWeightValue){
      this.commonService.warningSnackBar("Total Weight Sum should be 100");
      return false;
    }
    return true;
  }
  setWeightedScore(item,weightage){
    item.weightedScore=weightage*item.score/100;
  }
  setWeightedScoreOnChangeWeight(weightage,field){
    if(field.type == 3 || field.type == 4){
      field.lovList.forEach(element => {
        element.weightedScore=weightage*element.score/100;
      });
    }else if(field.type == 2||field.type == 1){
      field.modelParameterList.forEach(element => {
        element.weightedScore=weightage*element.score/100;
      });
    }
  }
}