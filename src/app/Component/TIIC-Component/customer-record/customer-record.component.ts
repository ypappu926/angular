import { Component, OnInit, Input, Output, EventEmitter, ViewChild } from '@angular/core';
import { Constitutioncharttables, StateDatas } from 'src/app/CommoUtils/common-services/Product-Scoring-Data/customers.model';
import { Constitutioncharttable, StateData } from 'src/app/CommoUtils/common-services/Product-Scoring-Data/dataCustomer';
import { ChartType } from 'src/app/CommoUtils/common-services/apex.model';
import { lineColumAreaChart, NA_AR_NP_PieChartFIC, NA_AR_NP_PieChartSC } from 'src/app/CommoUtils/common-services/data';
import { Observable } from 'rxjs';
import { CommonMethods } from 'src/app/CommoUtils/common-services/common-methods';
import { DatePipe } from '@angular/common';
import alasql from 'alasql';
import * as _ from 'lodash';
import { CommonService } from 'src/app/CommoUtils/common-services/common.service';
import { TnService } from 'src/app/services/tn.service';
import { AppCustomerRecordScoringViewPopupComponent } from 'src/app/Popup/app-customer-record-scoring-view-popup/app-customer-record-scoring-view-popup.component';
import { AppCustomerRecordEligiblityViewPopupComponent } from 'src/app/Popup/app-customer-record-eligiblity-view-popup/app-customer-record-eligiblity-view-popup.component';
import { AppCustomerRecordParameterPopupComponent } from 'src/app/Popup/app-customer-record-parameter-popup/app-customer-record-parameter-popup.component';

@Component({
  selector: 'app-customer-record',
  templateUrl: './customer-record.component.html',
  styleUrls: ['./customer-record.component.scss']
})
export class CustomerRecordComponent implements OnInit {

  tab: any;
  isActive = false;
  // bread crumb items
  breadCrumbItems: Array<{}>;

  selectValue: string[];
  // Collapse declare
  isCollapsed: boolean = false;
  isViewed: boolean = false;
  isCollapsed1: boolean = true;
  isListCollapsed: boolean = true;
  // page number
  page = 1;
  pageEligible = 1;
  // default page size
  pageSize = 10;
  pageEligibleSize = 5;

  // start and end index
  startIndex = 1;
  startEligibleIndex = 1;
  endIndex = 10;
  endEligibleIndex = 5;
  totalSize = 0;
  totalRecords: any;
  PageSelectNumber!: string[];
  PageEligibleSelectNumber!: string[];
  total$!: Observable<number>;
  // date Picker For to
  // Component DatePicker colorpicker
  componentcolor: string;

  // hoveredDate: NgbDate;
  // fromNGDate: NgbDate;
  // toNGDate: NgbDate;

  hidden: boolean;
  selected: any;
  color: string;
  @Input() fromDate: Date;
  @Input() toDate: Date;
  @Output() dateRangeSelected: EventEmitter<{}> = new EventEmitter();
  @ViewChild('dp', { static: true }) datePicker: any;

  Constitutioncharttable: Constitutioncharttables[];
  StateData: StateDatas[];
  lineColumAreaChart: ChartType;
  NA_AR_NP_PieChartSC: ChartType;
  NA_AR_NP_PieChartFIC: ChartType;

  submitted: boolean;

  popUpObj: any = [];
  proposalId: any;
  schemeTypeId: any;
  applicationId: any;
  // customerRecordList: any = {};
  customerDetails: any;
  searchType: any;
  searchData;
  typeId = 1;
  eligibleAndInEligibleDetailsList: any;
  pageViewEligibleAndInEligibleDetailsList: any;
  eligibilityCalculationsDetails: any;
  rowDataPagination: any = [];
  rowDataEligiblePagination: any = [];
  totalData: any;
  totalEligibleData: any;
  userPersonalDetails;
  reqData: any = {
    toDate: new Date(), fromDate: new Date(), businessTypeId: null,
    noPagination: null, paginationFROM: null, paginationTO: null
  };
  adminPermissionList: any = [];
  constructor(private commonService: CommonService,
    private commonMethod: CommonMethods,
    private datePipe: DatePipe,
    private tnService: TnService,) {
  }

