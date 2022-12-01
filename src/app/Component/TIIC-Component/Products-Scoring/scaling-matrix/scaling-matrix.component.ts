import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import * as _ from 'lodash';
import { Subscription } from 'rxjs';
import { CommonService } from 'src/app/CommoUtils/common-services/common.service';
import { ProductService } from 'src/app/services/product.service';

@Component({
  selector: 'app-scaling-matrix',
  templateUrl: './scaling-matrix.component.html',
  styleUrls: ['./scaling-matrix.component.scss']
})
export class ScalingMatrixComponent implements OnInit {
  @ViewChild('scalingForm') scalingForm: NgForm;
  @Input("productId") productId: any;
  @Input() contentType;
  @Input() productType;
  @Input() minLoanAmount;
  @Input() maxLoanAmount;
  @Output() savedScallingEvent = new EventEmitter();
  maxScoringRange: number;
  typeId: any;
  riskObj = { id: 1, value: "Risk" };
  cibilObj = { id: 2, value: "Cibil" };
  tenureObj = { id: 3, value: "Tenure" };
  loanAmountObj = { id: 5, value: "Loan Amount" };
  foirList: any = [];
  roiList: any = [];
  pfList: any = [];
  tenureList: any = [];
  persentageList: any = [];
  roiSubOptionList: any = [];
  oldScoringId: any;
  scoringObj: any = {};
  baseRate: any;
  scoringModelList =[];
  // = [{ id: 1, name: "test", totalScore: 100 }]
  popUpObj: any = {};
  showActionButtons = false;
  totalScore = 0;
  totalScoreCoApp = 0;
  noRange = 0;
  range = '';
  userPermissionList: any = [];
  maximumIncome = Number.MAX_SAFE_INTEGER;
  minTenure: Number;
  maxTenure: Number;
  constant: any;
  updatedDetails: any;
  tmpScalingWithScoringObj: any = {};
  tmpScalingWithNoScoringObj = {};
  scalingConfig: any = {};
  isScalingLoanAmntConfig = false;

  businessTypeId: number = 1;
  schemeId: number = 9;
  byIdData: any = {};
  submitted = false;
  isSame: any;
  saveSubjectSubscriber: Subscription;
  object:any
  constructor(
    private commonService: CommonService,
    private prodService: ProductService) {
    this.saveSubjectSubscriber = this.prodService.saveSubjectSubscriber$.subscribe(data => {
      if (data && (data === 'saveScaling' || data === 'save&ExitScaling'||data=='saveScalingForApprovel')) {
        this.object=data;
        this.saveScoringData();
      }
    });
  }

  ngOnInit(): void {
    this.getScalingData();
    this.getScalingConfig();
    this.setTenure();
  }


