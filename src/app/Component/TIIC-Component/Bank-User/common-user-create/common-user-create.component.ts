import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { CommonService } from 'src/app/CommoUtils/common-services/common.service';
import { Constants } from 'src/app/CommoUtils/constants';
import { TnService } from 'src/app/services/tn.service';
import * as _ from 'lodash';
import { CommonMethods } from 'src/app/CommoUtils/common-services/common-methods';

declare var jQuery: any;

@Component({
  selector: 'app-common-user-create',
  templateUrl: './common-user-create.component.html',
  styleUrls: ['./common-user-create.component.scss']
})
export class CommonUserCreateComponent implements OnInit {
  @ViewChild('addUserForm') addUserForm: NgForm;
  @ViewChild('addBranchForm') addBranchForm: NgForm;

  // bread crumb items
  breadCrumbItems: Array<{}>;
  fileToUpload: File = null;

  tabId: number;
  userTypeId: number;
  userRoleId: number;
  userOrgId: number;
  isViewMode: boolean = false;
  isEditMode = false;
  isSchemeListShow = false;
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
  pincodeList: any = [];

  isBankTextBoxView = false;
  isDepartmentTextBoxView = false;
  isRoleNameTextBoxView = false;
  isDistrictTextBoxView = false;
  isBranchNameTextBoxView = false;
  addBranchDetailsFlag = false;

  schemeId;
  selectedScheme: any = [];
  schemeMasterList: any = [];
  constants = Constants;
  // branchDistrictMapping: any = [];

  constructor(private tnService: TnService, private router: Router, private commonService: CommonService, private commonMethods: CommonMethods) {
    this.tabId = +commonService.getURLData('tabId');
    this.userId = +commonService.getURLData('userId');
    this.isViewMode = commonService.getURLData('isViewMode') ? true : false;
    this.userTypeId = +CommonService.getStorage(Constants.httpAndCookies.USERTYPE, true);
    this.userRoleId = +CommonService.getStorage(Constants.httpAndCookies.ROLEID, true);
    this.userOrgId = +CommonService.getStorage(Constants.httpAndCookies.ORGID, true);
    this.schemeId = +CommonService.getStorage(Constants.httpAndCookies.SCHEME_ID, true);
    this.isEditMode = this.userId ? true : false;
    this.isSchemeListShow = (this.schemeId && this.schemeId == 1) ? false : true;

  }

  ngOnInit(): void {

    this.breadCrumbItems = [{ label: 'Dashboard', path: '/', active: true }, { label: 'Bank Users', path: '/', active: true }];
    this.statusList = [{ id: true, name: 'Active' }, { id: false, name: 'In-Active' }];

    if (this.isEditMode) {
      this.getUserById();
    }
    //  else {
    //   this.userData = Constants.setJSON;
    // }
    this.getTextBoxListRoleAndSchemeWise(this.userRoleId, this.schemeId, this.tabId);
    // this.getTextBoxListRoleAndSchemeWise(2, 1, 3);
  }

  getUserById() {
    const req = { userId: this.userId }
    this.tnService.getUserDetailByUserIdWithDistrict(req).subscribe(res => {
      if (res && res.status === 200 && res.data) {
        this.userData = res.data;
      }
    });
  }

  // evaluateCondition(condition) {
  //   return eval(condition);
  // }

  evaluateFunction(event) {
    eval(event);
  }

  getTextBoxListRoleAndSchemeWise(schemeId, roleId, tabId) {
    // if (data) {
    //   for (const key in data) {
    //     if (key == 'functionName') {
    //       this.evaluateFunction(data[key]);
    //     } else {
    //       const arr = key.split('.');
    //       if (arr.length == 1) {
    //         this[arr[arr.length - 1]] = data[key];
    //       } else if (arr.length == 2) {
    //         this[arr[arr.length - 2]][arr[arr.length - 1]] = data[key];
    //       }
    //     }
    //   }
    // }

    const whereClause = "scheme_id = " + schemeId + " AND role_id = " + roleId + " AND tab_id = " + tabId + " AND is_active = TRUE ";
    this.tnService.getCommonList("getTextBox", whereClause).subscribe(res => {
      if (res && res.data) {
        res.data.forEach(element => {
          this.evaluateFunction(element.dataValue);
        });
      }
    });
  }


  // getTextBoxListRoleWise() {

