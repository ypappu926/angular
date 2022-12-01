import { Component, OnInit, Input, ViewChild, HostListener } from '@angular/core';
import { NgbDate, NgbModal, } from '@ng-bootstrap/ng-bootstrap';
import { Observable } from 'rxjs';
import { AdvancedService } from 'src/app/CommoUtils/common-services/advanced.service';
import { BankUserDatas } from 'src/app/CommoUtils/common-services/Product-Scoring-Data/customers.model';
import { TnService } from 'src/app/services/tn.service';
import { DatePipe } from '@angular/common';
import * as _ from 'lodash';
import alasql from 'alasql';
import { Constants } from 'src/app/CommoUtils/constants';
import { Router } from '@angular/router';
import { CommonService } from 'src/app/CommoUtils/common-services/common.service';
declare var $: any;

@Component({
  selector: 'app-branch-office-list',
  templateUrl: './branch-office-list.component.html',
  styleUrls: ['./branch-office-list.component.scss']
})
export class BranchOfficeListComponent implements OnInit {

  breadCrumbItems: Array<{}>;
  tab: number;
  page = 1;
  pageSize = 10;
  startIndex = 1;
  totalSize = 0;
  totalCount = 0;
  PageSelectNumber: string[];
  bankBranchList: any = [];
  searchBranchCode: any;
  searchBranchName: any;
  searchCityName:any;
  searchDistrictName:any;
  debounceEventForFilter = _.debounce(() => this.getBranchList(), 500, {});
  userOrgId = +CommonService.getStorage(Constants.httpAndCookies.ORGID, true);

  constructor(private tnService: TnService, public service: AdvancedService, private datePipe: DatePipe, private router: Router, private commonService: CommonService) { }



  ngOnInit(): void {
    this.breadCrumbItems = [{ label: 'Dashboard', path: '/', active: true }, { label: 'Office List', path: '/', active: true }];
    this.PageSelectNumber = ['5', '10', '25', '50', '100'];
    this.tab = 1;
    this.changeTab(this.tab);
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
    this.getBranchList();
  }

  getBranchList(onPageChangeFlag?) {
    if (!onPageChangeFlag) {
      this.resetStartIndex();
    }
    const data = { filterJSON: JSON.stringify(this.rquestJson()), paginationFROM: this.startIndex, paginationTO: this.pageSize }
    console.log('data:: ',data);
    this.tnService.spGetBranchList(data).subscribe(res => {
      if (res && res.data && !_.isEmpty(res.data)) {
        this.bankBranchList = [];
        this.bankBranchList = res.data;
        for(let i=0;i<this.bankBranchList.length;i++){
            this.bankBranchList[i].districtName = this.bankBranchList[i]?.districtName?.replaceAll('&&','').replaceAll('0','').replaceAll('1','');
        }
        this.totalCount = res.data[0].totalCount;
      } else {
        this.bankBranchList = [];
        this.totalCount = 0;
      }
    });
  }

  resetStartIndex(): void {
    this.startIndex = 0;
    this.page = 1;
  }

  rquestJson() {
    const filterJSON = {
      orgId : this.userOrgId,
      searchBranchCode: this.searchBranchCode || undefined,
      searchBranchName: this.searchBranchName || undefined,
      searchCityName: this.searchCityName || undefined,
      searchDistrictName:this.searchDistrictName || undefined,
    };
    return filterJSON;
  }

  onPageChange(page: any): void {
    this.startIndex = (page - 1) * this.pageSize;
    this.getBranchList(true);
  }

  downloadAllBranch() {
    const request: any = this.rquestJson();
    request.isExcel = true;
    const data = {
      filterJSON: JSON.stringify(request),
      paginationFROM: 0,
      paginationTO: this.totalCount
    }

    this.tnService.spGetBranchList(data).subscribe(res => {
      if (res && !_.isEmpty(res.data)) {
        console.log(res.data);
        this.downloadDataInExcel(res.data);
      }
    });
  }

  downloadDataInExcel(excelData) {
    let downloadData = [];
    const fileName = 'Branch List' + '.xlsx';
    let maxCol = 0;
    excelData.forEach((element, i) => {
      const index = i + 1;
      let districtArray = [];
      if(!this.commonService.isObjectNullOrEmpty(element.districtName)){
        districtArray = element.districtName.split(',');
      }
      if(maxCol <districtArray.length){
        maxCol= districtArray.length;
      }

    });
    // ...(this.isViewUserNameExcelColumn && {'Name': element.userName || ''}),
    excelData.forEach((element, i) => {
      const index = i + 1;
      let districtArray = [];
      if(!this.commonService.isObjectNullOrEmpty(element.districtName)){
        districtArray = element.districtName.split(',');
      }

      let  obj:any={};
       obj = {
        'Sr no': index,
        'Branch Name': element.branchName || '',
        'Branch Code': element.branchCode || '',
        'IFSC': element.IFSC || '',
        'Branch Address': element.address || '',
        'Branch Pincode': element.pincode || '',
        'City Name': element.cityName || '',
        'Branch Manager First Name': element.firstName || '',
        'Branch Manager Middle Name': element.middleName || '',
        'Branch Manager Last Name': element.lastName || '',
        'Branch Manager Email Id': element.email || '',
        'Branch Manager Mobile Number': element.mobile || '',
      };

      for(let i = 0;i<maxCol;i++){

        if(i < districtArray.length){
          let d = districtArray[i].split('&&');
          Object.assign(obj, {
            ['District Code '+(i+1)]:d[0],
            ['Primary Branch For District Code '+ (i+1)] : (CommonService.isObjectIsEmpty(d[1])?'':d[1] == '1' ?'Yes':'No')
          });
        }else{
          Object.assign(obj, {
            ['District Code '+(i+1)]:'',
            ['Primary Branch For District Code '+ (i+1)] :''
          });
        }
      }

      // element.signupDate = this.datePipe.transform(element.signupDate, 'dd/MM/y');

      //let newObj = this.getElement(obj,districtArrayNew);
      let branchList = [
        obj
      ];

      downloadData = downloadData.concat(branchList);
    });
    alasql('SELECT * INTO XLSX("' + fileName + '",{headers:true}) FROM ?', [downloadData]);
  }

  getElement(obj:any,districtList:any){
      for (const key in districtList) {
        Object.assign(obj, {
          key: districtList[key]
      });
    }
    return obj;
  }
  getOtherColData(districtArray){

    let finalArray = [];
    for(let i=0;i<districtArray.length;i++){
      let obj = {
        'district code':districtArray[i],
        'is primary':'Yes'
      }
      finalArray.push(obj);
    }
    return finalArray;
  }
  reDirectToBranchCreate(branchId?, requestMode?) {
    this.router.navigate([Constants.ROUTE_URL.ADD_OR_UPDATE_BRANCH], { queryParams: { branchId: (requestMode == 2 || requestMode == 3) ? this.commonService.setURLData(branchId) : undefined, isViewMode: (requestMode == 2) ? this.commonService.setURLData('true') : undefined } });
  }
}