  getScalingConfig() {
    // console.log("api called")
    let request = { productId: this.productId };
    this.prodService.getScalingConfig(request).subscribe(res => {
      this.scalingConfig = res.data;
      if (this.scalingConfig != null) {
        if (this.scalingConfig.roiScaleType == this.loanAmountObj.id ||
          this.scalingConfig.tenureScaleType == this.loanAmountObj.id ||
          this.scalingConfig.marginScaleType == this.loanAmountObj.id ||
          this.scalingConfig.pfScaleType == this.loanAmountObj.id) {
          this.isScalingLoanAmntConfig = true;
        }

      }
    });
  }
  getScalingData() {
    this.buildDefaultScalingMatrix();
  }
  buildDefaultScalingMatrix() {
    if (!this.isAdded(this.riskObj.id, this.foirList)) {
      this.foirList.push(this.riskObj);
    }

    if (!this.isAdded(this.riskObj.id, this.roiList)) {
      this.roiList.push(this.riskObj);
    }
    if (!this.isAdded(this.loanAmountObj.id, this.roiList)) {
      this.roiList.push(this.loanAmountObj);
    }
    if (!this.isAdded(this.tenureObj.id, this.roiList)) {
      this.roiList.push(this.tenureObj);
    }

    if (!this.isAdded(this.riskObj.id, this.tenureList)) {
      this.tenureList.push(this.riskObj);
    }
    if (!this.isAdded(this.riskObj.id, this.pfList)) {
      this.pfList.push(this.riskObj);
    }
    if (!this.isAdded(this.loanAmountObj.id, this.pfList)) {
      this.pfList.push(this.loanAmountObj);
    }

    this.scoringObj.baseRateType = 0;
    this.scoringObj.marginScaleType = 0;
    this.scoringObj.roiScaleType = 0;
    this.scoringObj.tenureScaleType = 0;
    this.scoringObj.pfScaleType = 0;
    this.scoringObj.riskGrading = {};
    this.scoringObj.riskGradingList = [];
    this.scoringObj.tenureGrading = {};
    this.scoringObj.tenureGradingList = [];
    this.scoringObj.loanAmountGrading = {};
    this.scoringObj.loanAmountGradingList = [];

    // this.scoringObj.isNoScoring = false;
    this.scoringObj.isConfigureRoi = true;
    this.getBaseRate();
    this.getScoringMasterList();
  }
  isAdded(id, list) {
    for (let i = 0; i < list.length; i++) {
      if (list[i].id == id) {
        return true;
      }
    }
    return false;
  }
  addOrRemoveRisk(isNoScoring: Boolean) {

    if (!isNoScoring) {

      if (!this.commonService.isObjectIsEmpty(this.tmpScalingWithScoringObj)) {
        this.scoringObj = _.cloneDeep(this.tmpScalingWithScoringObj);
      }
      this.scoringObj.isNoScoring = false;

      if (!this.isAdded(this.riskObj.id, this.foirList)) {
        this.foirList.push(this.riskObj);
        this.foirList = _.cloneDeep(this.foirList);
      }
      if (!this.isAdded(this.riskObj.id, this.roiList)) {
        this.roiList.push(this.riskObj);
        this.roiList = _.cloneDeep(this.roiList);
      }
      if (!this.isAdded(this.riskObj.id, this.tenureList)) {
        this.tenureList.push(this.riskObj);
        this.tenureList = _.cloneDeep(this.tenureList);
      }

      if (!this.isAdded(this.riskObj.id, this.pfList)) {
        this.pfList.push(this.riskObj);
        this.pfList = _.cloneDeep(this.pfList);
      }
    } else {
      this.tmpScalingWithScoringObj = _.cloneDeep(this.scoringObj);
      this.scoringObj.isNoScoring = true;
      this.scoringObj.isConfigureRoi = false;
      this.tmpScalingWithScoringObj.isNoScoring = true;
      this.scoringObj.minimumScore = null;
      this.scoringObj.minimumScoreCoApp = null;
      this.scoringObj.scoringModelId = null;
      if (this.isAdded(this.riskObj.id, this.foirList)) {
        const index = this.foirList.indexOf(this.riskObj);
        this.foirList.splice(index, 1);
        this.foirList = _.cloneDeep(this.foirList);
      }
      if (this.isAdded(this.riskObj.id, this.roiList)) {
        const index = this.roiList.indexOf(this.riskObj);
        this.roiList.splice(index, 1);
        this.roiList = _.cloneDeep(this.roiList);
      }
      if (this.isAdded(this.riskObj.id, this.tenureList)) {
        const index = this.tenureList.indexOf(this.riskObj);
        this.tenureList.splice(index, 1);
        this.tenureList = _.cloneDeep(this.tenureList);
      }

      if (this.isAdded(this.riskObj.id, this.pfList)) {
        const index = this.pfList.indexOf(this.riskObj);
        this.pfList.splice(index, 1);
        this.pfList = _.cloneDeep(this.pfList);
      }
      if (this.scoringObj.marginScaleType == this.riskObj.id) {
        this.scoringObj.marginScaleType = 0;
        this.scoringObj.riskGradingList = [];
      }
      if (this.scoringObj.roiScaleType == this.riskObj.id) {
        this.scoringObj.roiScaleType = 0;
        this.scoringObj.riskGradingList = [];
      }
      if (this.scoringObj.tenureScaleType == this.riskObj.id) {
        this.scoringObj.tenureScaleType = 0;
        this.scoringObj.riskGradingList = [];
      }
      if (this.scoringObj.pfScaleType == this.riskObj.id) {
        this.scoringObj.pfScaleType = 0;
        this.scoringObj.riskGradingList = [];
      }

    }
  }
  getScoringMasterList() {

    let isSalaried = false;
    let isStudent = false;
    let isNonSalaried = false;
    let type = 0;
    if (!this.commonService.isObjectNullOrEmpty(this.byIdData) && !this.commonService.isObjectNullOrEmpty(this.byIdData.productTypeTempResponses)) {

      // alert(this.schemeId);
      if (true == true) {
        this.byIdData.productTypeTempResponses.forEach(element => {
          if (element.masterType == 'Borrower Type') {
            if (element.masterId == 1) {
              isSalaried = true;
            } else if (element.masterId == 2) {
              isNonSalaried = true;
            }
          }
        });

        if (isSalaried && isNonSalaried) {
          type = 3;
        } else if (isNonSalaried) {
          type = 2;
        } else if (isSalaried) {
          type = 1;
        }
        // alert(type);

      } else {
        this.byIdData.productTypeTempResponses.forEach(element => {
          if (element.masterType == 'Borrower Type') {
            if (element.masterId == 1) {
              isStudent = true;
            } else if (element.masterId == 2) {
              isSalaried = true;
            }
          }
        });

        if (isSalaried && isStudent) {
          type = 3;
        } else if (isStudent) {
          type = 2;
        } else if (isSalaried) {
          type = 1;
        }

      }


    }
    this.prodService.getScoringMasterList(this.businessTypeId, this.schemeId, type).subscribe(res => {
      //this.scoringModelList.push({ id: 12, name: 'Test', totalScore: 100 });
      if (this.commonService.isObjectNullOrEmpty(res)) {
        this.commonService.errorSnackBar('Something went wrong.');
        return;
      }
      this.scoringModelList = res.dataObject;
      // console.log(" this.scoringModelList :: ", this.scoringModelList);
      this.getTotalScore();
      this.getScalingMatrix();
    }, error => {
      this.commonService.errorSnackBar(error);
    })
  }


