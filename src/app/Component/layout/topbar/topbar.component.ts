import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { constant } from 'lodash';
import { CommonService } from 'src/app/CommoUtils/common-services/common.service';
import { ThemeService } from 'src/app/CommoUtils/common-services/Theme_service/theme.service';
import { Constants } from 'src/app/CommoUtils/constants';
import { TnService } from 'src/app/services/tn.service';
import { AuthGuard } from '../../core/guards/auth.guard';
import { AuthenticationService } from '../../core/services/auth.service';


@Component({
  selector: 'app-topbar',
  templateUrl: './topbar.component.html',
  styleUrls: ['./topbar.component.scss']
})
export class TopbarComponent implements OnInit {

  notificationItems!: Array<{}>;
  notificationList = [];
  DashboardChangeItems!: Array<{}>;

  languages!: Array<{
    id: number,
    flag?: string,
    name: string
  }>;
  selectedLanguage!: {
    id: number,
    flag?: any,
    name: string
  };

  requestData = {
    pageIndex: 0,
    size: 10,
  }
  openMobileMenu!: boolean;
  @Output() settingsButtonClicked = new EventEmitter();
  @Output() mobileMenuButtonClicked = new EventEmitter();

  dashboardName: any;
  dashboardId: any;
  isDashRouterUrl: boolean = false
  userDetails: any = {};
  isLoanHederShow: boolean = true;
  isLoginUrl: boolean = false;
  isChangePasswordRouterUrl: boolean = false;
  userId;
  userRoleId;
  dashboardBoxList: any = [];
  userRoleList = Constants.UserRoleList;
  constructor(public router: Router, private authService: AuthenticationService, private themeService: ThemeService, private authG: AuthGuard, private tnService: TnService, private translate: TranslateService) {
    this.userId = Number(CommonService.getStorage(Constants.httpAndCookies.USER_ID, true));
    this.userRoleId = Number(CommonService.getStorage(Constants.httpAndCookies.ROLEID, true));
    this.dashboardId = CommonService.getStorage(Constants.httpAndCookies.DASHBOARD_ID, true);
    if (this.dashboardId) {
      this.dashboardName = Constants.DASHBOARD_LIST.find(item => item.id == this.dashboardId).name;
    }
  }

  /* Don't Remove this Code Nikul Start */
  // changeTheme(name) {
  //   this.themeService.setTheme(name);
  //   console.log('============================>',name)
  // this.changeTheme('sbiColor');
  // }
  /* Don't Remove this Code Nikul End*/

  ngOnInit() {
    this.isDashRouterUrl = (this.router.url === (Constants.ROUTE_URL.BANKER_DASHBOARD));
    this.isLoginUrl = (this.router.url.includes(Constants.ROUTE_URL.LOGIN));
    this.isChangePasswordRouterUrl = this.router.url.includes(Constants.ROUTE_URL.CHANGE_PASSWORD);
    // get the notifications
    // this._fetchNotifications();
    this.openMobileMenu = false;
    if (this.userId != 0 && !this.isLoginUrl && !this.isChangePasswordRouterUrl) {
      this.getUserDetails();
    }
  }

  getUserDetails() {
    const req = { userId: this.userId }
    this.tnService.getUserDetailByUserId(req).subscribe(res => {
      if (res.status === 200 && res.data) {
        // console.log(res.data);
        this.userDetails = res.data;
        if (this.userRoleId == Constants.UserRoleList.BRANCH_MANAGER.id || this.userRoleId == Constants.UserRoleList.FIELD_INSPECTION_OFFICER.id) {
          this.getDashBoardDataByUserId();
        }
      } else {
        console.log("else");
      }
    });
  }

  getDashBoardDataByUserId() {
    this.tnService.getDashBoardDataByUserId().subscribe(res => {
      if (res && res.data) {
        this.dashboardBoxList = JSON.parse(res.data);
        // console.log('this.dashboardBoxList: ', this.dashboardBoxList);
      }
    });
  }