  proposalData: any = [];
  searchMachesApplication;
  searchList: any = [];
  isSearch: boolean = false;
  onFirstDataRendered(params) {
    params.api.forEachNode(function (node) {
      node.setExpanded(node.id === '1');
    });
  }
  customerRecord: any;
  ngOnInit(): void {
    this.breadCrumbItems = [{ label: 'Dashboard', path: '/' }, { label: 'Reports', path: '/', active: true }];
    this.selectValue = ['Working Capital Term Loan', 'Working Capital Term Loan', 'Term Loan'];
    this.PageSelectNumber = ['5', '10', '25', '50', '100'];
    this.PageEligibleSelectNumber = ['5', '10', '25', '50', '100'];
    // date
    this.hidden = true;
    this._fetchData();
    this.searchType = [
      { id: 1, value: 'Application Id' },
      { id: 2, value: 'Application Code' },
      { id: 3, value: 'Email- Id' },
      { id: 4, value: 'Mobile' },
    ];
    this.adminPermissionList = _.split(CommonService.getStorage('AdminPermission', true), ',');
    // this.searchBtnData();
  }

  getPaginationData(): void {
    // this.customerRecordList = this.rowDataPagination.slice(((this.page - 1) * this.pageSize), (this.page * this.pageSize));
    this.startIndex = ((this.page - 1) * this.pageSize) + 1;
    this.endIndex = (this.page * this.pageSize);
    if (this.totalData < this.endIndex) {
      this.endIndex = this.totalData;
    }
  }

  getEligiblityPaginationData(isCheck?): void {
    if (isCheck) {
      this.eligibleAndInEligibleDetailsList = this.searchList.slice(((this.pageEligible - 1) * this.pageEligibleSize), (this.pageEligible * this.pageEligibleSize));
    } else {
      this.eligibleAndInEligibleDetailsList = this.rowDataEligiblePagination.slice(((this.pageEligible - 1) * this.pageEligibleSize), (this.pageEligible * this.pageEligibleSize));
    }
    this.startEligibleIndex = ((this.pageEligible - 1) * this.pageEligibleSize) + 1;
    this.endEligibleIndex = (this.pageEligible * this.pageEligibleSize);
    if (this.totalEligibleData < this.endEligibleIndex) {
      this.endEligibleIndex = this.totalEligibleData;
    }
  }

  
  searchBtnData() {
    if (this.commonService.isObjectNullOrEmpty(this.typeId) || this.commonService.isObjectNullOrEmpty(this.searchData)) {
      this.commonService.warningSnackBar("Please select Type Or Enter Value");
      return;
    }
    this.getUserDetailsList();
    this.getCustomerRecord()
  }

  getCustomerRecord() { 
    // console.log();
     
    // this.customerRecordList = [];
    const data = {
      typeId: this.typeId,
      searchValue: this.searchData,
    }
    this.tnService.getCustomerRecord(data).subscribe(res => {
      if (res && res.data && res.status == 200) {
        this.customerRecord = JSON.parse(res.data);
        // console.log("==============>", this.customerRecord);
        // this.rowDataPagination = this.customerRecordList;
        this.totalData = this.customerRecord.length;
        // this.getUserPersonalDetails(this.customerRecord.userId);

        // this.getPaginationData();
      } else {
        this.commonService.warningSnackBar("No data Found");
      }
    }, error => {
      this.commonService.errorSnackBar(error);
    });
      }

    getCustomerDetails(proposalId,isViewed) {
    const data = {
         proposalId: proposalId,      
    //   schemeTypeId: schemeTypeId,
     //  applicationId: applicationId,
    }
    this.proposalId = proposalId;
    // this.schemeTypeId = schemeTypeId;
    // this.applicationId = applicationId;
     if (isViewed) {
       this.tnService.getCustomerDetails(data).subscribe(res => {
         if (res && res.data && res.status == 200) {
           this.customerDetails = JSON.parse(res.data);          
         }
       }, error => {
         this.commonService.errorSnackBar(error);
       });
      //  this.getEligibleAndInEligibleResponse(proposalId,applicationId);
     }
  }