  getTotalScore() {
    for (let i = 0; i < this.scoringModelList.length; i++) {
      if (this.scoringModelList[i].id == this.scoringObj.scoringModelId) {
        this.totalScore = this.scoringModelList[i].totalScore;
        // this.totalScoreCoApp = this.scoringModelList[i].totalScoreCoApp
        this.scoringObj.minimumScore = 0;//this.totalScore;
        this.scoringObj.minimumScoreCoApp = 0;
        this.changeMaxRange();
        return;
      }
    }
  }
  changeMaxRange() {
    if (this.scoringObj.riskGradingList.length > 0) {
      this.scoringObj.riskGradingList[0].minScore = this.totalScore;
    }
  }

  parseInt(val) {
    if (val) {
      return parseFloat(val)
    }
    return 0;
  }

  addRange(obj, scaleType) {
    if (obj.length > 0) {
      let tmp = obj[obj.length - 1];
      let val = tmp.maxScore;
      if (val > 0) {
        val = val - 1;
      } else {
        val = 0;
      }
      obj.push({ minScore: val, maxScore: 0.0, scaleType: scaleType });
    } else {
      obj.push({ minScore: this.totalScore, maxScore: 0.0, scaleType: scaleType });
    }
    //this.scoringObj.riskScoringList.push({});
    this.getRangeInfo();
  }
  onFocusOutEvent(event, objList, index, cnt, form) {
    if (objList.length > 1) {
      let current = objList[index];
      objList[index + 1].minScore = (current.maxScore - 1)
      this.checkScalingValidation(objList, index);
    }
    this.getRangeInfo();
  }
  onFocusOutEventGrossIncome(event, objList, index, cnt, form) {
    if (objList.length > 1) {
      let current = objList[index];
      let next = objList[index + 1];
      next.minScore = Number.parseInt(current.maxScore) + 1;
      this.checkIncomeScalingValidation(objList, index);
    }
    this.getRangeInfo();
  }

  onFocusOutEventTenure(objList, index) {
    if (objList.length > 1) {
      let current = objList[index];
      let next = objList[index + 1];
      next.minScore = Number.parseInt(current.maxScore) + 1;
      this.checkTenureScalingValidation(objList, index);
    }
    this.getRangeInfo();
  }
  onFocusOutEventBureauRange(event, objList, index, cnt, form) {
    if (objList.length > 1) {
      let current = objList[index];
      let next = objList[index + 1];
      next.minScore = Number.parseInt(current.maxScore) + 1;
      this.checkBureauRangeValidation(objList, index);
    }
    // this.getRangeInfo();
  }
  checkBureauRangeValidation(obj, index) {
    if (index == 0) {
      if (obj[index].maxScore >= 900 || obj[index].minScore >= obj[index].maxScore) {
        this.commonService.warningSnackBar("please select valid range");
        return false;
      } else if (obj.length > 1 && (obj[index].maxScore >= obj[index + 1].maxScore)) {
        this.commonService.warningSnackBar("please select valid range");
        return false;
      }
    } else if (index == (obj.length - 1)) {
      if (((obj[index].minScore >= obj[index].maxScore) || (obj[index].maxScore <= obj[index - 1].maxScore))) {
        this.commonService.warningSnackBar("please select valid range");
        return false;
      }
    } else if ((obj[index].maxScore >= 900) || (obj[index].minScore >= obj[index].maxScore) || (obj[index].maxScore <= obj[index - 1].maxScore)) {
      this.commonService.warningSnackBar("please select valid range");
      return false;
    }
    return true;
  }
  removeScoringRange(gradingLst, index, scaleType) {
    gradingLst.pop(index);
    if (index != 0) {
      if (scaleType == 1) {
        gradingLst[gradingLst.length - 1].maxScore = 0;
      } else if (scaleType == 7) {
        gradingLst[gradingLst.length - 1].maxScore = 900;
      } else if (scaleType == 5) {
        gradingLst[gradingLst.length - 1].maxScore = this.maxLoanAmount;
      } else {
        gradingLst[gradingLst.length - 1].maxScore = Number.MAX_SAFE_INTEGER;
      }
    }
  }

