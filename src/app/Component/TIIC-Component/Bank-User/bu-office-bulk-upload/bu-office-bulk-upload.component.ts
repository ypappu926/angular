import { HttpClient } from '@angular/common/http';
import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { NgbDate, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Observable } from 'rxjs';
import { AdvancedService } from 'src/app/CommoUtils/common-services/advanced.service';
import { CommonService } from 'src/app/CommoUtils/common-services/common.service';
import { Constants } from 'src/app/CommoUtils/constants';
import { BUUserOfficeReadInstructionComponent } from 'src/app/Popup/bu-user-office-read-instruction/bu-user-office-read-instruction.component';
import { UploadSucessFullyPopupComponent } from 'src/app/Popup/upload-sucess-fully-popup/upload-sucess-fully-popup.component';
import { TnService } from 'src/app/services/tn.service';
import alasql from 'alasql';
import * as XLSX from 'xlsx';


@Component({
  selector: 'app-bu-office-bulk-upload',
  templateUrl: './bu-office-bulk-upload.component.html',
  styleUrls: ['./bu-office-bulk-upload.component.scss']
})
export class BUOfficeBulkUploadComponent implements OnInit {

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
 PageSelectNumber: string[];
 // Component DatePicker colorpicker
 componentcolor: string;

 hoveredDate: NgbDate;
 fromNGDate: NgbDate;
 toNGDate: NgbDate;

 hidden: boolean;
 selected: any;
 color: string;
 arrayBuffer:any;


 @Input() fromDate: Date;
 @Input() toDate: Date;
 @Output() dateRangeSelected: EventEmitter<{}> = new EventEmitter();

 @ViewChild('dp', { static: true }) datePicker: any;

 

 total$: Observable<number>;

// for excel file UPLOAD 
 fileToUpload: File = null;
 fileId: any;
 files: any[] = [];


 fileHistoryList: any = [];
  rowData: any = [];
  totalData = 0;

 file:File;



 constructor(private _http: HttpClient, public service: AdvancedService,
  private modalService: NgbModal,private router: Router, private tnService: TnService, private commonService: CommonService) {
   this.total$ = service.total$;
 }

 ngOnInit() {
   this.breadCrumbItems = [{ label: 'Dashboard', path: '/' }, { label: 'Bulk Upload', path: '/', active: true }];
   this.PageSelectNumber = ['5', '10', '25', '50', '100'];

   this.getFileEntryForBulkUsers();
   
   this.hidden = true;
   // Form 2 to Date piker
   // Component color value of color picker
   this.componentcolor = '#3bafda';

   this.selected = '';
   this.isCollapsed = false;
 }

 


 // UPLOAD BRANCH OFC DATA 
 uploadFile(): void {
  this.fileToUpload = this.files[0];
  // this.fileToUpload = this.demoForm.controls.files.value[0];
  if(!this.fileToUpload && !this.files[0]){
   this.commonService.warningSnackBar("Kindly upload a file to continue");
  }
  if(this.fileToUpload && this.fileToUpload.type != "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"){
     this.commonService.errorSnackBar("Please upload .xlsx file only.");
     return;
  }

  this.file= this.files[0];
  let isFileisEmpty = true;
  let fileReader = new FileReader();    
  fileReader.readAsArrayBuffer(this.file);     
  fileReader.onload = (e) => {    
      this.arrayBuffer = fileReader.result;    
      var data = new Uint8Array(this.arrayBuffer);    
      var arr = new Array();    
        for(var i = 0; i != data.length; ++i) arr[i] = String.fromCharCode(data[i]);    
        var bstr = arr.join("");    
        var workbook = XLSX.read(bstr, {type:"binary"});    
        var first_sheet_name = workbook.SheetNames[1];    
        var worksheet = workbook.Sheets[first_sheet_name];    
      // console.log(XLSX.utils.sheet_to_json(worksheet,
      //   {raw:true}));    
        var arraylist = XLSX.utils.sheet_to_json(worksheet,{raw:true});     
      //  console.log("arraylist  -------{}",arraylist);

       for(let i=0;i<arraylist.length;i++){
        if(isFileisEmpty){
         let element = arraylist[i];
        Object.keys(element).forEach(key => {
          let value = element[key];
          if(!CommonService.isObjectIsEmpty(value)){
            isFileisEmpty = false;
          }
        });
      }else{
        break;
      }
   }
       
   if(isFileisEmpty){
    this.commonService.errorSnackBar("File uploaded is empty. Kindly enter the details and upload again.");
    return ;
   }  

// if(isFileisEmpty !=undefined && isFileisEmpty == true){
  const formData = new FormData();
  formData.append('file', this.fileToUpload);
  this.tnService.uploadBulkBranchOfcData(formData).subscribe(res => {
    if(res.status === 200) {
      this.fileId = res.data;
      this.commonService.successSnackBar(res.message);
      this.getFileEntryForBulkUsers();
      this.files = [];
      this.router.navigate([Constants.ROUTE_URL.BULK_UPLOAD_BRANCH_OFC]);
    } else {
      this.commonService.warningSnackBar(res.message);
    }
  });
  //  }
}
}


