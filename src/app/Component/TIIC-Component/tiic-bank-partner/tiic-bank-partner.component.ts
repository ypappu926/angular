import { DatePipe } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, ElementRef, EventEmitter, HostListener, Input, OnInit, Output, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { NgbDate, NgbModal, NgbCalendar } from '@ng-bootstrap/ng-bootstrap';
import alasql from 'alasql';
import * as _ from 'lodash';
import { Observable } from 'rxjs';
import { AdvancedService } from 'src/app/CommoUtils/common-services/advanced.service';
import { CommonService } from 'src/app/CommoUtils/common-services/common.service';
import { BankUserDatas } from 'src/app/CommoUtils/common-services/Product-Scoring-Data/customers.model';
import { BankUserData } from 'src/app/CommoUtils/common-services/Product-Scoring-Data/dataCustomer';
import { Constants } from 'src/app/CommoUtils/constants';
import { TnService } from 'src/app/services/tn.service';

declare var $:any;

@Component({
  selector: 'app-tiic-bank-partner',
  templateUrl: './tiic-bank-partner.component.html',
  styleUrls: ['./tiic-bank-partner.component.scss'],
  providers: [DatePipe]
})
export class TIICBankPartnerComponent implements OnInit {

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
  debounceEventForFilter = _.debounce(() => this.getUserList(), 500, {});

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

  BankUserData: BankUserDatas[];

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

  searchValue: any;
  searchEmail: any;
  searchMobile: any;
  totalCount = 0;
  searchOrgName;
  searchUserName;
  orgList:any=[];

  dateRangeFromDate;
  dateRangeToDate;
  constructor(private datePipe: DatePipe, 
        public service: AdvancedService,
        private tnService : TnService, 
        private router: Router,
        private commonService: CommonService) {
    this.total$ = service.total$;
   }

  onPageChange(page: any): void {
    this.startIndex = (page - 1) * this.pageSize;
    // this.endIndex = (page - 1) * this.pageSize + this.pageSize;
    this.getUserList(true);
  }

  ngOnInit(): void {
    // , { label: 'Monitoring View', path: '/' }
    this.breadCrumbItems = [{ label: 'Dashboard', path: '/' , active: true}];
    this.selectValue = ['Alaska', 'Hawaii', 'California', 'Nevada', 'Oregon', 'Washington', 'Arizona', 'Colorado', 'Idaho', 'Montana', 'Nebraska', 'New Mexico', 'North Dakota', 'Utah', 'Wyoming', 'Alabama', 'Arkansas', 'Illinois', 'Iowa'];
    this.PageSelectNumber = ['5', '10', '25', '50', '100'];
    // date
    this.hidden = true;

    this._fetchData();
    // tab
    this.tab = 1;
    this.changeTab(1);

    // Form 2 to Date piker
    // Component color value of color picker
    this.componentcolor = '#3bafda';

    this.selected = '';
    this.getUserList();
    this.getOrgList();

  }

  getFormatedDate(date): any {
    // const dateParts = date.split('-');
    // const dateObj = new Date(+dateParts[2], dateParts[1] - 1, +dateParts[0]);
    // return this.datePipe.transform(dateObj, 'y-MM-dd');

    if (date.toString().includes("-")) {
      const dateParts = date.split('-');
      const dateObj = new Date(+dateParts[2], dateParts[1] - 1, +dateParts[0]);
      return this.datePipe.transform(dateObj, 'y-MM-dd');
    } else {
      return this.datePipe.transform(date, 'y-MM-dd');
    }

  }
  resetStartIndex(): void {
    this.startIndex = 0;
    this.page = 1;
  }
  updateIsLocked(user){
    let req={userId: user.userId,isLocked:user.isLocked=!user.isLocked}

    this.tnService.updateIsLocked(req).subscribe(res => {
      if (res.status === 200 ) {
        this.commonService.successSnackBar("Successfully updated User");
      } else {
        this.commonService.errorSnackBar("error while save or update user");
      }
    });
  }

  redirect(type?,user?){
    // routerLink="/TIIC/AddNew-BankPartner"
    if(type==1){
      this.router.navigate([Constants.ROUTE_URL.ADD_BANKER_PARTNER]);
    } 
    if(type==2){
      this.router.navigate([Constants.ROUTE_URL.ADD_BANKER_PARTNER], { queryParams: { id: CommonService.encryptFunction(user.userId) } });
    }
    if(type==3){
      this.router.navigate([Constants.ROUTE_URL.ADD_BANKER_PARTNER], { queryParams: { id: CommonService.encryptFunction(user.userId) ,isView: CommonService.encryptFunction(true) } });
    }
   
  }
clearFillter(clear?){
  this.searchEmail=null;
  this.searchMobile=null;
  this.searchOrgName=null;
  this.searchUserName=null;
  if(clear==1){
    this.isCollapsed1 = !this.isCollapsed1;
  }
  this.clearDateRange();
  this.getUserList();
}
clearDateRange(): void {
  this.selected = '';
  this.dateRangeFromDate = undefined;
  this.dateRangeToDate = undefined;
  this.fromNGDate = undefined;
  this.toNGDate = undefined;
}
onDateSelectionRange(date: NgbDate) {
  if (!this.dateRangeFromDate && !this.dateRangeToDate) {
    this.fromNGDate = date;
    this.dateRangeFromDate = new Date(date.year, date.month - 1, date.day);
    this.selected = '';
  } else if (this.dateRangeFromDate && !this.dateRangeToDate && date.after(this.fromNGDate)) {
    this.toNGDate = date;
    this.dateRangeToDate = new Date(date.year, date.month - 1, date.day);
    this.hidden = true;
    // this.selected = this.dateRangeFromDate.toLocaleDateString() + '-' + this.dateRangeToDate.toLocaleDateString();
    this.selected = this.datePipe.transform(this.dateRangeFromDate, 'dd/MM/y') + '-' + this.datePipe.transform(this.dateRangeToDate, 'dd/MM/y');
  } else {
    this.fromNGDate = date;
    this.dateRangeFromDate = new Date(date.year, date.month - 1, date.day);
    this.selected = '';
  }
}
  getOrgList(){
    this.tnService.getOrgList().subscribe(res=>{
      // console.log(res);
      if (res && res.listData) {
        // console.log(res.listData);
        this.orgList = res.listData;
      }
    })
  }

