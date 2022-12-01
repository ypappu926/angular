import { Component, OnInit } from '@angular/core';
import { Customers } from '../../../../CommoUtils/common-services/Product-Scoring-Data/customers.model';
import { NgbModal, NgbModalConfig } from '@ng-bootstrap/ng-bootstrap';
import { Observable } from 'rxjs';
import { AdvancedService } from '../../../../CommoUtils/common-services/advanced.service';
import { Router } from '@angular/router';
import { CommonService } from 'src/app/CommoUtils/common-services/common.service';
import { Widget } from 'src/app/CommoUtils/common-services/Product-Scoring-Data/default.model';
import { SnackbarService } from 'src/app/CommoUtils/common-services/SnackbarService';
import * as _ from 'lodash';
import { Constants } from 'src/app/CommoUtils/constants';
import { ScoringService } from 'src/app/services/scoring.service';
import { ScoringCommonComponent } from 'src/app/Popup/Product-Scoring/scoring-common/scoring-common.component';
import { ComConfimConfigurationComponent } from 'src/app/Popup/Product-Scoring/com-confim-configuration/com-confim-configuration.component';


@Component({
  selector: 'app-com-scoring-list',
  templateUrl: './com-scoring-list.component.html',
  styleUrls: ['./com-scoring-list.component.scss']
})
export class ComScoringListComponent implements OnInit {

  // bread crumb items
  breadCrumbItems!: Array<{}>;
  productCategory: any;
  widgetData!: Widget[];
  currentDate = new Date();
  submitted!: boolean;

  // page number
  page = 1;
  // default page size
  pageSize = 10;

  // start and end index
  startIndex = 1;
  endIndex = 10;
  totalSize = 0;
  totalRecords: any;
  PageSelectNumber!: string[];
  total$!: Observable<number>;

  tab!: number;
  request!: Request;
  isActive = false;
  activateTab!: number;
  selectedTabDetails: any;
  routeMainPath: any;
  selectValue!: string[];

  scoringModelList: any = [];
  scoringModelListPagination: any = [];
  public roleId: number;
  businessTypeId: number;
  schemeId: number;
  public roles: any = {};
  userPermissionList: any = [];
  isCheker = false;
  intervalTvalue : any ;
  constructor(
    public NPconfig: NgbModalConfig,
    private modalService: NgbModal,
    public service: AdvancedService,
    private router: Router,
    private autoRenewal: ScoringService,
    private snackbar: SnackbarService,
    private commonService: CommonService) {
    NPconfig.backdrop = 'static';
    this.total$ = service.total$;
    this.roleId =  Number(CommonService.getStorage(Constants.httpAndCookies.ROLEID, true));
    // console.log("rol/eId::",this.roleId);
    this.businessTypeId = 1;
    Number(CommonService.getStorage(Constants.httpAndCookies.BUSINESS_TYPE_ID, true));
    // this.schemeId = Number(CommonService.getStorage(Constants.httpAndCookies.SCHEME_ID, true));
    this.schemeId = 9;
    this.routeMainPath = 'TIIC';
    this.roles =  this.commonService.getConstant().UserRoleList;
    // this.roles=this.commonService.getConstant().UserRoleList;
    this.userPermissionList = _.split(CommonService.getStorage('UserPermission', true), ',');
    // console.log(this.userPermissionList);
  }

  ngOnInit(): void {
    this.breadCrumbItems = [{ label: 'Dashboard', path: this.routeMainPath + '/dashboard' }, { label: 'Scorign List', path: '/', active: true }];
    // this.selectValue = ['Working Capital Term Loan', 'Working Capital Term Loan', 'Term Loan'];

    // default tabe select
    this.activateTab = 0;
    // this.selectedTabDetails(0);
    /**
     * fetches data
     */
    this.getScoringCount();
    this.getBusinessType(this.businessTypeId);

    this.setIntervalforScoringCount();
    if (this.roleId === Constants.UserRoleList.ADMIN_CHECKER.id) {
      this.isCheker = true;
    }

  }

  ngOnDestroy() {
    clearInterval(this.intervalTvalue);
  }

  setIntervalforScoringCount() {
    this.intervalTvalue =setInterval(() => {
      this.getScoringCount(); 
    }, 60000);
  }

  checkButtonPermission(buttton: any): boolean {
    const index: number = this.userPermissionList.indexOf(buttton);
    if (index != -1)
      return true;
    else
      return false;
  }
  getScoringCount() {
    this.autoRenewal.getScroringCount(this.businessTypeId, this.schemeId).subscribe(success => {
      if (success.status === 200) {
        this.widgetData = success.dataObject;
        if (this.roleId === this.roles.ADMIN_MAKER.id) {
          this.activateTab = 2;
        } else {
          this.activateTab = 1;
        }
        this.getScoringListByStatus(this.activateTab);
      }
    }, function (error: any) {
      if (error.status == 401) {
        // this.commonMethod.logoutUser();
      }
    });
  }

