import { Component, OnInit, Renderer2, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import * as _ from 'lodash';
import { Observable } from 'rxjs';
import { AdvancedService } from 'src/app/CommoUtils/common-services/advanced.service';
import { CommonService } from 'src/app/CommoUtils/common-services/common.service';
import { Constants } from 'src/app/CommoUtils/constants';
import { ScoringService } from 'src/app/services/scoring.service';
@Component({
  selector: 'app-scoring-add-new',
  templateUrl: './scoring-add-new.component.html',
  styleUrls: ['./scoring-add-new.component.scss']
})
export class ScoringAddNewComponent implements OnInit {
  @ViewChild('scoringForm') scoringForm: NgForm;
  total$: Observable<number>;

  // bread crumb data
  breadCrumbItems!: Array<{}>;
  scoringObj: any = {};
  configList: any = [];
  copyDataList: any;
  scoringDataList: any = {};
  roleId: number;
  scoringId: any;
  businessTypeId: number;
  schemeId: number;
  existingScoringCount: number;
  editMode: boolean;
  roles: any = [];
  routeMainPath: any;
  submitted = false;
  checkboxCheck = false;
  checkboxItrCheck = false;
  userPermissionList: any = [];
  public salariedBussinessType = [5, 9];
  responseEnum: any = [];
  resEnum: any = [];

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
  mId: number = 0;
  productData!: any[];
  type!: any[]
  idList = [];

  isConfig = false;

  constructor(private router: Router, private autoRenewal: ScoringService, private commonService: CommonService, public service: AdvancedService,
    private activatedRoute: ActivatedRoute,
    private renderer: Renderer2
  ) {
    this.roleId = Number(CommonService.getStorage(Constants.httpAndCookies.ROLEID, true));
    this.businessTypeId = 1
    // Number(CommonService.getStorage(Constants.httpAndCookies.BUSINESS_TYPE_ID, true));
    this.schemeId =9;
    //  Number(CommonService.getStorage(Constants.httpAndCookies.SCHEME_ID, true));
    this.router = router;
    this.total$ = service.total$;
    this.scoringId = CommonService.decryptFunction(this.activatedRoute.snapshot.queryParams.id);
    // this.scoringId = Number(commonService.toATOB(this.activatedRoute.snapshot.queryParams.id));
    this.existingScoringCount = 0;
    this.editMode = false;
    this.routeMainPath = 'TIIC';
    this.userPermissionList = _.split(CommonService.getStorage('UserPermission', true), ',');
  }
  ngOnInit() {
    this.breadCrumbItems = [{ label: 'Dashboard', path: '/' }, { label: 'Scoring Model', path: '/' }, { label: 'Add New Scoring', path: '/', active: true }];
    if (this.scoringId != null) {
      this.getScoringData();
    } else {
      // if (!this.salariedBussinessType.includes(Constants.businessType.BUSINESS_LOAN)) {
        this.getCopyList();
        this.getScoringConfignPara(this.businessTypeId, this.schemeId);
      }
    // }



  }

  checkButtonPermission(buttton: any): boolean {
    const index: number = this.userPermissionList.indexOf(buttton);
    if (index != -1)
      return true;
    else
      return false;
  }

  getExistingScoringCount(event: any, fieldId: any, enumValue: String) {

    if (this.resEnum) {
      for (const iterator of this.resEnum) {
        const index = _.findIndex(iterator.list, ['checked', true]);
        // console.log(iterator.enumName);
        if (iterator.enumName === enumValue) {
          if (index === -1) {
            const msg: HTMLElement = document.getElementById(iterator.enumName);
            this.renderer.setStyle(msg, 'display', 'block');
            break;
          } else {
            const msg: HTMLElement = document.getElementById(iterator.enumName);
            this.renderer.setStyle(msg, 'display', 'none');
            break;
          }
        }
      }
    }

    if (!event.target.checked) {
      const index: number = this.idList.indexOf(fieldId);
      if (index !== -1) {
        this.idList.splice(index, 1);
      }
    } else {
      if (enumValue === "BORROWER_TYPE") {
        this.idList.push(fieldId);
      }

    }

    let type = 0

    if (this.idList) {
      if (this.idList.includes(1)) {
        type = 1
      }
      if (this.idList.includes(2)) {
        type = 2
      }
      if (this.idList.includes(1) && this.idList.includes(2)) {
        type = 3
      }
    }

    this.autoRenewal.getExistingScoringCount(type, this.businessTypeId, this.schemeId).subscribe(success => {
      if (success.status === 200) {
        this.existingScoringCount = success.dataObject;
        this.scoringObj.copyScoreModelMstrId = null
        this.getCopyList();
      }
    }, function (error) {
      if (error.status == 401) {
        this.commonMethod.logoutUser();
      }
    });
  }

  getScoringData() {
    this.autoRenewal.getScoringData(this.scoringId,1).subscribe(success => {
      if (success.status === 200) {
        this.scoringObj = success.dataObject;
        this.scoringObj.remarks = 'editTime';
        this.editMode = true;
        this.data.scoringTypeTempResponses = this.scoringObj.configList;
        if (!this.commonService.isObjectNullOrEmpty(this.scoringObj.configList)) {
          this.scoringObj.configList.forEach(element => {
            this.idList.push(element.masterId);
          });
          this.editGetExistingScoringCount();

        }
        
        this.getScoringConfignPara(this.businessTypeId, this.schemeId);
      }
    }, function (error) {
      if (error.status == 401) {
        // this.commonMethod.logoutUser();
      }
    });
  }

  getCopyList() {
    let type = 0;
    this.autoRenewal.getCopyScoringList(this.businessTypeId, this.schemeId, type).subscribe(success => {
      if (success.status === 200) {
        this.copyDataList = success.dataObject;
        this.copyDataList.forEach((productElement: any) => {
          if (productElement.isActive) {
            productElement.statusIdString = "Active Scoring";
          } else {
            productElement.statusIdString = "In Active Scoring";
          }
        });
      }
    }, function (error) {
      if (error.status == 401) {
        // this.commonMethod.logoutUser();
      }
    });
  }

  saveScoringModel() {
    this.scoringObj.name = this.scoringObj.scoreModelName;

    if (this.resEnum) {
      for (const iterator of this.resEnum) {
        const index = _.findIndex(iterator.list, ['isChecked', true]);
        // console.log(iterator.enumName);
        if (index === -1) {
          const msg: HTMLElement = document.getElementById(iterator.enumName);
          this.renderer.setStyle(msg, 'display', 'block');
          this.commonService.warningSnackBar('Scoring configuration should not be null or empty');
          return;
        } else {
          const msg: HTMLElement = document.getElementById(iterator.enumName);
          this.renderer.setStyle(msg, 'display', 'none');
        }
      }
    }


    if (this.scoringForm.invalid) {
      this.submitted = false
      setTimeout(() => {
        this.submitted = true;
      }, 0);
      this.commonService.warningSnackBar('Required fields are missing');
      return;
    }


    if (this.scoringObj.name == null || this.commonService.isObjectNullOrEmpty(this.scoringObj.name.trim())) {
      this.commonService.warningSnackBar("Please enter Scoring name");
      return;
    }

    if (this.scoringId != null) {
      this.scoringObj.id = this.scoringId;
    }

    this.scoringObj.businessTypeId = this.businessTypeId;
    this.scoringObj.schemeId = this.schemeId;
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
    this.scoringObj.configList = this.configList;

    this.autoRenewal.saveScoringModel(this.scoringObj).subscribe(success => {
      if (success.status === 200) {
        this.commonService.successSnackBar("Scoring model created successfully")
        this.router.navigate([this.routeMainPath + '/Scoring-Edit', CommonService.encryptFunction(success.dataObject.id.toString()), CommonService.encryptFunction("1")]);
      }
    }, function (error) {
      if (error.status == 401) {
        this.commonMethod.logoutUser();
      }
    });

  }

  getScoringConfignPara(businessTypeId: number, schemeId: number) {
    this.autoRenewal.getScoringConfignPara(businessTypeId, schemeId).subscribe(response => {
      if (response.status === 200) {
        this.resEnum = response.dataObject;
        console.log(this.resEnum);
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

        }
      }
    });
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
        }
      });
      return;
    }
  }

  selectType(event: any, fieldId: any, type: String) {
    this.mId = fieldId;
    if (event.target.checked) {
      this.data.scoringTypeTempResponses.push({ masterId: this.mId, masterType: type });
    } else {
      this.data.scoringTypeTempResponses.splice(this.data.scoringTypeTempResponses.findIndex(a => a.id === fieldId), 1);
      this.responseEnum = _.cloneDeep(this.responseEnum);
    }
  }


  checked(id, type: String) {
    if (!this.commonService.isObjectNullOrEmpty(this.scoringObj.configList)) {
      const elements = this.scoringObj.configList.filter(res => res.masterType === type && res.masterId === id);
      return elements.length > 0;
    }
    return false;
  }

  editGetExistingScoringCount() {

    let type = 0

    if (this.idList) {
      if (this.idList.includes(1)) {
        type = 1
      }
      if (this.idList.includes(2)) {
        type = 2
      }
      if (this.idList.includes(1) && this.idList.includes(2)) {
        type = 3
      }
    }

    this.autoRenewal.getExistingScoringCount(type, this.businessTypeId, this.schemeId).subscribe(success => {
      if (success.status === 200) {
        this.existingScoringCount = success.dataObject;
        this.scoringObj.copyScoreModelMstrId = null
      }
    }, function (error) {
      if (error.status == 401) {
        this.commonMethod.logoutUser();
      }
    });
  }

}