  getSum(val1, val2) {
    return val1 + val2;
  }
  getBaseRate() {

    let isFromInit = (this.scoringObj.baseRateType == 0);
    // let isFromInit = (this.scoringObj.baseRateType == undefined);
    // console.log('From init:: ', isFromInit);
    let baseRateType = this.scoringObj.baseRateType;
    if (isFromInit) {
      baseRateType = 1;
    }
    let request = { businessTypeId: this.businessTypeId, status: 3, baseRateTypeId: baseRateType, schemeId: this.schemeId };
    this.prodService.getBaseRate(request).subscribe(success => {
      if (this.commonService.isObjectNullOrEmpty(success.data)) {
        this.prodService.getToBeActiveBaseRate(request).subscribe(res => {
          if (!this.commonService.isObjectNullOrEmpty(res.data)) {
            this.commonService.warningSnackBar('The product can only be set after ' + res.data + ' i.e at the same time as the updated interest rate is active.');
            return;
          } else {
            this.commonService.warningSnackBar('Please create or approved ' + (baseRateType == 1 ? 'EBLR.' : 'MCLR .'));
            return;
          }
        });
      }
      if (!isFromInit) {
        this.baseRate = success.data;
      }
    }, error => {
      this.commonService.errorSnackBar(error);
    });
  }
  checkScalingValidation(obj, index) {
    if (index == 0) {
      if ((obj[index].maxScore >= obj[index].minScore)) {
        this.commonService.warningSnackBar("please select valid range");
        return false;
      }
    }
    else if ((obj[index].maxScore >= obj[index].minScore) || (obj[index].maxScore >= obj[index - 1].maxScore)) {
      this.commonService.warningSnackBar("please select valid range ");
      return false;
    }
    return true;
  }
  checkTenureScalingValidation(obj, index) {
    if (index == 0) {
      if (obj[index].maxScore > this.maxTenure || obj[index].minScore >= obj[index].maxScore) {
        this.commonService.warningSnackBar("please select valid range");
        return false;
      } else if (obj.length > 1 && (obj[index].maxScore >= obj[index + 1].maxScore)) {
        this.commonService.warningSnackBar("please select valid range");
        return false;
      }
    } else if (index == (obj.length - 1)) {
      if (((obj[index].minScore >= obj[index].maxScore) || (obj[index].maxScore <= obj[index - 1].maxScore))) {
        this.commonService.warningSnackBar("please select valid range");
        return false;
      }
    } else if ((obj[index].maxScore > this.maxTenure) || (obj[index].minScore >= obj[index].maxScore) || (obj[index].maxScore <= obj[index - 1].maxScore)) {
      this.commonService.warningSnackBar("please select valid range");
      return false;
    }
    return true;
  }

  checkIncomeScalingValidation(obj, index) {
    if (index == 0) {
      if (obj[index].maxScore > this.maximumIncome || obj[index].minScore >= obj[index].maxScore) {
        this.commonService.warningSnackBar("please select valid range");
        return false;
      } else if (obj.length > 1 && (obj[index].maxScore >= obj[index + 1].maxScore)) {
        this.commonService.warningSnackBar("please select valid range");
        return false;
      }
    } else if (index == (obj.length - 1)) {
      if (((obj[index].minScore >= obj[index].maxScore) || (obj[index].maxScore <= obj[index - 1].maxScore))) {
        this.commonService.warningSnackBar("please select valid range");
        return false;
      }
    } else if ((obj[index].maxScore > this.maximumIncome) || (obj[index].minScore >= obj[index].maxScore) || (obj[index].maxScore <= obj[index - 1].maxScore)) {
      this.commonService.warningSnackBar("please select valid range");
      return false;
    }
    return true;
  }

