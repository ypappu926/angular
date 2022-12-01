import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import * as _ from 'lodash';
import { CommonService } from 'src/app/CommoUtils/common-services/common.service';
import { Constants } from 'src/app/CommoUtils/constants';
import { TnService } from 'src/app/services/tn.service';

declare var jQuery: any;
declare var $: any;

@Component({
  selector: 'app-branch-office-create',
  templateUrl: './branch-office-create.component.html',
  styleUrls: ['./branch-office-create.component.scss']
})
export class BranchOfficeCreateComponent implements OnInit {

  @ViewChild('addBranchForm') addBranchForm: NgForm;

  breadCrumbItems: Array<{}>;
  submitted = false;
  branchData: any = {};

  cityList: any = [];
  districtList: any = [];
  pincodeList: any = [];
  statusList: any = [];
  isEditMode = false;
  branchId: number;
  addUserDetailsForm = false;
  roleNameHeading = 'Branch Manager';
  isViewMode: boolean = false;

  constructor(private tnService: TnService, private commonService: CommonService, private router: Router) {
    this.branchId = +commonService.getURLData('branchId');
    this.isViewMode = commonService.getURLData('isViewMode') ? true : false;
    if (this.branchId) {
      this.isEditMode = true;
    }
  }

  ngOnInit(): void {
    this.statusList = [{ id: true, name: 'Active' }, { id: false, name: 'In-Active' }];
    if (this.isEditMode) {
      this.getBranchDetailsByBranchId();
    } else {
      this.branchData.userData = {};
      this.getPincodeMasterList();
      this.getDistrictList();
      this.getCityList();
    }

  }


  getBranchDetailsByBranchId() {
    this.tnService.getBranchDetailsByBranchId(this.branchId).subscribe(res => {
      if (res && res.data) {
        this.branchData = res.data;
        this.branchData.userData = {};
        // console.log('thixs.branchData: ', this.branchData);
        // this.getPincodeMasterList({ selectedDistrictId: this.branchData.selectedDistrictId });
        this.getBranchDistrictMapping({ selectedDistrictId: this.branchData.selectedDistrictId, isEditMode: this.isEditMode });
        this.getPincodeMasterList();
        this.getCityList();
        this.getDistrictList();
      }
    });
  }

  getDistrictList() {
    this.tnService.getDistrictList().subscribe(res => {
      if (res && res.data) {
        this.districtList = res.data;
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
    // this.branchData.pincodeId = undefined;
    // this.getPincodeMasterList(data);
    const data = { selectedDistrictId: this.branchData.selectedDistrictId };
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
            element.isDisabled = this.isViewMode || (!element.branchName && element.primaryBranch) || (element.branchId == this.branchData.id) ? true : false;
          });
        }

        // console.log('this.branchData.branchDistrictMapping: ', this.branchData.branchDistrictMapping);
      } else {
        this.branchData.branchDistrictMapping = [];
      }
    });
  }

  numberOnly(event): boolean {
    const charCode = (event.which) ? event.which : event.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
      return false;
    }
    return true;
  }

  saveOrUpdateBranch() {
    this.submitted = false;
    setTimeout(() => {
      this.submitted = true;
    }, 0);

    if (this.addBranchForm.invalid) {
      this.addBranchForm.form.markAllAsTouched();
      this.commonService.warningSnackBar("please fill required Branch details")
      return;
    }

    if (this.branchData && !_.isEmpty(this.branchData.branchDistrictMapping)) {
      this.branchData.branchDistrictMapping.forEach(element => {
        element.primaryBranch = (!element.branchId || element.primaryBranch) ? true : false;
      });
    }

    this.branchData.isEditMode = this.isEditMode;

    if (this.isEditMode) {
      this.branchData.userData = undefined
    }

    this.tnService.createOrUpdateBranchDetails(this.branchData).subscribe(res => {
      if (res.status === 200 && res.data) {
        // console.log("Successfully Created User");
        this.commonService.successSnackBar('Successfully' + (this.isEditMode ? ' Updated ' : ' Created ') + 'User');
        this.router.navigate([Constants.ROUTE_URL.ALL_OFFICE_LIST]);
      } else {
        this.commonService.warningSnackBar(res.message);
      }
    });
  }


}