  navigateOnSubmit(data) {
    CommonService.removeStorage(Constants.httpAndCookies.DASHBOARD_ID);
    CommonService.setStorage(Constants.httpAndCookies.DASHBOARD_ID, data.dashboardId.toString());
    this.tnService.emitData(true);
    this.router.navigate([data.routingPath], { queryParams: { dashboardId: CommonService.encryptFunction(data.dashboardId) } });
    this.dashboardName = Constants.DASHBOARD_LIST.find(item => item.id == data.dashboardId).name;
  }


  /**
   * Change the language
   * @param language language
   */
  changeLanguage(language: any) {
    this.selectedLanguage = language;
  }


  /**
   * Toggles the right sidebar
   */
  toggleRightSidebar() {
    this.settingsButtonClicked.emit();
  }

  /**
   * Toggle the menu bar when having mobile screen
   */
  toggleMobileMenu(event: any) {
    event.preventDefault();
    this.mobileMenuButtonClicked.emit();
  }

  /**
  * Logout the user
  */
  logout() {
    this.authG.logoutUser(true);
  }

  changeLang(language?: string) {
    this.translate.setDefaultLang(language);
    this.translate.use(language);
    CommonService.setStorage('locale', language);
  }

  /**
   * Fetches the notification
   * Note: For now returns the hard coded notifications
   */
  _fetchNotifications() {
    this.notificationItems = [{
      text: '12,597 Proposal Pending in MSME Loan',
      subText: '1 min ago',
      icon: 'fmdi fmdi-notifications-active',
      bgColor: 'warning',
    },
    {
      text: 'Contactless Loan GST based invoice financing is disabled by Admin Checker (Rushi Mistry)',
      subText: '5 min ago',
      icon: 'fmdi fmdi-stop',
      bgColor: 'secondary',
    },
    {
      text: 'Contactless Loan GST based invoice financing is rejected by Admin Checker (Rushi Mistry)',
      subText: '30 min ago',
      icon: 'fmdi fmdi-close',
      bgColor: 'danger',
    },
    {
      text: 'Contactless Loan GST based invoice financing is sent back by Admin Checker (Rushi Mistry)',
      subText: '2 days ago',
      icon: 'fmdi fmdi-arrow-left',
      bgColor: 'info',
    },
    {
      text: 'Contactless Loan GST based invoice financing is approved and sent to live by Admin Checker (Rushi Mistry)',
      subText: '1 min ago',
      icon: 'fmdi fmdi-check',
      bgColor: 'success',
    },
    ];
    this.DashboardChangeItems = [
      {
        loanName: 'Education Loan',
        RoleUserName: 'Admin Maker',
        icon: 'assets/images/Dashabord/ATM-Dash/Education_Loan.svg',
        redirectTo: '/EL/Product-List'
      },
      {
        loanName: 'Home Loan',
        RoleUserName: 'Admin Maker',
        icon: 'assets/images/Dashabord/ATM-Dash/Home_Loan.svg',
        redirectTo: '/HL/Product-List'
      },
      {
        loanName: 'Agri. Infra. Loan',
        RoleUserName: 'Admin Maker',
        icon: 'assets/images/Dashabord/ATM-Dash/Agriculture_Infrastructure_Loan.svg',
        redirectTo: '/Agri/Product-List'
      },
      {
        loanName: 'Business Activity Loan',
        RoleUserName: 'Admin Maker',
        icon: 'assets/images/Dashabord/ATM-Dash/Business_Activity_Loan.svg',
        redirectTo: '/BL/Product-List'
      },
      {
        loanName: 'Livelihood Loan',
        RoleUserName: 'Admin Maker',
        icon: 'assets/images/Dashabord/ATM-Dash/Loan_for_Livelihood.svg',
        redirectTo: '/Livelihood/Product-List'
      }
    ]
  }
}
