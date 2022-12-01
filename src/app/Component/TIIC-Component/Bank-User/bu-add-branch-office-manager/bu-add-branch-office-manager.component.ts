import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';

import * as _ from 'lodash';
import { CommonService } from 'src/app/CommoUtils/common-services/common.service';
import { Constants } from 'src/app/CommoUtils/constants';
import { TnService } from 'src/app/services/tn.service';

import { DataService, Person } from 'src/app/CommoUtils/common-services/Product-Scoring-Data/Tree_Checkbox_Data.service';
import { map } from 'rxjs/operators';

declare var jQuery: any;
declare var $: any;

@Component({
  selector: 'app-bu-add-branch-office-manager',
  templateUrl: './bu-add-branch-office-manager.component.html',
  styleUrls: ['./bu-add-branch-office-manager.component.scss']
})
export class BUAddBranchOfficeManagerComponent implements OnInit {

  @ViewChild('addUserForm') addUserForm: NgForm;
  @ViewChild('addBranchForm') addBranchForm: NgForm;

  // bread crumb items
  breadCrumbItems: Array<{}>;
  fileToUpload: File = null;

  tabId: number;
  userTypeId: number;
  userRoleId: number;
  isEditMode: boolean;
  roleNameHeading: string;
  submitted = false;

  userData: any = {};
  branchData: any = {};

  orgList: any = [];
  statusList: any = [];
  userId: any;
  roleList: any = [];
  departmentList: any = [];
  districtList: any = [];
  cityList: any = [];
  branchList: any = [];

  isBankTextBoxView = false;
  isDepartmentTextBoxView = false;
  isRoleNameTextBoxView = false;
  isDistrictTextBoxView = false;
  isBranchNameTextBoxView = false;
  addBranchDetailsFlag = false;  // false

  people: Person[] = [];
  selectedPeople = [];

  constructor(private tnService: TnService, private router: Router, private commonService: CommonService,private dataService: DataService) {
    this.tabId = +commonService.getURLData('tabId');
    this.userId = +commonService.getURLData('userId');
    this.userTypeId = +CommonService.getStorage(Constants.httpAndCookies.USERTYPE, true);
    this.userRoleId = +CommonService.getStorage(Constants.httpAndCookies.ROLEID, true);

    if (this.userId) {
      this.getUserById();
      this.isEditMode = true;
    }
  }

  ngOnInit(): void {
    // this.breadCrumbItems = [{ label: 'Dashboard', path: '/' }, { label: 'form', path: '/', active: true }];
    this.statusList = [{ id: true, name: 'active' }, { id: false, name: 'InActive' }];
    
    this.getTextBoxListRoleWise();

    // // for temprory reson
    // this.addBranchDetails();

    this.dataService.getPeople()
    .pipe(map(x => x.filter(y => !y.disabled)))
    .subscribe((res) => {
        this.people = res;
        this.selectedPeople = [this.people[0].id];
    });

  }

  getTextBoxListRoleWise() {
    if (this.userRoleId === Constants.UserRoleList.SUPER_ADMIN.id) {
      switch (this.tabId) {
        case 1:
          this.roleNameHeading = Constants.tabMaster.ALL_USER.name;
          break;
        case 2:
          this.userData.userRoleId = Constants.UserRoleList.BANK_HO.id;
          this.roleNameHeading = Constants.tabMaster.BANK_PARTNER.name;
          this.isBankTextBoxView = true;
          this.getOrgList();
          break;
        case 3:
          this.roleNameHeading = Constants.tabMaster.ADMIN_USER.name;
          this.roleList = Constants.adminUserList;
          this.departmentList = _.filter(Constants.departmentList, (x: any) => x.id == Constants.department.TIIC.id || x.id == Constants.department.TAICO.id);
          this.isDepartmentTextBoxView = this.isRoleNameTextBoxView = true;
          break;
        case 4:
          this.userData.userRoleId = Constants.UserRoleList.FIELD_INSPECTION_OFFICER.id;
          this.isDepartmentTextBoxView = this.isDistrictTextBoxView = true;
          this.departmentList = _.filter(Constants.departmentList, (x: any) => x.id == Constants.department.TAICO.id || x.id == Constants.department.DIC.id);
          this.getDistrictList();
          this.roleNameHeading = Constants.tabMaster.FIELD_INSPECTION_OFFICER.name;
          break;
        case 5:
          this.userData.userRoleId = Constants.UserRoleList.LEAD_BANK_MANAGER.id;
          this.roleNameHeading = Constants.tabMaster.LEAD_BANK_MANAGER.name;
          break;
        case 6:
          this.userData.userRoleId = Constants.UserRoleList.GENERAL_MANAGER.id;
          this.roleNameHeading = Constants.tabMaster.GENERAL_MANAGER.name;
          break;
        default:
          break;
      }
    } else if (this.userRoleId === Constants.UserRoleList.ADMIN_MAKER.id) {
      if (this.tabId === 1) {
        this.userData.userRoleId = Constants.UserRoleList.BRANCH_MANAGER.id;
        this.isBranchNameTextBoxView = true;
        this.getBranchList();
      }
    }
  }