  checkLoanAmountScalingValidation(obj, index) {
    if (index == 0) {
      if (obj[index].maxScore > this.maxLoanAmount || obj[index].minScore >= obj[index].maxScore) {
        this.commonService.warningSnackBar("please select valid range");
        return false;
      } else if (obj.length > 1 && (obj[index].maxScore >= obj[index + 1].maxScore)) {
        this.commonService.warningSnackBar("please select valid range");
        return false;
      }
    } else if (index == (obj.length - 1)) {
      if (((obj[index].minScore >= obj[index].maxScore) || (obj[index].maxScore <= obj[index - 1].maxScore))) {
        this.commonService.warningSnackBar("please select valid range");
        return false;
      }
    } else if ((obj[index].maxScore > this.maxLoanAmount) || (obj[index].minScore >= obj[index].maxScore) || (obj[index].maxScore <= obj[index - 1].maxScore)) {
      this.commonService.warningSnackBar("please select valid range");
      return false;
    }
    return true;
  }

  checkAllRange(objList) {

    if (this.commonService.isObjectNullOrEmpty(objList) || objList.length == 0) {
      this.commonService.warningSnackBar('Please add risk score range');
      return false;
    }

    for (let i = 0; i < objList.length; i++) {
      let isValid = this.checkScalingValidation(objList, i);
      if (!isValid || (objList[i].minScore == 0 && objList[i].maxScore == 0)) {
        return false;
      }
    }
    return true;
  }

  checkIncomeRange(objList, incomeRangeType) {
    if (this.commonService.isObjectNullOrEmpty(objList) || objList.length == 0) {
      if (incomeRangeType == 1) {
        this.commonService.warningSnackBar('Please add tenure range');
      } 
      return false;
    }
    return true;
  }