  getScoringListByStatus(index: any) {
    let status = 1;
    this.activateTab = index;
    if (this.activateTab == 1) {
      status = 3;
    } else if (this.activateTab == 2) {
      status = 1;
    } else if (this.activateTab == 3) {
      status = 2;
    } else if (this.activateTab == 4) {
      status = 4;
    } else if (this.activateTab == 5) {
      status = 0;
    }
    this.autoRenewal.getScroringList(status, this.businessTypeId, this.schemeId).subscribe(success => {
      if (success.status === 200) {
        this.scoringModelList = success.dataObject;
        this.scoringModelListPagination = this.scoringModelList;
        this.totalRecords = this.scoringModelList.length;
      }
    }, function (error) {
      if (error.status == 401) {
        // this.commonMethod.logoutUser();
      }
    });
  }


  /**
 * paginatio onchange event
 * @param page page
 */
  onPageChange(page: any): void {
    this.startIndex = (page - 1) * this.pageSize;
    this.endIndex = (page - 1) * this.pageSize + this.pageSize;
  }

  activeClick(index: any, item: any) {
    this.activateTab = index;
    this.getScoringListByStatus(this.activateTab);
    this.selectedTabDetails = item;
  }

  deleteScoring(scoringModelId: any) {
    let data: any = {};
    data.type = 1;
    this.commonPopUp(data).then(result => {
      if (result === 'Ok') {
        this.autoRenewal.deleteScoringModel(scoringModelId).subscribe(success => {
          if (success.status === 200) {
            this.getScoringCount();
          }
        });
      };
    });
  }

  inActiveScoring(scoringModel: any, type: any) {
    let data: any = {};
    data.type = 8;
    data.name = scoringModel.name;
    data.title = type == 1 ? 'Deactivation' : 'Activation';
    this.commonPopUp(data).then(result => {
      if (result === 'Ok') {
        this.autoRenewal.inActiveScoringModel(scoringModel.id, type).subscribe(success => {
          if (success.status === 200) {
            this.getScoringCount();
          }
        });
      };
    });
  }

  commonPopUp(data: any) {
    const config = {
      windowClass: 'popup-650'
    };
    const modalRef = this.modalService.open(ScoringCommonComponent, config);
    modalRef.componentInstance.popUpObj = data;
    return modalRef.result;
  }

  openScoringModel(scoring: any, statusId: any, typeId: any) {
    let type = "1";
    let scoringId = scoring.id;
    if ((statusId == 6 || statusId == 5) && typeId === 1) {
      this.commonService.warningSnackBar("Your request is already sent to checker for approval. Hence you can not edit scoring model");
      return;
    }
    if (statusId == 3 || (statusId == 6 || statusId == 5)) {
      type = "2"
    }
    
    if (typeId == 1) {
      if (statusId == 3) {
        type = "1"
        scoringId = scoring.scoringModelTempId;
        const data = { type: 9 }
        this.commonPopUp(data).then(result => {
          if (result === 'Ok') {
            this.autoRenewal.updateScoringStatus(scoringId, Constants.ScoringStatusNew.SAVED).subscribe(success => {
              if (success.status === 200) {
                this.router.navigate([this.routeMainPath + '/Scoring-Edit', CommonService.encryptFunction(scoringId.toString()), CommonService.encryptFunction(type)]);
              }
            });
          }
        });
      } else {
        this.router.navigate([this.routeMainPath + '/Scoring-Edit', CommonService.encryptFunction(scoring.id), CommonService.encryptFunction(type)]);
      }
    } else {
      this.router.navigate([this.routeMainPath + '/Scoring-View', CommonService.encryptFunction(scoringId.toString()), CommonService.encryptFunction(type), CommonService.encryptFunction(this.activateTab.toString())]);
    }
  }

  getBusinessType(businessTypeId: any) {
    // this.productCategory = Constants.productCategory.filter((item) => item.id == businessTypeId)[0].name;
  }

  Confirm_scoring_Confiration_Popup(scoring: any, statusId: any, typeId: any) {
    if (scoring.isApproved) {
      this.commonService.warningSnackBar("You have already created version 2 for this scoring model");
      return false;
    }
    const config = {
      windowClass: 'Mediam-model',
    };
    const modalRef = this.modalService.open(ComConfimConfigurationComponent, config);
    modalRef.componentInstance.user = scoring;
    modalRef.componentInstance.statusId = statusId;
    modalRef.componentInstance.typeId = typeId;

    modalRef.componentInstance.currentObj = this;
    return modalRef;
  }
  toNewScoring() {
    this.router.navigate(['TIIC/Scoring-New']);
  }


}
