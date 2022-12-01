import { DatePipe } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, ElementRef, EventEmitter, HostListener, Input, OnInit, Output, ViewChild } from '@angular/core';
import { NgbDate, NgbModal, NgbCalendar } from '@ng-bootstrap/ng-bootstrap';
import { Observable } from 'rxjs';
import { AdvancedService } from 'src/app/CommoUtils/common-services/advanced.service';
import {FoStatusDetails } from 'src/app/CommoUtils/common-services/Product-Scoring-Data/customers.model';
import { TnService } from 'src/app/services/tn.service';
import * as _ from 'lodash';
import alasql from 'alasql';
import { Router } from '@angular/router';
import { Constants } from 'src/app/CommoUtils/constants';
import { CommonService } from 'src/app/CommoUtils/common-services/common.service';

declare var $:any;

@Component({
  selector: 'app-bo-dashboard-list',
  templateUrl: './bo-dashboard-list.component.html',
  styleUrls: ['./bo-dashboard-list.component.scss'],
  providers: [DatePipe]
})
export class BODashboardListComponent implements OnInit {

  breadCrumbItems: Array<{}>;

  selectValue: string[];
  // Collapse declare
  isCollapsed: boolean;
  isCollapsed1: boolean;

  tab: number;
  tabA: number;
  tabR: number;
  tabRS: number;
  request: Request;
  isActive = false;
  debounceEventForFilter = _.debounce(() => this.getStatusList(), 500, {});

  // date Picker For to
  // Component DatePicker colorpicker
  componentcolor: string;

  hoveredDate: NgbDate;
  fromNGDate: NgbDate;
  toNGDate: NgbDate;

  hidden: boolean;
  selected: any;
  color: string;
  @Input() fromDate: Date;
  @Input() toDate: Date;
  @Output() dateRangeSelected: EventEmitter<{}> = new EventEmitter();

  @ViewChild('dp', { static: true }) datePicker: any;

  foStatusDetails: FoStatusDetails[];

  submitted: boolean;

  // page number
  page = 1;
  // default page size
  pageSize = 10;

  // start and end index
  startIndex = 1;
  endIndex = 10;
  totalSize = 0;

  PageSelectNumber: string[];

  total$: Observable<number>;

  totalCount = 0;
  totalNewApplDetlObj = 0;
  totalInProcessObj = 0;
  totalCompletedObj = 0;

  searchEmail: any;
  searchMobile: any;
  searchEntityName: any;

  dateRangeFromDate;
  dateRangeToDate;
  consentStatus: any;

  statusId;
  statusList: any=[];

  constructor(private eref: ElementRef, private modalService: NgbModal, calendar: NgbCalendar, public service: AdvancedService,
              private http: HttpClient, private tnService : TnService, private datePipe: DatePipe,private router: Router,
              private commonService:CommonService) {
    this.total$ = service.total$;
   }

  onPageChange(page: any): void {
    this.startIndex = (page - 1) * this.pageSize;
    // this.endIndex = (page - 1) * this.pageSize + this.pageSize;
    CommonService.removeStorage("isViewMode");
    this.getStatusList(true);
  }