  numberOnly(event): boolean {
    const charCode = (event.which) ? event.which : event.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
      return false;
    }
    return true;
  }

  getOrgList() {
    this.tnService.getOrgList().subscribe(res => {
      if (res && res.listData) {
        this.orgList = res.listData;
      }
    })
  }

  // handle file input selected file put in formdata
  handleFileInput(files: FileList) {
    this.fileToUpload = files.item(0);
    if (this.fileToUpload == null) {
      return;
    }
  }

  getUserById() {
    const req = { userId: this.userId }
    this.tnService.getUserDetailByUserId(req).subscribe(res => {
      if (res.status === 200 && res.data) {
        console.log("SuccessFully");
        this.userData = res.data;
      } else {
        console.log("else")
      }
    });
  }

  saveOrUpdateUser() {
    this.submitted = false;
    setTimeout(() => {
      this.submitted = true;
    }, 0);

    if (this.addUserForm.invalid) {
      this.commonService.warningSnackBar("please fill user details")
      return;
    }


    if (this.userData.branchId === -1) {
      if (this.addBranchForm.invalid) {
        this.commonService.warningSnackBar("please fill Branch details")
        return;
      }
      this.userData.branchDetails = this.branchData;
    }

    console.log('this.userData: ', this.userData);
    this.tnService.createOrUpdateUser(this.userData).subscribe(res => {
      if (res.status === 200 && res.data) {
        // console.log("Successfully Created User");
        this.commonService.successSnackBar("Successfully Created User");
        this.router.navigate([Constants.ROUTE_URL.ALL_USER_LIST]);
      } else {
        // console.log("error while save or update user details");
        this.commonService.warningSnackBar(res.message);
      }
    });
  }

  getBranchList() {
    this.branchList = [{ id: 1, name: 'Ahmedabad' }, { id: 2, name: 'Surat' }, { id: 3, name: 'Bapunagar' }];
    this.branchList.unshift({ id: -1, name: 'Add Branch' });
  }

  // addBranchDetails() {
  //   this.addBranchDetailsFlag = true;
  //   this.getDistrictList();
  //   this.getCityList();
  // }

  getDistrictList() {
    this.districtList = [{ id: 1, name: 'Ahmedabad' }, { id: 2, name: 'Kunkavav' }];
  }

  getCityList() {
    this.cityList = [{ id: 1, name: 'Ahmedabad' }, { id: 2, name: 'Surat' }];
  }

  updateBranchName(branchId) {
    if (branchId === -1) {
      this.addBranchDetailsFlag = true;
      this.getDistrictList();
      this.getCityList();
    } else {
      this.addBranchDetailsFlag = false;
    }
  }

  // createBranch() {
  //   this.submitted = false;
  //   setTimeout(() => {
  //     this.submitted = true;
  //   }, 0);

  //   if (this.addBranchForm.invalid) {
  //     this.commonService.warningSnackBar("please fill Branch details")
  //     return;
  //   }

  //   // console.log('this.branchData: ', this.branchData);
  //   this.tnService.saveBranchDetail(this.branchData).subscribe(res => {
  //     if (res.status === 200 && res.data) {
  //       // console.log("Successfully Created User");
  //       this.commonService.successSnackBar("Successfully Created Branch");
  //       this.getBranchList();
  //       this.addBranchDetailsFlag = false;
  //       // this.router.navigate([Constants.ROUTE_URL.ALL_USER_LIST]);
  //     } else {
  //       this.commonService.warningSnackBar(res.message);
  //     }
  //   });
  // }
}