  getEligibleAndInEligibleResponse(proposalId, applicationId, isOpen?:any) { 
    // console.log("getEligibleAndInEligibleResponse.");       
    const data = {
      proposalId: proposalId,
      applicationId: applicationId,
      // schemeTypeId: schemeTypeId,
    } 
    if(isOpen){
      this.tnService.getEligibleAndInEligibleResponse(data).subscribe(success => {
        this.eligibleAndInEligibleDetailsList = [];
        // console.log("res",success)
        if (success && success.data && success.status == 200) {
          this.eligibleAndInEligibleDetailsList = JSON.parse(success.data);
          this.rowDataEligiblePagination = JSON.parse(success.data);
          this.totalEligibleData = this.eligibleAndInEligibleDetailsList.length;
          this.getEligiblityPaginationData();
        }
      }, (error) => {
        this.commonService.errorSnackBar(error);
      });
    }
  }

  getScoringCalculationsDetails(applicationId, productId, isNoScoring) {

    if (!isNoScoring) {
      this.commonService.warningSnackBar("No Scoring");
      return;
    }
    const config = {
      windowClass: 'Mediam-model',
      size: 'xl'
    };
    if (this.commonService.isObjectNullOrEmpty(applicationId) || this.commonService.isObjectNullOrEmpty(productId)) {
      this.commonService.warningSnackBar("productId is Null");
      return;
    }
    const data = {
      applicationId: applicationId,      
      productId: productId,
    };
    this.tnService.getScoringCalculationsDetails(data).subscribe(res => {
      // console.log(res);
      if (res && res.data && res.status == 200) {
        this.commonService.openPopUp(res.data, AppCustomerRecordScoringViewPopupComponent, false, config).result.then(result => { }, (reason) => { });
      } else  {
        // if (res && res.status == 204)
        this.commonService.warningSnackBar("No Data Found");
      }
    }, error => {
      this.commonService.errorSnackBar("Something Went Wrong");
    });
  }  

  getEligibilityCalculationsDetails(applicationId, productId) {
    const config = {
      windowClass: 'Mediam-model',
      size: 'xl'
    };
    const data = {
      applicationId: applicationId,
      productId: productId,
      // schemeTypeId: schemeTypeId,
    };
    this.tnService.getEligibilityCalculationsDetails(data).subscribe(res => {
      if (res && res.data && res.status == 200) {
        this.popUpObj = JSON.parse(res.data);
        this.commonService.openPopUp(this.popUpObj, AppCustomerRecordEligiblityViewPopupComponent, false, config).result.then(result => { }, (reason) => { });
      } else {
        this.commonService.warningSnackBar("No Record Found");
      }
    });
  }
  getAppProdMatchesData(proposalId, applicationId, productId) {
    const config = {
      windowClass: 'Mediam-model',
      size: 'xl'
    };
    const data = {
      proposalId: proposalId,
      applicationId: applicationId,
      productId: productId,
      // schemeTypeId: schemeTypeId,
    };
    this.tnService.getAppProdMatchesData(data).subscribe(res => {
      if (res && res.data) {
        this.popUpObj = JSON.parse(res.data);
        this.commonService.openPopUp(this.popUpObj, AppCustomerRecordParameterPopupComponent, false, config).result.then(result => { }, (reason) => { });
      } else {
      this.commonService.warningSnackBar("No Record Found");
    }
    }, error => {
      this.commonService.errorSnackBar("Something Went Wrong");
    });
  }

  // getAppProdMatchesData(proposalId, applicationId, productId) {
  //   const config = {
  //     windowClass: 'Mediam-model',
  //     size: 'xl'
  //   };
  //   const data = {
  //     proposalId: proposalId,
  //     applicationId: applicationId,
  //     productId: productId,
  //     // schemeTypeId: schemeTypeId,
  //   };
  //   this.tnService.getAppProdMatchesData(data).subscribe(res => {
  //     if (res && res.data) {
  //       this.popUpObj = JSON.parse(res.data);
  //       this.commonService.openPopUp(this.popUpObj, AppCustomerRecordParameterPopupComponent, false, config).result.then(result => { }, (reason) => { });
  //     }
  //   }, error => {
  //     this.commonService.errorSnackBar("Something Went Wrong");
  //   });
  // }

  getUserDetailsList() {
    const data = {
      typeId: this.typeId,
      searchValue: this.searchData,
    }
    this.tnService.getUserDetailsList(data).subscribe(res => {
      if (res && res.data != null) {
        this.userPersonalDetails = JSON.parse(res.data);
        // console.log(this.userPersonalDetails);
      }
    });
  }