  checkLoanAmountRange(objList) {
    if (this.commonService.isObjectNullOrEmpty(objList) || objList.length == 0) {
      this.commonService.warningSnackBar('Please add loan amount range');
      return false;
    }

    for (let i = 0; i < objList.length; i++) {
      let isValid = this.checkLoanAmountScalingValidation(objList, i);
      if (isValid == false || (objList[i].minScore == 0 && objList[i].maxScore == 0)) {
        return false;
      }
    }
    return true;
  }
  isValidScaling(showMsg) {

    if (this.scalingForm == null || this.scalingForm == undefined || this.scalingForm.invalid) {
      this.submitted = false
      setTimeout(() => {
        this.submitted = true;
      }, 0);
      return false;

    }
    let isSame = false;
    if (!this.scoringObj.isNoScoring) {
      for (let i = 0; i < this.scoringModelList.length; i++) {
        this.oldScoringId = this.scoringObj.scoringModelId;
        if (this.scoringModelList[i].id == this.scoringObj.scoringModelId) {

          isSame = true;
        }
      }
      if (!isSame) {
        // this.commonService.warningSnackBar('Please updated Risk Scoring Model.');
        return false;
      }
    }

    let isValid = true;
    if (this.scalingForm.invalid === true) {
      this.submitted = false
      setTimeout(() => {
        this.submitted = true;
      }, 0);
      if (showMsg) {
        this.commonService.warningSnackBar('required fields are missing');
      }
      isValid = false;
    }
    if (this.commonService.isObjectNullOrEmpty(this.scoringObj.isNoScoring)) {
      isValid = false;
    }

    if (this.scoringObj.isConfigureRoi) {
      if (this.scoringObj.marginScaleType == 0
        || this.scoringObj.roiScaleType == 0
        || this.scoringObj.tenureScaleType == 0
        || this.scoringObj.pfScaleType == 0) {
        this.commonService.warningSnackBar('please configure all parameter.');
        isValid = false;
      }
      if (this.scoringObj.marginScaleType == this.riskObj.id
        || this.scoringObj.roiScaleType == this.riskObj.id
        || this.scoringObj.tenureScaleType == this.riskObj.id
        || this.scoringObj.pfScaleType == this.riskObj.id) {
        if (!this.checkAllRange(this.scoringObj.riskGradingList)) {
          isValid = false;
        }
      }


      if (this.scoringObj.marginScaleType == this.loanAmountObj.id
        || this.scoringObj.roiScaleType == this.loanAmountObj.id
        || this.scoringObj.tenureScaleType == this.loanAmountObj.id
        || this.scoringObj.pfScaleType == this.loanAmountObj.id) {
        if (!this.checkLoanAmountRange(this.scoringObj.loanAmountGradingList)) {
          isValid = false;
        }

      }

      if (this.scoringObj.marginScaleType == this.tenureObj.id
        || this.scoringObj.roiScaleType == this.tenureObj.id
        || this.scoringObj.tenureScaleType == this.tenureObj.id
        || this.scoringObj.pfScaleType == this.tenureObj.id) {
        if (!this.checkTenureScalingValidation(this.scoringObj.tenureGradingList, 1)) {
          isValid = false;
        }
      }


      if (this.commonService.isObjectNullOrEmpty(this.baseRate)) {
        if (showMsg) {
          this.commonService.warningSnackBar('Please create or approved REPO/MCLR.');
        }
        isValid = false;
      }
    }
    if (!this.commonService.isObjectNullOrEmpty(this.scoringObj.minimumScore)) {
      if (this.totalScore < this.scoringObj.minimumScore) {
        if (showMsg) {
          this.commonService.warningSnackBar('Minimum Score should be less then ' + this.totalScore + ' .');
        }
        isValid = false;
      }

    }

    // if (this.businessTypeId === Constants.businessType.EDUCATION_LOAN || this.businessTypeId === Constants.businessType.HOME_LOAN) {
    if (!this.commonService.isObjectNullOrEmpty(this.scoringObj.minimumScore)) {
      if (this.totalScoreCoApp < this.scoringObj.minimumScoreCoApp) {
        if (showMsg) {
          this.commonService.warningSnackBar('Minimum Score should be less then ' + this.totalScoreCoApp + ' .');
        }
        isValid = false;
      }

    }
    // }
    return isValid;
  }
  saveScoringData(): boolean {

    if (!this.isValidScaling(true)) {
      this.savedScallingEvent.emit('notSaved');
      return false;
    }

    // console.log(this.scalingForm.value.foirBasedOn);
    this.scoringObj.productId = this.productId;
    this.scoringObj.isMandatory = true;
    this.scoringObj.productId = this.productId;
    let name ;

    this.scoringModelList.filter(element => {
      if (element.id == this.scoringObj.scoringModelId) {
        name = element.name;
      }
    });

    
    this.scoringObj.scoringModelName = name;
    this.scoringObj.businessTypeId = this.businessTypeId;
    this.scoringObj.schemeId = this.schemeId;
    this.prodService.saveScalingMatrix(this.scoringObj).subscribe(res => {
      if (this.commonService.isObjectNullOrEmpty(res) || this.commonService.isObjectNullOrEmpty(res.data)) {
        this.commonService.errorSnackBar('Something went wrong.');

      } else {
        if(this.object=='saveScalingForApprovel'){
          this.savedScallingEvent.emit('scalingApprovel');
        }else{
          this.savedScallingEvent.emit('scalingSaved');
        }
       
      }

      // this.getApprovalFlag();
      return true;
    }, error => {
      this.commonService.errorSnackBar(error);
    });
    return true;
  }
  numberOnlyForScalling(event): boolean {
    const charCode = (event.which) ? event.which : event.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
      return false;
    }
    return true;

  }
  checkRange(inputValue: any, maxRange: any) {
    this.maxScoringRange = maxRange;
    if (inputValue < 0) {
      this.commonService.warningSnackBar('Value should be greater then 0.');
      this.showActionButtons = false;
    } else if (inputValue > maxRange) {
      this.commonService.warningSnackBar('Value should be less then ' + maxRange + ' .');
      this.showActionButtons = false;
    }
  }
  getScalingMatrix() {

    let request = { productId: this.productId };
    if (this.typeId == 5) {
      this.prodService.getScalingMatrixMaster(request).subscribe(res => {
        if (this.commonService.isObjectNullOrEmpty(res) || this.commonService.isObjectNullOrEmpty(res.data)) {
          this.commonService.errorSnackBar('Something went wrong.');
          return;
        }
        if (this.commonService.isObjectIsEmpty(res.data)) {
          // || this.commonService.isObjectNullOrEmpty(res.data.scoringModelId)
          return;
        }
        this.scoringObj = res.data;
        this.getBaseRate();
        this.scoringObj.noOfRange = 0;
        for (let i = 0; i < this.scoringModelList.length; i++) {
          if (this.scoringModelList[i].id == this.scoringObj.scoringModelId) {
            this.totalScore = this.scoringModelList[i].totalScore;
            // this.totalScoreCoApp = this.scoringModelList[i].totalScoreCoApp
            break;
          }
        }
        this.scoringObj.range = "0 -" + this.totalScore;
        if(this.scoringObj.isConfigureRoi==true){

          this.getRangeInfo();
        }
      }, error => {
        this.commonService.errorSnackBar(error);
      });
    } else {
      this.prodService.getScalingMatrix(request).subscribe(res => {
        // console.log("this.scoringObj::",  res)
        if (this.commonService.isObjectNullOrEmpty(res) || this.commonService.isObjectNullOrEmpty(res.data)) {
          this.commonService.errorSnackBar('Something went wrong.');
          return;
        }
        if (this.commonService.isObjectIsEmpty(res.data)) {
          // || this.commonService.isObjectNullOrEmpty(res.data.scoringModelId)
          return;
        }
        this.tmpScalingWithScoringObj = {};
        this.scoringObj = res.data;
        // console.log("this.scoringObj::::", this.scoringObj)
        this.getBaseRate();

        this.scoringObj.noOfRange = 0;
        for (let i = 0; i < this.scoringModelList.length; i++) {
          this.oldScoringId = this.scoringObj.scoringModelId;
          if (this.scoringModelList[i].id == this.scoringObj.scoringModelId) {
            this.totalScore = this.scoringModelList[i].totalScore;
            // this.totalScoreCoApp = this.scoringModelList[i].totalScoreCoApp
            break;
          }
        }
        // console.log("this.scoringObj",  this.scoringObj)
        this.scoringObj.range = "0 -" + this.totalScore;
        if (this.scoringObj.isNoScoring !== null) {
          this.addOrRemoveRisk(this.scoringObj.isNoScoring);
        }
        // this.getScoringUpdatedDetails(this.scoringObj)
        if(this.scoringObj.isConfigureRoi==true){

          this.getRangeInfo();
          
        this.validateScallingLoanAmount();
        }
        // this.getApprovalFlag();
      }, error => {
        this.commonService.errorSnackBar(error);
      });
    }
  }
  validateScallingLoanAmount() {
    if (!this.commonService.isObjectNullOrEmpty(this.scoringObj.loanAmountGradingList)&&!_.isEmpty(this.scoringObj.loanAmountGradingList)) {
      var len = this.scoringObj.loanAmountGradingList.length;
      if (this.scoringObj.loanAmountGradingList[0]?.minScore != this.minLoanAmount || this.scoringObj.loanAmountGradingList[len - 1]?.maxScore != this.maxLoanAmount) {
        this.scoringObj.loanAmountGradingList[0].minScore = this.minLoanAmount;
        this.scoringObj.loanAmountGradingList[len - 1].maxScore = this.maxLoanAmount;
        this.scoringObj.loanAmountGrading.range = this.scoringObj.loanAmountGradingList[0]?.minScore + ' - ' + this.scoringObj.loanAmountGradingList[this.scoringObj.loanAmountGradingList.length - 1].maxScore
      }
    }

  }
  getScoringUpdatedDetails(scoringObj?) {
    if (this.scoringObj.isNoScoring !== null && !this.scoringObj.isNoScoring) {
      this.prodService.getUpdatedScoringDetails(this.scoringObj.scoringModelId).subscribe(response => {
        if (!this.commonService.isObjectIsEmpty(response)) {
          if (!this.commonService.isObjectIsEmpty(response.dataObject)) {
            if (response.dataObject.isActive == true) {
              this.updatedDetails = response.dataObject;
            } else {
              this.updatedDetails = null;
            }
          }
        }
      });
    }

  }
  addGrossIncomeRange(obj, scaleType) {
    if (this.commonService.isObjectNullOrEmpty(obj)) {
      obj = [];
      obj.push({ minScore: this.minLoanAmount, maxScore: this.maxLoanAmount, scaleType: scaleType });
    }
    if (obj.length > 0) {
      obj[obj.length - 1].maxScore = (obj[obj.length - 1].maxScore) - 2;
      let tmp = obj[obj.length - 1];
      let val = tmp.maxScore;
      val++;
      obj.push({ minScore: val, maxScore: this.maxLoanAmount, scaleType: scaleType });
    } else {
      obj.push({ minScore: 0, maxScore: this.maximumIncome, scaleType: scaleType });
    }
    //this.scoringObj.riskScoringList.push({});
    this.getRangeInfo();
  }
  addTenureRange(obj, scaleType) {
    if (this.commonService.isObjectNullOrEmpty(obj)) {
      obj = [];
      obj.push({ minScore: this.minTenure, maxScore: this.maxTenure, scaleType: scaleType });
    }
    if (obj.length > 0) {
      obj[obj.length - 1].maxScore = (obj[obj.length - 1].maxScore) - 2;
      let tmp = obj[obj.length - 1];
      let val = tmp.maxScore;
      val++;
      obj.push({ minScore: val, maxScore: this.maxTenure, scaleType: scaleType });
    } else {
      obj.push({ minScore: 0, maxScore: this.maxTenure, scaleType: scaleType });
    }
    //this.scoringObj.riskScoringList.push({});
    this.getRangeInfo();
  }
  cleanOldGradingList() {
    // if (this.riskObj.id == this.scoringObj.marginScaleType) {
    //   this.scoringObj.netMonthlyGradingList = [];
    //   this.scoringObj.grossMonthlyGradingList = [];
    // } else if (this.grossIncomeObj.id == this.scoringObj.marginScaleType) {
    //   this.scoringObj.netMonthlyGradingList = [];
    // } else if (this.netIncomeObj.id == this.scoringObj.marginScaleType) {
    //   this.scoringObj.grossMonthlyGradingList = [];
    // }
  }
  saveScoringDataSendForApprovel(action: any): boolean {
    this.submitted = true;
    if (!this.isValidScaling(true)) {
      this.showActionButtons = false;
      this.savedScallingEvent.emit('failedSaved');
      return false;
    }
    // console.log(this.scalingForm.value.foirBasedOn);
    this.scoringObj.productId = this.productId;
    this.scoringObj.isMandatory = true;
    this.scoringObj.productId = this.productId;
    let name = '';
    this.scoringModelList.filter(element => {
      if (element.id == this.scoringObj.scoringModelId) {
        name = element.name;
      }
    });


    this.scoringObj.scoringModelName = name;
    this.scoringObj.businessTypeId = this.businessTypeId;
    this.scoringObj.schemeId = this.schemeId;
    this.prodService.saveScalingMatrix(this.scoringObj).subscribe(res => {
      if (this.commonService.isObjectNullOrEmpty(res) || this.commonService.isObjectNullOrEmpty(res.data)) {
        this.commonService.errorSnackBar('Something went wrong.');

      }else {
        this.savedScallingEvent.emit('scalingSaved');
      }

      // this.getApprovalFlag();
      // this.sendForApproval(action);
      return true;
    }, error => {
      this.commonService.errorSnackBar(error);
    });
    return true;
  }
  blurForMax(event, fieldList, type, value?): void {
    const numberText = event.target.value;
    if (type === 1) {
      if (Number(numberText) > this.maxTenure || Number(numberText) < this.minTenure) {
        this.commonService.warningSnackBar('Please enter tenure between' + this.minTenure + ' to ' + this.maxTenure);
        event.target.value = '';
        // fieldName=null;
        fieldList.forEach(element => {
          if (element.tenure == numberText) {
            element.tenure = '';
          }
        });

      }
    }
    if (type === 2) {
      if (Number(numberText) <= value) {
        this.commonService.warningSnackBar('Please enter max pf  greater then ' + value);
        event.target.value = '';
        // fieldName=null;
        fieldList.forEach(element => {
          if (element.maxPf == numberText) {
            element.maxPf = '';
          }
        });

      }
    }

  }
  setTenure() {
    this.minTenure = 1;
    this.maxTenure = 10;

  }
  getRangeInfo() {
    if (!this.commonService.isObjectNullOrEmpty(this.scoringObj)) {
      if (!this.commonService.isObjectNullOrEmpty(this.scoringObj.riskGradingList)&&!_.isEmpty(this.scoringObj.riskGradingList)) {
        this.scoringObj.riskGrading = {};
        this.scoringObj.riskGrading.noRange = this.scoringObj.riskGradingList.length;
        if (this.scoringObj.riskGradingList.length > 0) {
          this.scoringObj.riskGrading.range = this.scoringObj.riskGradingList[0].minScore + ' - ' + this.scoringObj.riskGradingList[this.scoringObj.riskGradingList.length - 1].maxScore;
        }
      }

      if (!this.commonService.isObjectNullOrEmpty(this.scoringObj.tenureGradingList)&&!_.isEmpty(this.scoringObj.tenureGradingList)) {
        this.scoringObj.tenureGrading = {};
        this.scoringObj.tenureGrading.noRange = this.scoringObj.tenureGradingList.length;
        if (this.scoringObj.tenureGrading.length > 0) {
          this.scoringObj.tenureGrading.range = this.scoringObj.tenureGradingList[0].minScore + ' - ' + this.scoringObj.tenureGradingList[this.scoringObj.tenureGradingList.length - 1].maxScore;
        }
      }


      if (!this.commonService.isObjectNullOrEmpty(this.scoringObj.loanAmountGradingList)&&!_.isEmpty(this.scoringObj.loanAmountGradingList)) {
        this.scoringObj.loanAmountGrading = {};
        this.scoringObj.loanAmountGrading.noRange = this.scoringObj.loanAmountGradingList.length;
        if (this.scoringObj.loanAmountGradingList.length > 0) {
          this.scoringObj.loanAmountGrading.range = this.scoringObj.loanAmountGradingList[0]?.minScore + ' - ' + this.scoringObj.loanAmountGradingList[this.scoringObj.loanAmountGradingList.length - 1].maxScore;
        }
        this.validateScallingLoanAmount();
      }
    }
  }



}
