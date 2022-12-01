import { Component, OnInit, Input, Output, EventEmitter, ViewChild, ElementRef, HostListener } from '@angular/core';
import { NgbDate, NgbModal, NgbCalendar } from '@ng-bootstrap/ng-bootstrap';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { AdvancedService } from 'src/app/CommoUtils/common-services/advanced.service';
import { TnService } from 'src/app/services/tn.service';
import { DatePipe } from '@angular/common';
import { FoStatusDetails } from 'src/app/CommoUtils/common-services/Product-Scoring-Data/customers.model';
import * as _ from 'lodash';
import alasql from 'alasql';

declare var $:any;

@Component({
  selector: 'app-tiic-field-inspection-list',
  templateUrl: './tiic-field-inspection-list.component.html',
  styleUrls: ['./tiic-field-inspection-list.component.scss'],
  providers: [DatePipe]
})
export class TIICFieldInspectionListComponent implements OnInit {

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

  searchEmail: any;
  searchMobile: any;
  searchEntityName: any;
  searchDigitalSignature: any;

  dateRangeFromDate;
  dateRangeToDate;
  consentStatus: any;
  searchDistrict: any;

  totalCount = 0;
  totalBorrowerObj = 0;
  totalInprogressObj = 0;
  totalCompletedObj = 0;

  tabRelatedCountObjects : any;

  constructor(private eref: ElementRef, private modalService: NgbModal, calendar: NgbCalendar, public service: AdvancedService, private http: HttpClient, 
    private tnService : TnService, private datePipe: DatePipe) {
    this.total$ = service.total$;
   }

  onPageChange(page: any): void {
    this.startIndex = (page - 1) * this.pageSize;
    //this.endIndex = (page - 1) * this.pageSize + this.pageSize;
    this.getStatusList(true);
  }

  ngOnInit(): void {
    this.breadCrumbItems = [{ label: 'Dashboard', path: '/' }, { label: 'My Applications', path: '/', active: true }];
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
  }

  getStatusList(onPageChangeFlag?): void {
    if (!onPageChangeFlag) {
      this.resetStartIndex();
    }
    const filterJSON = {
      tabValue: this.tab,
      searchEntityName: this.searchEntityName ? this.searchEntityName : undefined,
      searchEmail: this.searchEmail ? this.searchEmail : undefined,
      searchMobile: this.searchMobile ? this.searchMobile : undefined,
      dateRangeFromDate: this.dateRangeFromDate ? this.getFormatedDate(this.dateRangeFromDate) : undefined,
      dateRangeToDate: this.dateRangeToDate ? this.getFormatedDate(this.dateRangeToDate) : undefined,
      searchDistrict: this.searchDistrict ? this.searchDistrict : undefined,
      searchDigitalSignature : this.searchDigitalSignature ? this.searchDigitalSignature : undefined,
    };
  
    const data = { filterJSON: JSON.stringify(filterJSON), paginationFROM: this.startIndex, paginationTO: this.pageSize }
    
    // this.tnService.getFoStatusList(data).subscribe(res => {
    //   this.foStatusDetails =[];
    //   if(res && res.data) {
    //     this.foStatusDetails = res.data;
    //     this.totalCount = res.data[0].totalCount;
    //     this.isCollapsed1? this.isCollapsed1= !this.isCollapsed1:"";
    //   }
    // });
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
    this.searchEntityName=null;
    this.searchEmail=null;
    this.searchMobile=null;
    this.searchDistrict=null;
    this.searchDigitalSignature=null;
    if(clear==1){
      this.isCollapsed1 = !this.isCollapsed1;
    }
    this.clearDateRange();
    this.getStatusList();
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
      searchDistrict: this.searchDistrict ? this.searchDistrict : undefined,
      searchDigitalSignature : this.searchDigitalSignature ? this.searchDigitalSignature : undefined,
    };
  
    const data = { filterJSON: JSON.stringify(filterJSON), paginationFROM: 0, paginationTO: this.totalCount }
    
    // this.tnService.getFoStatusList(data).subscribe(res => {
    //   if(res && res.data) {
    //     this.downloadDataInExcel(res.data);
    //   }
    // });
  }
  
  downloadDataInExcel(excelData) {
    let downloadData = [];
    const fileName = 'All-Field-Specifications' + '.xlsx';
    excelData.forEach((element, i) => {
      const index = i + 1;
      let allStatusFields = [{
        'Sr no': index,
        'Name of Unit': element.entityName,
        'Email': element.email,
        'Mobile': element.mobile,
        'District': element.district,
      }];

      downloadData = downloadData.concat(allStatusFields);
    });
    alasql('SELECT * INTO XLSX("' + fileName + '",{headers:true}) FROM ?', [downloadData]);
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
    this.tab = tabId;
    this.getStatusList();
  }
  
  private _fetchData() {
    // Data table
    // apply pagination
    this.startIndex = 0;
    this.endIndex = this.pageSize;

    this.tnService.getFoStatusCount().subscribe(res => {
      if(res && res.data) {
        this.totalBorrowerObj = res.data.newBorrowerDetail; 
        this.totalInprogressObj = res.data.inProgress;
        this.totalCompletedObj = res.data.completed;
      }
    });
  }
  // date picker js 
  // onDateSelection(date: NgbDate) {
  //   if (!this.fromDate && !this.toDate) {
  //     this.fromNGDate = date;
  //     this.fromDate = new Date(date.year, date.month - 1, date.day);
  //     this.selected = '';
  //   } else if (this.fromDate && !this.toDate && date.after(this.fromNGDate)) {
  //     this.toNGDate = date;
  //     this.toDate = new Date(date.year, date.month - 1, date.day);
  //     this.hidden = true;
  //     this.selected = this.fromDate.toLocaleDateString() + '-' + this.toDate.toLocaleDateString();

  //     this.dateRangeSelected.emit({ fromDate: this.fromDate, toDate: this.toDate });

  //     this.fromDate = null;
  //     this.toDate = null;
  //     this.fromNGDate = null;
  //     this.toNGDate = null;

  //   } else {
  //     this.fromNGDate = date;
  //     this.fromDate = new Date(date.year, date.month - 1, date.day);
  //     this.selected = '';
  //   }
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