  // lockUnlockUser(userId, isLock) {
  //   const data = {
  //     userId: userId,
  //     isLocked: isLock,
  //   };
  //   this.tnService.lockUnlockUser(data).subscribe(res => {
  //     if (res) {
  //       this.getUserDetailsList();
  //     }
  //   });
  // }

  // userResetPassword(userId) {
  //   const data = {
  //     userId: userId,
  //   };
  //   this.tnService.userResetPassword(data).subscribe(res => {
  //     if (res) {
  //       this.getUserDetailsList();
  //       this.commonService.successSnackBar(res.message);
  //     } else {
  //       this.commonService.warningSnackBar(res.message);
  //     }
  //   });
  // }

  private _fetchData() {
    // Data table
    this.Constitutioncharttable = Constitutioncharttable;
    this.StateData = StateData;
    this.lineColumAreaChart = lineColumAreaChart;
    this.NA_AR_NP_PieChartSC = NA_AR_NP_PieChartSC;
    this.NA_AR_NP_PieChartFIC = NA_AR_NP_PieChartFIC;
  }

  copyToClipBoard(data) {
    this.commonMethod.copyToClipBoard(data);
  }

  downloadAll() {
    // const data = {
    //   proposalId: this.proposalId,
    //   applicationId: this.applicationId,
    //   schemeTypeId: this.schemeTypeId,
    // }
    // this.adminService.getEligibleAndInEligibleResponse(data).subscribe(res => {
    //   if (res && res.data && res.status == 200) {
    //     this.proposalData = JSON.parse(res.data);
    //     this.downloadDataInExcel();
    //   } else {
    //     this.commonService.warningSnackBar("No records available.")
    //   }
    // });
  }

  dateFormateForExcel(date) {
    return this.datePipe.transform(date, 'yyyy-MM-dd');
  }

  downloadDataInExcel() {
    let downloadData = [];
    const fileName = this.applicationId + '-Reason' + '.xlsx';
    this.proposalData.forEach((element, i) => {
      const index = i + 1;
      var allApplications = [{
        Sr_no: index,
        BankName: element.organisationName,
        ProductName: element.productName,
        createdDate: element.createdDate,
        productActive: element.productActive,
        loanAmount: element.elLoanAmount,
        Tenure: element.elTenure,
        roi: element.elRoi,
        fees: element.elProcessingFee,
        foir: element.margin,
        score: element.score,
        message: element.eligibilityReason
      }];
      downloadData = downloadData.concat(allApplications);
    });
    alasql('SELECT * INTO XLSX("' + fileName + '",{headers:true}) FROM ?', [downloadData]);
  }

  checkAdminPermission(button: any): boolean {
    const index: number = this.adminPermissionList.indexOf(button);
    if (index != -1) {
      return true;
    } else {
      return false;
    }
  }

  resetPageSize() {
    this.pageEligible = 1;
    this.pageEligibleSize = 5;
  }

  // *ngIf="isDownloadFile(customerRecord)"

  // isDownloadFile(customerRecord): boolean {
  //   if (((customerRecord.stageId == Constants.JOURNEY_COMPLETED_STAGE.EDU) && ((customerRecord.schemeId == Constants.SCHEME.CSIS) || (customerRecord.schemeId == Constants.SCHEME.PADHO) || (customerRecord.schemeId == Constants.SCHEME.DR_AMBEDKAR))) ||
  //     ((customerRecord.stageId == Constants.JOURNEY_COMPLETED_STAGE.HOME) && (customerRecord.schemeId == Constants.SCHEME.HOME)) ||
  //     ((customerRecord.stageId == Constants.JOURNEY_COMPLETED_STAGE.MSME) && ((customerRecord.schemeId == Constants.SCHEME.SWMS) || (customerRecord.schemeId == Constants.SCHEME.MUDRA) || (customerRecord.schemeId == Constants.SCHEME.SRMS) || (customerRecord.schemeId == Constants.SCHEME.STAND_UP) || (customerRecord.schemeId == Constants.SCHEME.PMEGP) || (customerRecord.schemeId == Constants.SCHEME.PM_SVANIDHI))) ||
  //     ((customerRecord.stageId == Constants.JOURNEY_COMPLETED_STAGE.AGRI) && ((customerRecord.schemeId == Constants.SCHEME.ACABC) || (customerRecord.schemeId == Constants.SCHEME.AMI) || (customerRecord.schemeId == Constants.SCHEME.AIF))) ||
  //     ((customerRecord.stageId == Constants.JOURNEY_COMPLETED_STAGE.LIVELIHOOD) && ((customerRecord.schemeId == Constants.SCHEME.NULM) || (customerRecord.schemeId == Constants.SCHEME.NRLM)))) {
  //     return true;
  //   }
  //   return false;
  // }

