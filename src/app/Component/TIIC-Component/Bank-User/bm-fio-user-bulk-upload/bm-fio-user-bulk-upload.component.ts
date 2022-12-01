import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { NgbDate, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import alasql from 'alasql';
import { Observable } from 'rxjs';
import { AdvancedService } from 'src/app/CommoUtils/common-services/advanced.service';
import { CommonService } from 'src/app/CommoUtils/common-services/common.service';
import { Constants } from 'src/app/CommoUtils/constants';
import { BUUserOfficeReadInstructionComponent } from 'src/app/Popup/bu-user-office-read-instruction/bu-user-office-read-instruction.component';
import { TnService } from 'src/app/services/tn.service';
import * as XLSX from 'xlsx';

import { Component, EventEmitter, Input, NgModule, OnInit, Output, ViewChild } from '@angular/core';

@Component({
  selector: 'app-bm-fio-user-bulk-upload',
  templateUrl: './bm-fio-user-bulk-upload.component.html',
  styleUrls: ['./bm-fio-user-bulk-upload.component.scss']
  
})


export class BMFIOUserBulkUploadComponent implements OnInit {

  breadCrumbItems: Array<{}>;
  isCollapsed: boolean;
  page = 1;
  pageSize = 10;
  startIndex = 1;
  endIndex = 10;
  totalSize = 0;
  PageSelectNumber: string[];
  fileToUpload: File = null;
  fileId: any;
  files: any[] = [];

  tab: number;
  roleName: string;

  @ViewChild('dp', { static: true }) datePicker: any;

  total$: Observable<number>;
  fileHistoryList: any = [];
  rowData: any = [];
  totalData = 0;

  file : File;
  arrayBuffer : any;

  
  userTypeId: any;
  userRoleId: any;
  userOrgId: any;
  userId: any;

  constructor(private _http: HttpClient, public service: AdvancedService, private modalService: NgbModal, private router: Router, private tnService: TnService, private commonService: CommonService) {
    this.total$ = service.total$;
    this.tab = +commonService.getURLData('tabId');
    this.roleName = commonService.getURLData('roleName');


  }

  ngOnInit() {
    this.breadCrumbItems = [{ label: 'Dashboard', path: '/', active: true }, { label: 'Bulk Upload', path: '/', active: true }];
    this.PageSelectNumber = ['5', '10', '25', '50', '100'];
     this.getFIOFileEntryForBulkUsers();
    this.userRoleId = +CommonService.getStorage(Constants.httpAndCookies.ROLEID, true);
    this.userOrgId = +CommonService.getStorage(Constants.httpAndCookies.ORGID, true);
  }

  getFIOFileEntryForBulkUsers(): void {
    this.tnService.getFIOFileEntryForBulkUsers(null).subscribe(res => {
      if (res.status === 200) {
        this.fileHistoryList = res.data;
        this.totalData = this.fileHistoryList.length;
        this.getPaginationData();
      }
    });
  }
  

  getPaginationData(): void {
    this.rowData = this.fileHistoryList.slice(((this.page - 1) * this.pageSize), (this.page * this.pageSize));
    this.startIndex = ((this.page - 1) * this.pageSize) + 1;
    this.endIndex = (this.page * this.pageSize);
    if (this.totalData < this.endIndex) {
      this.endIndex = this.totalData;
    }
  }

  // DOWNLOAD SUCCESS AND FAIL AND TOTAL ENTRIES
      // 0 success entries
    //1 failed entries
    //2 total entries
  downloadFile(fileId, checkEntry): void {
    this.tnService.getFIOFileEntryList({ fileId: fileId, checkEntry: checkEntry }).subscribe(success => {
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
            'Message': element.message || '',
          }];
          downloadData = downloadData.concat(excelData);
        });
        const fileName = checkEntry === 0 ? 'Successful_Entries' : checkEntry === 1 ? 'Failed_Entries' : 'Total_Entries';
        alasql('SELECT * INTO XLSX("' + fileName + '",{headers:true}) FROM ?', [downloadData]);
      }
    });
  }

  onFileDropped($event) {
    this.prepareFilesList($event);
  }

  fileBrowseHandler(files) {
    this.prepareFilesList(files);
  }

  deleteFile(index: number) {
    this.files.splice(index, 1);
  }

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
        }, 200);
      }
    }, 1000);
  }

  prepareFilesList(files: Array<any>) {
    for (const item of files) {
      item.progress = 0;
      this.files.push(item);
    }
    this.uploadFilesSimulator(0);
  }

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

  User_read_instruction_SucessFully() {
    const config = {
      windowClass: 'popup-650',
    };
    this.commonService.openPopUp(null, BUUserOfficeReadInstructionComponent, false, config).result.then(result => { });
  }

  uploadFile(): void {
    this.fileToUpload = this.files[0];
    // this.fileToUpload = this.demoForm.controls.files.value[0];
    if(!this.fileToUpload && !this.files[0]){
      this.commonService.warningSnackBar("Kindly upload a file to continue");
      return;
    }
    if(this.fileToUpload && this.fileToUpload.type != "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"){
       this.commonService.errorSnackBar("Please upload .xlsx file only.");
       return;
    }

    this.file = this.files[0];
    let isFileisEmpty = false;
    let fileReader: FileReader = new FileReader();
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
        //  console.log(XLSX.utils.sheet_to_json(worksheet,
          //  {raw:true}));    
          var arraylist = XLSX.utils.sheet_to_json(worksheet,{raw:true});     
          console.log("arraylist  -------{}",arraylist);

        let loopBreak = false;
        if(arraylist.length<1){
            isFileisEmpty = true;
        }
        // for(let i=0;i<arraylist.length;i++){
        //   if(isFileisEmpty){
        //   let element = arraylist[i];
        //     console.log("element  ===={}",element);
        //     console.log("arraylist[i]  ===={}",arraylist[i]);
            
        //     // console.log("element  ===={}",element.inclu);

        //   Object.keys(element).forEach(key => {
        //     let value = element[key];
        //     if(value == " "){
        //       isFileisEmpty = true;
        //       loopBreak = true;
        //     }            
        //   });
        //   if(loopBreak){
        //     return;
        //   }
        // }else{
        //   break;
        // }
    // }
        
    if(isFileisEmpty){
      this.commonService.errorSnackBar("File uploaded is empty. Kindly enter the details and upload again.");
      return ;
    }  

    if(isFileisEmpty == false){
      const formData = new FormData();
      formData.append('file', this.fileToUpload);
      this.tnService.uploadFIOCreationFile(formData).subscribe(res => {
        if (res.status === 200) {
          this.fileId = res.data;
          this.commonService.successSnackBar("File uploaded successfully");
          this.getFIOFileEntryForBulkUsers();
          this.files = [];
          this.router.navigate([Constants.ROUTE_URL.BULK_UPLOAD_FIO]);
        } else {
          this.commonService.warningSnackBar(res.message);
        }
      });
       }else{
        this.commonService.errorSnackBar("It seems some technical error please try after some time !");
       }
    } 
  }
}

