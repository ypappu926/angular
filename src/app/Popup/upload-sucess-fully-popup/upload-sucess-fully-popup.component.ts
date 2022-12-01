import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { AdvancedService } from 'src/app/CommoUtils/common-services/advanced.service';
import { CommonMethods } from 'src/app/CommoUtils/common-services/common-methods';
import { CommonService } from 'src/app/CommoUtils/common-services/common.service';
import { Constants } from 'src/app/CommoUtils/constants';

import { TnService } from 'src/app/services/tn.service';

@Component({
  selector: 'app-upload-sucess-fully-popup',
  templateUrl: './upload-sucess-fully-popup.component.html',
  styleUrls: ['./upload-sucess-fully-popup.component.scss']
})
export class UploadSucessFullyPopupComponent implements OnInit {

  @Input() data: any;
  businessTypeId: any;
  orgId: any;
  countList: any = {};

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
  
  totalData: any;
  rowData: any = [];
  rowDataCopy: any = [];
  rowDataPagination: any = [];

  PageSelectNumber: string[];

  constructor(public service: AdvancedService,private tnService : TnService,
    public activeModal: NgbActiveModal,private router: Router,private commonMethods: CommonMethods) {
      this.businessTypeId = CommonService.getStorage(Constants.httpAndCookies.BUSINESS_TYPE_ID, true);
      this.orgId = (CommonService.getStorage(Constants.httpAndCookies.ORGID, true));
     }

  ngOnInit(): void {
      // console.log("data===>",this.data.fileId);
      setTimeout(() => { 
      this.getSuccessAndFailCountList();      
           
      }, 0);
  }

  
  // ---CONSENT DATA ALL LIST -----------
  importExcelList(): void {
    this.rowData = [];
    console.log("this.orgId   ------",this.orgId)
    this.tnService.listUserImportedExcel(this.orgId).subscribe(response => {
      if (response.status === 200 && response.listData != null) {
console.log("----response  -------- ",response);

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

  getPaginationData(): void {
    this.rowData = this.rowDataPagination.slice(((this.page - 1) * this.pageSize), (this.page * this.pageSize));
    this.startIndex = ((this.page - 1) * this.pageSize) + 1;
    this.endIndex = (this.page * this.pageSize);
    if (this.totalData < this.endIndex) {
      this.endIndex = this.totalData;
    }
  }
  getSuccessAndFailCountList(){
    let obj = {id : this.data.fileId};
    this.tnService.getSuccessAndFailCountList(obj).subscribe(success => {
            if(success.status === 200 && success.data) {
              // console.log("success.data  =======>",success.data);
              // window.location.reload();
              this.countList = JSON.parse(success.data);
              console.log("this.countList======>",this.countList);
              // this.commonService.warningSnackBar(success.message);
            } 
          });
  }



  closeModal() {
    this.activeModal.close();
    window.location.reload();
    // this.router.navigate(['/TIIC/Bulk-Upload']);     

  }

  proceed(){
    let data ={};
    this.tnService.proceedAfterUpload(data).subscribe(success => {
      if (success.status === 200) {
        this.activeModal.close();
        window.location.reload();
      }
    }, error => {
      console.log('Failed to proceed:: ' + error);
    });
  }

}
