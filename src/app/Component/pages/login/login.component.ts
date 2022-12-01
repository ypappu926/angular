import { Component, OnInit, AfterViewInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { first } from 'rxjs/operators';

import { ActivatedRoute, Router } from '@angular/router';
import { AuthenticationService } from '../../core/services/auth.service';
import { ApiService } from '../../../services/api.service';
import { CommonMethods } from 'src/app/CommoUtils/common-services/common-methods';
import { CommonService } from 'src/app/CommoUtils/common-services/common.service';
import { Constants } from 'src/app/CommoUtils/constants';
import { TnService } from 'src/app/services/tn.service';
import * as _ from 'lodash';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit, AfterViewInit {

  hide1 = true;
  loginForm!: FormGroup;
  submitted = false;
  returnUrl!: string;
  error = '';
  loading = false;
  userResponse: any = {};
  UserTypeList: any = [];
  // UserRoleList = Constants.RoleMaster;

  constructor(private formBuilder: FormBuilder, private route: ActivatedRoute, private router: Router, private tnService: TnService,
    private authenticationService: AuthenticationService,
    private apiService: ApiService,
    private commonMethods: CommonMethods, private commonService: CommonService) {
    this.UserTypeList = Constants.UserTypeList;
  }

  ngOnInit() {
    this.loginForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
      userType: [null, Validators.required]
    });
    // this.loginForm = this.formBuilder.group({
    //   email: ['care@superadmin.com', [Validators.required, Validators.email]],
    //   password: ['admin@123', Validators.required],
    //   userType: [3, Validators.required]
    // });
    // reset login status
    // this.authenticationService.logout();

    // get return url from route parameters or default to '/'
    // tslint:disable-next-line: no-string-literal
    // this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
    // this.setEmailAndPwd();
  }


  ngAfterViewInit() {
    // document.body.classList.add('authentication-bg');
    // document.body.classList.add('authentication-bg-pattern');
  }

  // convenience getter for easy access to form fields
  get f() { return this.loginForm.controls; }

  /**
   * On submit form
   */
  onSubmit() {
    this.submitted = true;
    const data: any = {};
    // stop here if form is invalid
    if (this.loginForm.invalid) {
      return;
    }

    this.loading = true;
    data.email = this.f.email.value;
    data.password = this.f.password.value;
    data.userType = this.f.userType.value;

    const loginData = this.commonMethods.getClientLoginDetails(); // to get login user's browser data
    if (!CommonService.isObjectNullOrEmpty(loginData)) {
      data.browserName = loginData.browser;
      data.browserVersion = loginData.browser_version;
      data.device = loginData.device;
      data.deviceType = loginData.deviceType;
      data.deviceOs = loginData.os;
      data.deviceOsVersion = loginData.os_version;
      data.userAgent = loginData.userAgent;
    }
    const validation = CommonService.getStorage('validations', true);
    CommonService.clearStorage();
    CommonService.setStorage(Constants.httpAndCookies.VALIDATIONS, validation);
    this.apiService.login(data).subscribe(res => {
      if (res.status === 200) {
        //this.commonService.successSnackBar(res.message);
        //this.loginButtonDisabled = false;
        CommonService.setAppCount(1); // to preventing multiple tab issue
        this.manageLocalStorage(res);

      } else {
        this.commonService.errorSnackBar(res.message);
        // this.loginForm.controls.captcha.patchValue('');
      }
    });
  }

  manageLocalStorage(res): boolean {
    CommonService.removeStorage(Constants.httpAndCookies.USERTYPE);
    CommonService.removeStorage(Constants.httpAndCookies.COOKIES_OBJ);
    this.userResponse = res;
    CommonService.setStorage(Constants.httpAndCookies.USERTYPE, this.userResponse.userType);
    CommonService.setStorage(Constants.httpAndCookies.USER_ID, this.userResponse.userId);
    if (!CommonService.isObjectNullOrEmpty(this.userResponse.fullName)) {
      CommonService.setStorage(Constants.httpAndCookies.USER_NAME, this.userResponse.fullName);
    } else {
      CommonService.setStorage(Constants.httpAndCookies.USER_NAME, this.userResponse.userName);
    }
    if (!CommonService.isObjectNullOrEmpty(this.userResponse.userRoleId) && !CommonService.isObjectNullOrEmpty(this.userResponse.userOrgId)) {
      CommonService.setStorage(Constants.httpAndCookies.ROLEID, this.userResponse.userRoleId);
      CommonService.setStorage(Constants.httpAndCookies.ORGID, this.userResponse.userOrgId);
      CommonService.setStorage(Constants.httpAndCookies.ORG_NAME, this.userResponse.userOrgName);
    }
    if (!CommonService.isObjectNullOrEmpty(this.userResponse.userRoleId)) {
      CommonService.setStorage(Constants.httpAndCookies.ROLEID, this.userResponse.userRoleId);
    }
    // save data in Localstorage
    const isSaved: boolean = CommonService.setSessionAndHttpAttr(btoa(this.userResponse.userName), this.userResponse, this.userResponse.loginToken);

    this.getAccessPath();
    return isSaved;
  }

  getAccessPath() {
    // this.rxilLogin();
    try {
      this.tnService.getAccessPaths().subscribe(success => {
        CommonService.setStorage(Constants.httpAndCookies.ACCESS_PATH, JSON.stringify(_.uniq(success.listData)));
        this.getMenuDetails();
      });
    } catch (error) {
      this.getMenuDetails();
    }
  }

  getMenuDetails() {
    this.tnService.getMenuDetails().subscribe(success => {
      CommonService.removeStorage(Constants.httpAndCookies.All_MENU);
      if (success.status === 200 && !this.commonService.isObjectNullOrEmpty(success.data)) {
        // SAVA ALL MENU IS LOCAL STORAGE
        CommonService.setStorage(Constants.httpAndCookies.All_MENU, success.data);

        // ADD ALL MENU_PATH IN STORAGE
        let navigatePath;
        let schemeId = [];
        const allMenu = JSON.parse(success.data);
        for (const p of allMenu) {
          schemeId.push(p.schemeId);
          if (p.navigatePath && p.isDashboard) {
            navigatePath = p.navigatePath;
            break;
          } else if (!_.isEmpty(p.childList)) {
            for (const q of p.childList) {
              if (q.navigatePath && q.isDashboard) {
                navigatePath = q.navigatePath;
                break;
              }
            }
          }
        }

        schemeId = _.uniq(schemeId);
        if (schemeId.length > 1) {
          navigatePath = Constants.ROUTE_URL.BANKER_DASHBOARD;
        } else {
          CommonService.setStorage(Constants.httpAndCookies.SCHEME_ID, schemeId.toString());
          navigatePath = navigatePath ? navigatePath : Constants.ROUTE_URL.BANKER_DASHBOARD;
          CommonService.setStorage(Constants.httpAndCookies.MAIN_DASHBOARD, navigatePath);
        }
        // console.log('navigatePath: ', navigatePath);
        this.router.navigate([navigatePath]);
        // this.commonMethods.redirectedToDashBoard(res.userRoleId);
      } else {
        // this.getAdminPermission();
        this.commonService.warningSnackBar("Error While get menu details")
      }
    });
  }

}
