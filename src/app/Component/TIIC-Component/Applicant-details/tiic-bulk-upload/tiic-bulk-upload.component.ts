import { HttpClient } from '@angular/common/http';
import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { FileUploadValidators } from '@iplab/ngx-file-upload';
import alasql from 'alasql';
import { NgbDate, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Observable } from 'rxjs';
import { AdvancedService } from 'src/app/CommoUtils/common-services/advanced.service';
import { CommonMethods } from 'src/app/CommoUtils/common-services/common-methods';
import { CommonService } from 'src/app/CommoUtils/common-services/common.service';
import { Constants } from 'src/app/CommoUtils/constants';
// import { CommonService } from 'src/app/CommoUtils/common-services/common.service';

import { UploadSucessFullyPopupComponent } from 'src/app/Popup/upload-sucess-fully-popup/upload-sucess-fully-popup.component';

import { TnService } from 'src/app/services/tn.service';

@Component({
  selector: 'app-tiic-bulk-upload',
  templateUrl: './tiic-bulk-upload.component.html',
  styleUrls: ['./tiic-bulk-upload.component.scss']
})
export class TIICBulkUploadComponent implements OnInit {

  @Input() data: any;
  searchFileName: any;
  searchDate: any;
  searchText;
  fileToUpload: File = null;

  fileId: any;
  searchList: any = [];
  isSearch: boolean = false;

  // private filesControl = new FormControl(null, FileUploadValidators.filesLimit(1));
  // public demoForm = new FormGroup({files: this.filesControl });

  orgId: any;
  businessTypeId: any;
  allUsers: any;

  totalData: any;
  rowData: any = [];
  rowDataCopy: any = [];
  rowDataPagination: any = [];

  PageSelectNumber: string[];

  // bread crumb items
  breadCrumbItems: Array<{}>;

  isCollapsed: boolean;
  // page number
  page = 1;
  // default page size
  pageSize = 10;

  // start and end index
  startIndex = 1;
  endIndex = 10;
  totalSize = 0;
  values = '';

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

  total$: Observable<number>;


  constructor(private _http: HttpClient,
    private commonService: CommonService,
    public service: AdvancedService,
    private modalService: NgbModal,
    private tnService: TnService,
    private commonMethods: CommonMethods) {
    this.total$ = service.total$;
    this.businessTypeId = CommonService.getStorage(Constants.httpAndCookies.BUSINESS_TYPE_ID, true);
    this.orgId = (CommonService.getStorage(Constants.httpAndCookies.ORGID, true));
    // console.log("orgId   ====={}", this.orgId)
    // console.log("businessTypeId   ====={}", this.businessTypeId);
  }