  downloadAllUser() {
    const filterJSON = {
      searchEmail: this.searchEmail ? this.searchEmail : undefined,
      searchMobile: this.searchMobile ? this.searchMobile : undefined,
      searchOrgName: this.searchOrgName ? this.searchOrgName : undefined,
      searchUserName: this.searchUserName ? this.searchUserName : undefined,
      fromDate:  this.dateRangeFromDate ? this.getFormatedDate(this.dateRangeFromDate) : undefined,
      toDate: this.dateRangeToDate ? this.getFormatedDate(this.dateRangeToDate) : undefined,
      searchValue: this.searchValue || undefined,
    };
    const data = { filterJSON: JSON.stringify(filterJSON), paginationFROM: 0, paginationTO: this.totalCount }

    this.tnService.getUserList(data).subscribe(res => {
      if (res && res.data) {
        this.downloadDataInExcel(res.data);
      }
    });
  }
  downloadDataInExcel(excelData) {
    let downloadData = [];
    const fileName = 'All-Bank-Partner' + '.xlsx';
    excelData.forEach((element, i) => {
      const index = i + 1;
      element.signupDate = this.datePipe.transform(element.signupDate, 'dd/MM/y');
      let allUser = [{
        'Sr no': index,
        'User Name': element.userName,
        'Bank Name': element.orgName,
        'Email': element.email,
        'Mobile': element.mobile,
      }];


      downloadData = downloadData.concat(allUser);
    });
    alasql('SELECT * INTO XLSX("' + fileName + '",{headers:true}) FROM ?', [downloadData]);
  }
  getUserList(onPageChangeFlag?){
    if (!onPageChangeFlag) {
      this.resetStartIndex();
    }
    const filterJSON = {
      searchEmail: this.searchEmail ? this.searchEmail : undefined,
      searchMobile: this.searchMobile ? this.searchMobile : undefined,
      searchOrgName: this.searchOrgName ? this.searchOrgName : undefined,
      searchUserName: this.searchUserName ? this.searchUserName : undefined,
      fromDate:  this.dateRangeFromDate ? this.getFormatedDate(this.dateRangeFromDate) : undefined,
      toDate: this.dateRangeToDate ? this.getFormatedDate(this.dateRangeToDate) : undefined,
      searchValue: this.searchValue || undefined,
    };
    // const data = { filterJSON: JSON.stringify(filterJSON), paginationFROM: this.startIndex, paginationTO: this.pageSize }
    const data = { filterJSON: filterJSON, paginationFROM: this.startIndex, paginationTO: this.pageSize }
    
    // console.log(data)
    this.tnService.getUserList(data).subscribe(res => {
      this.BankUserData = [];
      if (res && res.data) {
        // console.log(res.data);
        this.BankUserData = res.data;
        this.totalCount = res.data[0].totalCount;
        this.isCollapsed1? this.isCollapsed1= !this.isCollapsed1:"";
      }
    });
  }
   // Windi scroll Function
   @HostListener('window:scroll', ['$event'])
   onWindowScroll(e: any) {
     if (window.pageYOffset > window.innerHeight) {
       let element: any = document.getElementById('stick-headerN');
       element.classList.add('fix-to-top-2');
       this.adjustWidth();
     } else {
       let element: any = document.getElementById('stick-headerN');
       element.classList.remove('fix-to-top-2');
       //this.adjustWidthRemove();]
       // Fix After Remove Css
       let stickN: any = document.getElementById("stick-headerN");
       stickN.style.width = "100%"
     }
   }
 
   adjustWidth() {
     var parentwidth = $(".parent").width();
     $(".fix-to-top-2").width(parentwidth);
     console.log(parentwidth);
   }
   //  This js On Window Scroll Top set Cont Dont Remove @Nikul
  changeTab(tabId: number) {
    this.tab = tabId;
  }
  private _fetchData() {
    // Data table
    this.BankUserData = BankUserData;
    // apply pagination
    this.startIndex = 0;
    this.endIndex = this.pageSize;
  }
  // date picker js 
  onDateSelection(date: NgbDate) {
    if (!this.fromDate && !this.toDate) {
      this.fromNGDate = date;
      this.fromDate = new Date(date.year, date.month - 1, date.day);
      this.selected = '';
    } else if (this.fromDate && !this.toDate && date.after(this.fromNGDate)) {
      this.toNGDate = date;
      this.toDate = new Date(date.year, date.month - 1, date.day);
      this.hidden = true;
      this.selected = this.fromDate.toLocaleDateString() + '-' + this.toDate.toLocaleDateString();

      this.dateRangeSelected.emit({ fromDate: this.fromDate, toDate: this.toDate });

      this.fromDate = null;
      this.toDate = null;
      this.fromNGDate = null;
      this.toNGDate = null;

    } else {
      this.fromNGDate = date;
      this.fromDate = new Date(date.year, date.month - 1, date.day);
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
}

