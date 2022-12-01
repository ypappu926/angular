import { Component, OnInit, Input, Output, EventEmitter, ViewChild, ElementRef, HostListener } from '@angular/core';
import { NgbDate, NgbModal, NgbCalendar } from '@ng-bootstrap/ng-bootstrap';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { AdvancedService } from 'src/app/CommoUtils/common-services/advanced.service';
import { BankUserDatas } from 'src/app/CommoUtils/common-services/Product-Scoring-Data/customers.model';
import { BankUserData } from 'src/app/CommoUtils/common-services/Product-Scoring-Data/dataCustomer';
import { TnService } from 'src/app/services/tn.service';
import { DatePipe } from '@angular/common';
import * as _ from 'lodash';
import alasql from 'alasql';
import { BMFIOReasonComponent } from 'src/app/Popup/BM-FIO/bm-fio-reason/bm-fio-reason.component';
import { BMFIOCommonProposalComponent } from 'src/app/Popup/BM-FIO/bm-fio-common-proposal/bm-fio-common-proposal.component';

declare var $: any;

@Component({
  selector: 'app-bu-all-user-list',
  templateUrl: './bu-all-user-list.component.html',
  styleUrls: ['./bu-all-user-list.component.scss']
})
export class BUAllUserListComponent implements OnInit {

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
  // @Output() dateRangeSelected: EventEmitter<{}> = new EventEmitter();

  @ViewChild('dp', { static: true }) datePicker: any;

  bankUserList = [];

  submitted: boolean;

  // page number
  page = 1;
  // default page size
  pageSize = 10;

  // start and end index
  startIndex = 1;
  // endIndex = 10;
  totalSize = 0;
  totalCount = 0;

  PageSelectNumber: string[];

  maxDate;

  dateRangeFromDate;
  dateRangeToDate;

  consentInitiatedFromDate;
  consentReceivedFromDate;
  isFilterApplied = false;

  searchValue: any;
  searchEmail: any;
  searchMobile: any;
  searchOrgName: any;
  searchUserName: any;

  total$: Observable<number>;
  constructor(private tnService: TnService,
    // private eref: ElementRef,
    private modalService: NgbModal,
    // calendar: NgbCalendar,
    public service: AdvancedService,
    private datePipe: DatePipe,
    // private http: HttpClient
  ) {
    this.total$ = service.total$;
  }

  onPageChange(page: any): void {
    this.startIndex = (page - 1) * this.pageSize;
    // this.endIndex = (page - 1) * this.pageSize + this.pageSize;
  }

  ngOnInit(): void {
    this.breadCrumbItems = [{ label: 'Dashboard', path: '/' }, { label: 'My Applications', path: '/', active: true }];
    this.selectValue = ['Alaska', 'Hawaii', 'California'];
    this.PageSelectNumber = ['5', '10', '25', '50', '100'];
    // date
    // this.hidden = true;
    // tab
    this.tab = 1;
    this.changeTab(this.tab);

    // Form 2 to Date piker
    // Component color value of color picker
    // this.componentcolor = '#3bafda';
    this.selected = '';
    this.maxDate = { year: new Date().getFullYear(), month: new Date().getMonth() + 1, day: new Date().getDate() }
    this.getUserList(true);

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
  }

  resetStartIndex(): void {
    this.startIndex = 0;
    this.page = 1;
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

  getUserList(onPageChangeFlag?) {
    if (!onPageChangeFlag) {
      this.resetStartIndex();
    }
    const filterJSON = {
      searchEmail: this.searchEmail ? this.searchEmail : undefined,
      searchMobile: this.searchMobile ? this.searchMobile : undefined,
      searchOrgName: this.searchOrgName ? this.searchOrgName : undefined,
      searchUserName: this.searchUserName ? this.searchUserName : undefined,
      fromDate: this.dateRangeFromDate ? this.getFormatedDate(this.dateRangeFromDate) : undefined,
      toDate: this.dateRangeToDate ? this.getFormatedDate(this.dateRangeToDate) : undefined,
      searchValue: this.searchValue || undefined,
    };
    // const data = { filterJSON: JSON.stringify(filterJSON), paginationFROM: this.startIndex, paginationTO: this.pageSize }
    const data = { filterJSON: filterJSON, paginationFROM: this.startIndex, paginationTO: this.pageSize }

    // console.log(data)
    this.tnService.getUserList(data).subscribe(res => {
      this.bankUserList = [];
      if (res && res.data) {
        console.log(res.data);
        this.bankUserList = res.data;
        this.totalCount = res.data[0].totalCount;
      }
    });
  }


  Common_Tranfer_Proposal_Popup() {
    const config = {
      windowClass: 'Mediam-model',
      size: 'md'
    };
    const modalRef = this.modalService.open(BMFIOCommonProposalComponent, config);
    return modalRef;
  }
  Reason_View_Popup() {
    const config = {
      windowClass: 'Mediam-model',
      size: 'md'
    };
    const modalRef = this.modalService.open(BMFIOReasonComponent, config);
    return modalRef;
  }

  // date picker js 

  // onDateSelection(date: any) {
  //   this.fromNGDate = date;
  // }

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