  ngOnInit() {
    this.breadCrumbItems = [{ label: 'Dashboard', path: '/' }, { label: 'Bulk Upload', path: '/', active: true }];
    this.PageSelectNumber = ['5', '10', '25', '50', '100'];

    this.hidden = true;
    // Form 2 to Date piker
    // Component color value of color picker
    this.componentcolor = '#3bafda';

    this.selected = '';
    this.isCollapsed = false;

    this.importExcelList();

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

  // file upload @Nikul
  files: any[] = [];

  /**
   * on file drop handler
   */
  onFileDropped($event) {
    this.prepareFilesList($event);
  }

  /**
   * handle file from browsing
   */
  fileBrowseHandler(files) {
    console.log("this.files.length) -------->", this.files.length);
    this.prepareFilesList(files);
  }

  /**
   * Delete file from files list
   * @param index (File index)
   */
  deleteFile(index: number) {
    this.files.splice(index, 1);
  }

  /**
   * Simulate the upload process
   */
  uploadFilesSimulator(index: number) {
    setTimeout(() => {
      //  console.log("this.files.length) -------->",this.files.length);
      //  console.log("this.demoForm.controls -------->",this.demoForm.controls.value[0]);
      if (index === this.files.length) {
        return;
      } else {
        const progressInterval = setInterval(() => {
          if (this.files[index].progress === 100) {
            clearInterval(progressInterval);
            this.uploadFilesSimulator(index + 1);
            //this.TIICUpload_SucessFully();
            this.uploadFile();
          } else {
            this.files[index].progress += 5;
          }
        }, 30);
      }
    }, 1000);
  }

  uploadFile(): void {
    //  this.fileToUpload = this.demoForm.controls.files.value[0];
    const formData = new FormData();
    // console.log("files length  ------------->",this.files.length); 
    for (var i = 0; i < this.files.length; i++) {
      formData.append("file", this.files[i]);
    }
    
    if(this.files && this.files.length > 0){
      // if(this.files[0] && this.files[0].type != "text/csv"){
      const a = this.files[0].name.slice(this.files[0].name.length - 4)
      if(!a.includes(".csv")){
        this.commonMethods.errorSnackBar("Please upload .csv file only.");
        return;
      }else{
        let reader: FileReader = new FileReader();
        let file : File = this.files[0]; 
        reader.readAsText(file);
        let messageValue="";
        reader.onload = (e) => {
          let allTextLines = reader.result.toString().split(/\r|\n|\r/);
          let headers = allTextLines[0].split(',');
          let lines = [];

          for (let i = 0; i < allTextLines.length; i++) {
            // split content based on comma
            let data = allTextLines[i].split(',');
            if (data.length === headers.length) {
              let tarr = [];
              for (let j = 0; j < headers.length; j++) {
                tarr.push(data[j]);
              }
              lines.push(tarr);
            }
          }
          if(lines.length==1 || lines.length<1){
            messageValue="File uploaded is empty. Kindly enter the details and upload again.";
          }

          if(messageValue.length!=0){
            this.commonMethods.errorSnackBar(messageValue);
            return;
          }
          formData.append('orgId', this.orgId);
          this.tnService.uploadBorrowerConsentFile(formData).subscribe(success => {
            if (success && success.data && success.status === 200) {
              this.fileId = success.data;
              this.TIICUpload_SucessFully(this);
            } else {
              this.files = [];
              this.commonMethods.errorSnackBar("It seems some technical error has occurred, Please try again after some time !");
            }
          });
        }
        
      }
    }

  }


  /**
   * Convert Files list to normal array list
   * @param files (Files List)
   */
  prepareFilesList(files: Array<any>) {
    for (const item of files) {
      item.progress = 0;
      console.log("item   ==========={}", item);
      this.files.push(item);
    }
    this.uploadFilesSimulator(0);
  }

  /**
   * format bytes
   * @param bytes (File size in bytes)
   * @param decimals (Decimals point)
   */
  formatBytes(bytes, decimals) {
    if (bytes === 0) {
      return '0 Bytes';
    }
    const k = 1024;
    const dm = decimals <= 0 ? 0 : decimals || 2;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
  }

  //  BulkUpload_SucessFully(){
  //    const config = {
  //      windowClass: 'popup-650',
  //    };
  //    console.log("start popup")
  //    const modalRef = this.modalService.open(BUBulkUploadPopupComponent, config);
  //    console.log("start popup")
  //    return modalRef;
  //  }
  //  AddUser_SucessFully(){
  //    const config = {
  //      windowClass: 'popup-650',
  //    };
  //    console.log("start popup")
  //    const modalRef = this.modalService.open(BUUserAddComponent, config);
  //    console.log("start popup")
  //    return modalRef;
  //  }

  TIICUpload_SucessFully(data) {

    if (!CommonService.isObjectNullOrEmpty(data)) {
      const config: any = {
        windowClass: 'popup-650',
        backdrop: 'static'
      };
      const modalRef = this.modalService.open(UploadSucessFullyPopupComponent, config);
      modalRef.componentInstance.data = data;
      this.files = [];
      return modalRef;
    }
    return null;//ak add
  }


  // ---CONSENT DATA ALL LIST -----------
  importExcelList(): void {
    this.rowData = [];
    // console.log("this.orgId   ------", this.orgId)
    this.tnService.listUserImportedExcel(this.orgId).subscribe(response => {
      if (response.status === 200 && response.listData != null) {
        // console.log(' response.listData: ',  response.listData);

        this.rowData = response.listData;
        this.rowData.forEach((element, i) => {
          element.index = i + 1 + '.';
          element.createdDate = new Date(element.createdDate).toLocaleString();
        });
        this.totalData = this.rowData.length;
        this.rowDataCopy = this.rowData;
        this.rowDataPagination = this.rowData;
        if (this.totalData < 10) {
          this.pageSize = this.totalData;
        }
        this.getPaginationData();
      } else {
        this.commonMethods.warningSnackBar(response.message);
      }
    }, (error: any) => {
      this.commonMethods.errorSnackBar(error);
    });
  }

  resetPageSize() {
    this.page = 1;
    this.pageSize = 10;
  }

  getPaginationData(isSearch?): void {
    if (isSearch) {
      this.rowData = this.searchList.slice(((this.page - 1) * this.pageSize), (this.page * this.pageSize));
    } else {
      this.rowData = this.rowDataPagination.slice(((this.page - 1) * this.pageSize), (this.page * this.pageSize));
    }
    this.startIndex = ((this.page - 1) * this.pageSize) + 1;
    this.endIndex = (this.page * this.pageSize);
    if (this.totalData < this.endIndex) {
      this.endIndex = this.totalData;
    }
  }

  // onKeyPress(event: any, keyName): void {
  //   this.values = event.target.value;
  //   if (!this.values) {
  //     if ((!this.searchFileName && !this.searchDate) && this.rowDataCopy) {
  //       this.rowData = this.rowDataCopy;
  //       this.totalData = this.rowData.length;
  //       this.getPaginationData();
  //     } else {
  //       if (this.searchFileName) {
  //         this.rowData = this.rowData.filter(x => x.index.indexOf(this.values) > -1);
  //         this.totalData = this.rowData.length;
  //       }
  //       if (this.searchDate) {
  //         this.rowData = this.rowData.filter(x => x.companyName.toLowerCase().indexOf(this.values.toLowerCase()) > -1);
  //         this.totalData = this.rowData.length;
  //       }
  //     }
  //   } else {
  //     this.rowData = this.rowData.filter(x => x[keyName].toLowerCase().indexOf(this.values.toLowerCase()) > -1);
  //     this.totalData = this.rowData.length;
  //   }
  // }



  // DOWNLOAD SUCCESS AND FAIL AND TOTAL ENTRIES
  downloadFile(fileId, checkEntry): void {
    const fileData = {
      id: fileId,
      checkEntry: checkEntry,
    };

    // 0 success entries //1 failed entries //2 total entries
    this.tnService.getBulkConsentUserList(fileData).subscribe(success => {
      if (success.status === 200 && success.data) {
        const fileDetails = success.data;
        // console.log("success.data   =====>",success.data)
        const fileName = (checkEntry === 0) ?
          'Successful_Entries' : (checkEntry === 1) ? 'Failed_Entries' : 'Total_Entries';
        let downloadData = [];

        fileDetails.forEach((element, i) => {
          const index = i + 1;
          if (element && element.message) {
            this.allUsers = [{
              'entity_name': element.entityName,
              'email_id': element.emailId,
              'mobile_no': element.mobileNo,
              'message': element.message,
            }];
          } else {
            this.allUsers = [{
              'entity_name': element.entityName,
              'email_id': element.emailId,
              'mobile_no': element.mobileNo,

            }];
          }
          downloadData = downloadData.concat(this.allUsers);
        });
        alasql('SELECT * INTO XLSX("' + fileName + '",{headers:true}) FROM ?', [downloadData]);

      } else {
        this.commonMethods.warningSnackBar(success.message);
      }
    });
  }

  search() {
    this.rowData = [];
    if (!this.commonService.isObjectNullOrEmpty(this.searchFileName)) {
      this.rowData = this.rowDataPagination.filter(res => JSON.stringify(res.originalFileName).toLowerCase().includes(this.searchFileName.toLowerCase()));  // || JSON.stringify(res.createdDate).toLowerCase().includes(this.searchFileName.toLowerCase())
      this.totalData = this.rowData.length;
      this.searchList = this.rowData;
      this.isSearch = true;
      // this.resetPageSize();
      this.getPaginationData(true);
    } else {
      this.rowData = this.rowDataPagination;
      this.totalData = this.rowDataPagination.length;
      this.isSearch = false;
      this.getPaginationData();
    }
  }
}