  ngOnInit(): void {
    this.breadCrumbItems = [{ label: 'Dashboard', path: '/TIIC/Dashboard-List' },];
    this.selectValue = ['Alaska', 'Hawaii', 'California', 'Nevada', 'Oregon', 'Washington', 'Arizona', 'Colorado', 'Idaho', 'Montana', 'Nebraska', 'New Mexico', 'North Dakota', 'Utah', 'Wyoming', 'Alabama', 'Arkansas', 'Illinois', 'Iowa'];
    this.PageSelectNumber = ['5', '10', '25', '50', '100'];
    // date
    this.hidden = true;
    this.statusList = [{id:8, name:'New'}, {id:9, name:'In-Progress'}]

    this._fetchData();
    // tab
    this.tab = 1;
    if(!CommonService.isObjectNullOrEmpty(CommonService.getStorage(Constants.httpAndCookies.BO_DASHBOARD_TAB,true))){
      this.tab = +CommonService.getStorage(Constants.httpAndCookies.BO_DASHBOARD_TAB,true);
    }
    this.changeTab(this.tab);

    // Form 2 to Date piker
    // Component color value of color picker
    this.componentcolor = '#3bafda';

    this.selected = '';

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
  changeTab(tabId: number) {
    CommonService.setStorage(Constants.httpAndCookies.BO_DASHBOARD_TAB,tabId);
    this.clearFillter();
    this.tab = tabId;
    this.getStatusList();
  }

  private _fetchData() {
    // Data table
    // apply pagination
    this.startIndex = 0;
    this.endIndex = this.pageSize;

    this.tnService.getBoStatusCount().subscribe(res => {
      if(res && res.data) {
        this.totalNewApplDetlObj = res.data.newApplicantDetails?res.data.newApplicantDetails:0; 
        // this.totalInProcessObj = res.data.inProcess?res.data.inProcess:0;
        this.totalCompletedObj = res.data.completed?res.data.completed:0;
      }
    });
  }

  getStatusList(onPageChangeFlag?): void {
    if (!onPageChangeFlag) {
      this.resetStartIndex();
    }
    const filterJSON = {
      tabValue: this.tab,
      statusId: this.statusId? this.statusId : undefined,
      searchEntityName: this.searchEntityName ? this.searchEntityName : undefined,
      searchEmail: this.searchEmail ? this.searchEmail : undefined,
      searchMobile: this.searchMobile ? this.searchMobile : undefined,
      dateRangeFromDate: this.dateRangeFromDate ? this.getFormatedDate(this.dateRangeFromDate) : undefined,
      dateRangeToDate: this.dateRangeToDate ? this.getFormatedDate(this.dateRangeToDate) : undefined,
    };
  
    const data = { filterJSON: JSON.stringify(filterJSON), paginationFROM: this.startIndex, paginationTO: this.pageSize }
    this.tnService.getBoStatusList(data).subscribe(res => {
      this.foStatusDetails = [];
      if(res && !_.isEmpty(res.data)) {
        this.foStatusDetails = res.data;
        this.totalCount = res.data[0].totalCount;
        this.isCollapsed1? this.isCollapsed1= !this.isCollapsed1:"";
      }else{
        this.foStatusDetails =[];
      }
    });
  }

  getFormatedDate(date): any {
    if (date.toString().includes("-")) {
      const dateParts = date.split('-');
      const dateObj = new Date(+dateParts[2], dateParts[1] - 1, +dateParts[0]);
      return this.datePipe.transform(dateObj, 'y-MM-dd');
    } else {
      return this.datePipe.transform(date, 'y-MM-dd');
    }
  }

  getStringFormatedDate(date): any {
    return date ? (date.year + "-" + date.month + "-" + date.day) : undefined;
  }

  resetStartIndex(): void {
    this.startIndex = 0;
    this.page = 1;
  }

  clearFillter(clear?): void{
    this.statusId = undefined;
    this.searchEntityName = undefined;
    this.searchEmail = undefined;
    this.searchMobile = undefined;
    if(clear==1){
      this.isCollapsed1 = !this.isCollapsed1;
    }
    this.clearDateRange();
    // this.getStatusList();
  }

  clearDateRange(): void {
    this.selected = '';
    this.dateRangeFromDate = undefined;
    this.dateRangeToDate = undefined;
    this.fromNGDate = undefined;
    this.toNGDate = undefined;
  }

  downloadAllStatusUsers() {
    const filterJSON = {
      tabValue: this.tab,
      searchEntityName: this.searchEntityName ? this.searchEntityName : undefined,
      searchEmail: this.searchEmail ? this.searchEmail : undefined,
      searchMobile: this.searchMobile ? this.searchMobile : undefined,
    };
  
    const data = { filterJSON: JSON.stringify(filterJSON), paginationFROM: 0, paginationTO: this.totalCount }
    
    this.tnService.getBoStatusList(data).subscribe(res => {
      if(res && res.data) {
        this.downloadDataInExcel(res.data);
      }
    });
  }

  downloadDataInExcel(excelData) {
    let downloadData = [];
    const fileName = 'All-BO-Users' + '.xlsx';
    excelData.forEach((element, i) => {
      const index = i + 1;
      let allStatusFields;
      if(this.tab == 3){
        allStatusFields = [{
          'Sr no': index,
          'Name of Unit': element.entityName,
          'Email': element.email,
          'Mobile': element.mobile,
        }];
      }else{
        allStatusFields = [{
          'Sr no': index,
          'Name of Unit': element.entityName,
          'Email': element.email,
          'Mobile': element.mobile,
          'Status': element.status == 8 ? 'New' : (element.status == 9 ? 'In-Progress' : ''),
        }];
      }
      

      downloadData = downloadData.concat(allStatusFields);
    });
    alasql('SELECT * INTO XLSX("' + fileName + '",{headers:true}) FROM ?', [downloadData]);
  }

  // date picker js 
  onDateSelectionRange(date: NgbDate) {
    if (!this.dateRangeFromDate && !this.dateRangeToDate) {
      this.fromNGDate = date;
      this.dateRangeFromDate = new Date(date.year, date.month - 1, date.day);
      this.selected = '';
    } else if (this.dateRangeFromDate && !this.dateRangeToDate && date.after(this.fromNGDate)) {
      this.toNGDate = date;
      this.dateRangeToDate = new Date(date.year, date.month - 1, date.day);
      this.hidden = true;
      this.selected = this.datePipe.transform(this.dateRangeFromDate, 'dd/MM/y') + '-' + this.datePipe.transform(this.dateRangeToDate, 'dd/MM/y');
    } else {
      this.fromNGDate = date;
      this.dateRangeFromDate = new Date(date.year, date.month - 1, date.day);
      this.selected = '';
    }
  }

  /**
   * Is hovered over date
   * @param date date obj
   */
  isHovered(date: NgbDate) {
    return this.fromNGDate && !this.toNGDate && this.hoveredDate && date.after(this.fromNGDate) && date.before(this.hoveredDate);
  }

  /**
   * @param date date obj
   */
  isInside(date: NgbDate) {
    return date.after(this.fromNGDate) && date.before(this.toNGDate);
  }

  /**
   * @param date date obj
   */
  isRange(date: NgbDate) {
    return date.equals(this.fromNGDate) || date.equals(this.toNGDate) || this.isInside(date) || this.isHovered(date);
  }

  createProfile(customer,tabId){
    let profileCreationReq = {profileTypeId:1,consentId:customer.id,userId:customer.userId};
    this.tnService.createConsentProfile(profileCreationReq ).subscribe(profileSuccessRes =>{
        if(profileSuccessRes && profileSuccessRes.status == 200){
          const data: any = {};
          // data.loanTypeId = Constants.LoanType.EDUCATION_LOAN;
          data.loanTypeId = 1;
          data.schEligRespId = 0;
          data.schTypeId = 9;
          data.businessTypeId = 1;
          data.userId = customer.userId;
          data.profileId = profileSuccessRes.data ;
          data.campaignMasterId=1;
          //data.gstTypeId=this.data.gstTypeId;
          this.tnService.createLoan(data).subscribe(res => {
            if (res.status === 200 && res.data !== null) {
              let borrowerReq = { id: customer.id, profileId: profileSuccessRes.data };
              this.tnService.saveBorrowerData(borrowerReq).subscribe(res => {
                if (res && res.status == 200) {
                  customer.profileId = profileSuccessRes.data;
                  this.redirectToPage(customer, tabId);
                } else if (res && res.message) {
                  this.commonService.warningSnackBar(res.message);
                } else {
                  this.commonService.warningSnackBar('Failed to update data');
                }
              }, error => {
                this.commonService.warningSnackBar('Failed to update data', error);
              }) 
        }
        }, error => {
          this.commonService.errorSnackBar(error);
        });
        }else{
          this.commonService.warningSnackBar('Failed to create process');
        }
    },error => {
      this.commonService.warningSnackBar('Failed to create process');
    })
  }

  redirectToPage(customer,tabId){

    CommonService.setStorage(Constants.httpAndCookies.PROFILE_ID,customer.profileId);
    CommonService.setStorage(Constants.httpAndCookies.BORROWER_USER_ID,customer.userId);
    if(tabId == 1){
      let req = {
        borrowerProposalId:customer.id,
        status:9
      }
      this.tnService.updatePropsoalStatus(req).subscribe(success => {
        if(success && success.status == 200){
          this.router.navigate([Constants.ROUTE_URL.HO_BO_DATA_FILEDS], { queryParams: { id: CommonService.encryptFunction(customer.id) ,pid:CommonService.encryptFunction(customer.jobId)}});
          return;
        }
        this.commonService.warningSnackBar('Failed to update status');
      },_error =>{
        this.commonService.warningSnackBar('Failed to update status');
      });
    }else if(tabId == 2){
      if(customer.jobId){
        this.router.navigate([Constants.ROUTE_URL.HO_BO_DATA_FILEDS], { queryParams: { id: CommonService.encryptFunction(customer.id) ,pid:CommonService.encryptFunction(customer.jobId)}});
      }
    }else if(tabId == 3){
      CommonService.setStorage("isViewMode",true);
      if(customer.jobId){
        this.router.navigate([Constants.ROUTE_URL.HO_BO_DATA_FILEDS], { queryParams: { id: CommonService.encryptFunction(customer.id) ,pid:CommonService.encryptFunction(customer.jobId)}});
      }
    }
  }

  redirect(customer,tabId){

    if(!customer.profileId){
      this.createProfile(customer,tabId);
    }else{
      this.redirectToPage(customer,tabId);
    }
    
  }
}