 getPaginationData(): void {
  this.rowData = this.fileHistoryList.slice(((this.page - 1) * this.pageSize), (this.page * this.pageSize));
  this.startIndex = ((this.page - 1) * this.pageSize) + 1;
  this.endIndex = (this.page * this.pageSize);
  if (this.totalData < this.endIndex) {
    this.endIndex = this.totalData;
  }
}

getFileEntryForBulkUsers(): void {
  this.tnService.getFileEntryForBulkBranchOfc().subscribe(res => {
    if (res.status === 200) {
      // console.log("res ------------>",res)
      this.fileHistoryList = res.data;
      this.totalData = this.fileHistoryList.length;
      this.getPaginationData();
    }
  });
}

 // DOWNLOAD SUCCESS AND FAIL AND TOTAL ENTRIES
 downloadFile(fileId, checkEntry): void {
  // 0 success entries //1 failed entries //2 total entries
  this.tnService.getFileEntryListBranchOfc({ id: fileId, checkEntry: checkEntry }).subscribe(success => {
    if (success && success.status === 200 && success.data) {
      let downloadData = [];
      success.data.forEach((element, i) => {
        const index = i + 1;
        const excelData = [{
          'Sr No.': index,
          'First Name': element.firstName || '',
          'Middle Name': element.middleName || '',
          'Last Name': element.lastName || '',
          'Email': element.email || '',
          'Mobile': element.mobile || '',
          'role': element.role || '',
          'Uploded on': element.createdDate ? this.commonService.dateFormateForExcel(element.createdDate) : '',
          'Message': element.message || '',
          'Is Active': element.isActive ? 'YES' : 'NO'
          // 'District Code': element.districtCode || '',
          // 'Department': element.department || '',
        }];
        downloadData = downloadData.concat(excelData);
      });
      const fileName = checkEntry === 0 ? 'Successful_Entries' : checkEntry === 1 ? 'Failed_Entries' : 'Total_Entries';
      alasql('SELECT * INTO XLSX("' + fileName + '",{headers:true}) FROM ?', [downloadData]);
    }
  });
}













 /**
  * Simulate the upload process
  */
  uploadFilesSimulator(index: number) {
    setTimeout(() => {
      if (index === this.files.length) {
        return;
      } else {
        const progressInterval = setInterval(() => {
          if (this.files[index].progress === 100) {
            clearInterval(progressInterval);
            this.uploadFilesSimulator(index + 1);
           //  this.TIICUpload_SucessFully();
          } else {
            this.files[index].progress += 5;
          }
        }, 20);
      }
    }, 100);
  }


  prepareFilesList(files: Array<any>) {
    for (const item of files) {
      item.progress = 0;
      this.files.push(item);
    }
    this.uploadFilesSimulator(0);
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
//  files: any[] = [];

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
  //  console.log("files -----------------> ",files)
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
  * Convert Files list to normal array list
  * @param files (Files List)
  */
 





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

 User_read_instruction_SucessFully(){
  const config = {
    windowClass: 'popup-650',
  };
  const modalRef = this.modalService.open(BUUserOfficeReadInstructionComponent, config);
  return modalRef;
}

}