  // Download_File(downloadData) {
  //   if (this.isDownloadFile(downloadData)) {
  //     const config = {
  //       windowClass: 'Mediam-model',
  //       size: 'lg'
  //     };
  //     const data = {
  //       applicationId: downloadData.applicationId,
  //       proposalId: downloadData.proposalId,
  //       profileId: downloadData.profileId,
  //       schemeId: downloadData.schemeId,
  //       coAppIds: downloadData.coAppIds,
  //     }
  //     this.commonService.openPopUp(data, DownloadFileComponent, false, config).result.then(result => { }, (reason) => { });
  //   } else {
  //     this.commonService.warningSnackBar("Please Complete Journey");
  //   }

  // }

  searchMachesList() {
    this.eligibleAndInEligibleDetailsList = [];
    if (!this.commonService.isObjectNullOrEmpty(this.searchMachesApplication)) {
      this.eligibleAndInEligibleDetailsList = this.rowDataEligiblePagination.filter(res => JSON.stringify(res).toLowerCase().includes(this.searchMachesApplication.toLowerCase()));
      this.eligibleAndInEligibleDetailsList = this.rowDataEligiblePagination.filter(res => JSON.stringify(res.organisationName).toLowerCase().includes(this.searchMachesApplication.toLowerCase()));  // organisationName  productName
      this.totalEligibleData = this.eligibleAndInEligibleDetailsList.length;
      this.searchList = this.eligibleAndInEligibleDetailsList;
      this.isSearch = true;
      this.resetPageSize();
      this.getEligiblityPaginationData(true);
    } else {
      this.eligibleAndInEligibleDetailsList = this.rowDataEligiblePagination;
      this.totalEligibleData = this.rowDataEligiblePagination.length;
      this.isSearch = false;
      this.getEligiblityPaginationData();
    }
  }


  // createBorrower() {
  //   const config = {
  //     // windowClass: 'popup_NP_100',
  //     size: 'md'
  //   };
  //   this.commonService.openPopUp(null, CreateBorrowerUserComponent, false, config).result.then(result => { }, (reason) => { });
  // }

  downloadAllList() {
    let downloadData = [];
    const fileName = 'Proposal List' + '.xlsx';
    this.rowDataPagination.forEach((element, i) => {
      const index = i + 1;
      const allApplications = [{
        Sr_no: index,
        'Application Code': element.applicationCode || undefined,
        'Applicant Name': element.stageName || undefined,
        'Bank Name': element.name || undefined,
        'Loan Type': element.loanType || undefined,
        'Scheme Type': element.schemeType || undefined,
      }];
      downloadData = downloadData.concat(allApplications);
    });
    alasql('SELECT * INTO XLSX("' + fileName + '",{headers:true}) FROM ?', [downloadData]);
  }

}
// function CustomerRecordScoringViewPopupComponent(data: any, CustomerRecordScoringViewPopupComponent: any, arg2: boolean, config: { windowClass: string; size: string; }) {
//   throw new Error('Function not implemented.');
// }

// function CustomerRecordEligiblityViewPopupComponent(popUpObj: any, CustomerRecordEligiblityViewPopupComponent: any, arg2: boolean, config: { windowClass: string; size: string; }) {
//   throw new Error('Function not implemented.');
// }

// function CustomerRecordParameterPopupComponent(popUpObj: any, CustomerRecordParameterPopupComponent: any, arg2: boolean, config: { windowClass: string; size: string; }) {
//   throw new Error('Function not implemented.');
// }

// function DownloadFileComponent(data: { applicationId: any; proposalId: any; profileId: any; schemeId: any; coAppIds: any; }, DownloadFileComponent: any, arg2: boolean, config: { windowClass: string; size: string; }) {
//   throw new Error('Function not implemented.');
// }

function CreateBorrowerUserComponent(_arg0: null, _CreateBorrowerUserComponent: any, _arg2: boolean, _config: {
  // windowClass: 'popup_NP_100',
  size: string;
}) {
  throw new Error('Function not implemented.');
}

