import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CommonService } from 'src/app/CommoUtils/common-services/common.service';
import { Constants } from 'src/app/CommoUtils/constants';
import { TnService } from 'src/app/services/tn.service';
import { BankPartnerModel } from './bank-partner.model';

declare var jQuery: any;
declare var $: any;

@Component({
  selector: 'app-tiic-add-bank-partner',
  templateUrl: './tiic-add-bank-partner.component.html',
  styleUrls: ['./tiic-add-bank-partner.component.scss']
})
export class TIICAddBankPartnerComponent implements OnInit {
  @ViewChild('addUserForm') addUserForm: NgForm;

  breadCrumbItems!: Array<{}>;
  breadCrumbItemsView!: Array<{}>;

  selectValue!: string[];
  // Collapse declare
  isCollapsed!: boolean;
  toggle = false;

  submitted = false;
  userData = new BankPartnerModel();

  searchEmail;
  isUserExist;
  orgList: any = [];
  userId;
  loggedInUserId;
  isEdit=false;
  isViewMode=false;
  constructor(private modalService: NgbModal,
    private tnService: TnService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private commonService: CommonService) { }

  ngOnInit(): void {
    this.isCollapsed = false;
    this.breadCrumbItems = [{ label: 'Dashboard', path: '/' }, { label: 'Add Bank Partner', path: '/', active: true }];
    this.breadCrumbItemsView = [{ label: 'Dashboard', path: '/' }, { label: 'View Bank Partner', path: '/', active: true }];
    this.selectValue = ['Newest First', 'Oldest First'];
    this.loggedInUserId = parseInt(CommonService.getStorage(Constants.httpAndCookies.USER_ID, true));

    this.activatedRoute.queryParams.subscribe(params => {
      if (!this.commonService.isObjectNullOrEmpty(params)) {
        // console.log(params);
          if(!this.commonService.isObjectNullOrEmpty(params.id)){
            this.userId = CommonService.decryptFunction(params['id']);
          }
          if(!this.commonService.isObjectNullOrEmpty(params.isView)){
            this.isViewMode=Boolean(CommonService.decryptFunction(params['isView']));
          }
       
      }
     
    });
    this.getOrgList();
    if (this.userId != null) {
      this.isUserExist=false;
      this.isEdit=true;
      this.getUserById();
    }
  }

  numberOnly(event): boolean {
    const charCode = (event.which) ? event.which : event.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
      return false;
    }
    return true;

  }
 
  checkEmailAvailibility(isSave?): void {
    this.submitted=false;
    setTimeout(() => {
      this.submitted = true;
    }, 0);
    if (this.addUserForm.invalid) {
      this.commonService.warningSnackBar("Please enter Valid Email for example example@test.com")
      return;

    }
    if (this.searchEmail != null) {
      let req = {};
      req = { email: this.searchEmail }
      this.isUserExist = null;     
      this.tnService.checkEmailAvailibility(req).subscribe(res => {
        // console.log(res);
        if (res.status === 200) {
          this.isUserExist = res.data;
          // console.log(this.addUserForm);
          this.submitted=false;
          // if (this.isUserExist == false && isSave) {
          //   this.saveOrUpdateUser();
          // }
        }
      }, error => {
        // CommonService.errorSnackBar(error);
      });
    } else {
      this.commonService.errorSnackBar("Please enter E-mail to validate");
      
    }

  }

  getOrgList() {
    this.tnService.getOrgList().subscribe(res => {
      // console.log(res);
      if (res && res.listData) {
        // console.log(res.listData);
        this.orgList = res.listData;
      }
    })
  }
  saveOrUpdateUser() {
    this.submitted=false;
    setTimeout(() => {
      this.submitted = true;
    }, 0);
    if (this.addUserForm.invalid) {
      this.commonService.warningSnackBar("please fill user details")
      return;

    }
    if (this.userId == null) {
      this.userData.userRoleId = 6;
      this.userData.email = this.searchEmail;
      this.userData.isActive=true
    }
   
    this.userData.loggedInUserId = this.loggedInUserId;

    this.tnService.createOrUpdateUser(this.userData).subscribe(res => {
      if (res.status === 200 && res.data) {
        // console.log("Successfully Created User");
        this.commonService.successSnackBar("Successfully Created User");
        this.router.navigate([Constants.ROUTE_URL.TIIC_BANKER_PARTNER]);
      } else {
        // console.log("error while save or update user details");
        this.commonService.warningSnackBar(res.message);
      }
    });
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
  // Check_Email_user_Popup(){
  //   const config = {
  //     windowClass: 'Mediam-model',
  //     size: 'lg',
  //   };
  //   console.log("start popup")
  //   const modalRef = this.modalService.open(BUEmailCheckComponent, config);
  //   console.log("start popup")
  //   return modalRef;
  // }

}