  //   switch (this.userRoleId) {
  //     case Constants.UserRoleList.SUPER_ADMIN.id:
  //       switch (this.tabId) {
  //         case Constants.tabMaster.ALL_USER.id:
  //           this.roleNameHeading = Constants.tabMaster.ALL_USER.name;
  //           break;
  //         case Constants.tabMaster.BANK_PARTNER.id:
  //           this.userData.userRoleId = Constants.UserRoleList.BANK_HO.id;
  //           this.roleNameHeading = Constants.tabMaster.BANK_PARTNER.name;
  //           this.isBankTextBoxView = true;
  //           this.getOrgList();
  //           break;
  //         case Constants.tabMaster.ADMIN_USER.id:
  //           this.roleNameHeading = Constants.tabMaster.ADMIN_USER.name;
  //           this.roleList = Constants.adminUserList;
  //           this.departmentList = _.filter(Constants.departmentList, (x: any) => x.id == Constants.department.TIIC.id || x.id == Constants.department.TAICO.id || x.id == Constants.department.TNCGS.id);
  //           this.isDepartmentTextBoxView = true;
  //           this.isRoleNameTextBoxView = true;
  //           break;
  //         case Constants.tabMaster.FIELD_INSPECTION_OFFICER.id:
  //           this.roleNameHeading = Constants.tabMaster.FIELD_INSPECTION_OFFICER.name;
  //           this.userData.userRoleId = Constants.UserRoleList.FIELD_INSPECTION_OFFICER.id;
  //           this.isDepartmentTextBoxView = true;
  //           this.isDistrictTextBoxView = true;
  //           this.departmentList = _.filter(Constants.departmentList, (x: any) => x.id == Constants.department.DIC.id); //  x.id == Constants.department.TAICO.id ||
  //           this.getDistrictList();
  //           break;
  //         case Constants.tabMaster.LEAD_BANK_MANAGER.id:
  //           this.roleNameHeading = Constants.tabMaster.LEAD_BANK_MANAGER.name;
  //           this.userData.userOrgId = this.userOrgId;
  //           this.userData.userRoleId = Constants.UserRoleList.LEAD_BANK_MANAGER.id;
  //           this.isDistrictTextBoxView = true;
  //           this.getDistrictList();
  //           break;
  //         case Constants.tabMaster.GENERAL_MANAGER.id:
  //           this.roleNameHeading = Constants.tabMaster.GENERAL_MANAGER.name;
  //           this.userData.userOrgId = CommonService.getStorage(Constants.httpAndCookies.ORGID, true);
  //           this.userData.userRoleId = Constants.UserRoleList.GENERAL_MANAGER.id;
  //           this.isDistrictTextBoxView = true;
  //           this.getDistrictList();
  //           break;
  //         default:
  //           break;
  //       }
  //       break;
  //     case Constants.UserRoleList.ADMIN_MAKER.id:
  //       if (this.tabId === Constants.tabMaster.BRANCH_MANAGER.id) {
  //         this.roleNameHeading = Constants.tabMaster.BRANCH_MANAGER.name;
  //         this.userData.userRoleId = Constants.UserRoleList.BRANCH_MANAGER.id;
  //         this.userData.userOrgId = this.userOrgId;
  //         this.isBranchNameTextBoxView = true;
  //         this.getBranchList();
  //       }
  //       break;
  //     case Constants.UserRoleList.ADMIN_CHECKER.id:
  //       if (this.tabId === Constants.tabMaster.BRANCH_MANAGER.id) {
  //         this.roleNameHeading = Constants.tabMaster.BRANCH_MANAGER.name;
  //         this.userData.userRoleId = Constants.UserRoleList.BRANCH_MANAGER.id;
  //         this.userData.userOrgId = CommonService.getStorage(Constants.httpAndCookies.ORGID, true);
  //         this.isBranchNameTextBoxView = true;
  //         this.getBranchList();
  //       }
  //       break;
  //     case Constants.UserRoleList.BRANCH_MANAGER.id:
  //       if (this.tabId === Constants.tabMaster.FIELD_INSPECTION_OFFICER.id) {
  //         this.roleNameHeading = Constants.tabMaster.FIELD_INSPECTION_OFFICER.name;
  //         this.userData.userRoleId = Constants.UserRoleList.FIELD_INSPECTION_OFFICER.id;
  //         this.userData.userOrgId = CommonService.getStorage(Constants.httpAndCookies.ORGID, true); // Constants.department.TIIC.id;
  //       }
  //       break;
  //     case Constants.UserRoleList.CARE_SUPER_ADMIN.id:
  //       this.getSchemeList();
  //       switch (this.tabId) {
  //         // case Constants.tabMaster.ALL_USER.id:
  //         //   break;
  //         case Constants.tabMaster.PRODUCT_USER.id:

  //           break;
  //         case Constants.tabMaster.ADMIN_USER.id:

  //           break;

  //         default:
  //           break;
  //       }
  //       break;
  //     default:
  //       break;
  //   }
  // }

  getSchemeList() {
    this.tnService.getProductListByUserId().subscribe(res => {
      if (res && res.data) {
        this.schemeMasterList = res.data;
        console.log('this.schemeMasterList: ', this.schemeMasterList);
      }
    });
  }

  getOrgList() {
    this.tnService.getAllByOrgType(1).subscribe(res => {
      // console.log('res: ', res);
      if (res && res.listData) {
        this.orgList = res.listData;
      }
    })
  }

  getDistrictList() {
    this.tnService.getDistrictList().subscribe(res => {
      if (res && res.data) {
        this.districtList = res.data;
      }
    });
  }

  keyPressEvent(event, type): boolean {
    return this.commonMethods.keyPressEvent(event, type);
  }

  changeBranchName(branchId) {
    if (branchId === -1) {
      this.addBranchDetailsFlag = true;
      this.getPincodeMasterList();
      this.getDistrictList();
      this.getCityList();
    } else {
      this.addBranchDetailsFlag = false;
    }
  }

  getBranchList() {
    this.tnService.getBranchList().subscribe(res => {
      if (res && res.data) {
        this.branchList = res.data;
        this.branchList.unshift({ branchId: -1, name: 'Add New Branch', code: -1 });
      }
    });
  }

  getCityList() {
    this.tnService.getCityListByStateId(35).subscribe(res => {
      this.cityList = [];
      if (res && res.listData) {
        this.cityList = res.listData;
      } else {
        this.cityList = [];
      }
    });
  }

  onChangeDistrict() {
    const data = { selectedDistrictId: this.branchData.selectedDistrictId };
    // this.getPincodeMasterList(data);
    this.getBranchDistrictMapping(data);
  }

  getPincodeMasterList() {
    // getPincodebyDistrictIdList({ selectedDistrictId: this.branchData.selectedDistrictId })
    this.tnService.getAllPincodeMasterList().subscribe(res => {
      this.pincodeList = [];
      if (res && res.data) {
        this.pincodeList = res.data;
      } else {
        this.pincodeList = [];
      }
    });
  }

  getBranchDistrictMapping(data) {
    this.tnService.getBranchDistrictMapping(data).subscribe(res => {
      this.branchData.branchDistrictMapping = [];
      if (res && res.data) {
        this.branchData.branchDistrictMapping = res.data;
        if (this.branchData && !_.isEmpty(this.branchData.branchDistrictMapping)) {
          this.branchData.branchDistrictMapping.forEach(element => {
            element.primaryBranch = (!element.branchId || element.primaryBranch || element.branchId == this.branchData.id) ? true : false;
          });
        }
      } else {
        this.branchData.branchDistrictMapping = [];
      }
    });
  }


  // handle file input selected file put in formdata
  handleFileInput(files: FileList) {
    this.fileToUpload = files.item(0);
    if (this.fileToUpload == null) {
      return;
    }
  }

  selectAllScheme(event) {
    this.selectedScheme = [];
    if (event.target.checked) {
      this.schemeMasterList.forEach(element => {
        this.selectedScheme.push(element.schemeId);
      });
    } else {
      this.selectedScheme = [];
    }
  }

  saveOrUpdateUser() {
    this.submitted = false;
    setTimeout(() => {
      this.submitted = true;
    }, 0);

    if (this.addUserForm.invalid) {
      this.addUserForm.form.markAllAsTouched();
      this.commonService.warningSnackBar("please fill user details")
      return;
    }

    if (this.userData.branchId === -1) {
      if (this.addBranchForm.invalid) {
        this.addBranchForm.form.markAllAsTouched();
        this.commonService.warningSnackBar("please fill Branch details")
        return;
      }

      if (this.branchData && !_.isEmpty(this.branchData.branchDistrictMapping)) {
        this.branchData.branchDistrictMapping.forEach(element => {
          element.primaryBranch = !element.branchId || element.primaryBranch ? true : false;
          element.isDisabled = !element.branchId && element.primaryBranch ? true : false;
        });
        // console.log('this.branchData.branchDistrictMapping: ', this.branchData.branchDistrictMapping);
      }
      this.userData.branchDetails = this.branchData;
    }
    this.userData.isEditMode = this.isEditMode;
    this.userData.selectedScheme = this.isSchemeListShow ? this.selectedScheme : [1];
    console.log('this.userData: ', this.userData);

    // this.tnService.createUpdateUser(this.userData).subscribe(res => {
    //   if (res.status === 200 && res.data) {
    //     // console.log("Successfully Created User");
    //     this.commonService.successSnackBar('Successfully' + (this.isEditMode ? ' Updated ' : ' Created ') + 'User');
    //     this.router.navigate([Constants.ROUTE_URL.ALL_USER_LIST]);
    //   } else {
    //     // console.log("error while save or update user details");
    //     this.commonService.warningSnackBar(res.message);
    //   }
    // });
  }
}
