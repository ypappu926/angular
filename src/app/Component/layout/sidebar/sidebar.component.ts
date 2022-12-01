import { Component, OnInit, AfterViewInit, ElementRef, ViewChild, Input, OnChanges } from '@angular/core';
import { Router } from '@angular/router';
import * as _ from 'lodash';
import MetisMenu from 'metismenujs';
import { Subscription } from 'rxjs';
import { CommonService } from 'src/app/CommoUtils/common-services/common.service';
import { Constants } from 'src/app/CommoUtils/constants';
import { TnService } from 'src/app/services/tn.service';
import { UserProfileService } from '../../core/services/user.service';


declare var jQuery: any;
declare var $: any;
@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent implements OnInit, AfterViewInit, OnChanges {
  @Input() isCondensed = false;

  menu: any;

  collapse: boolean = false;
  Dashbordcollapse: boolean = false;
  UserCreation: boolean = false;
  ProductScoringcollapse: boolean = false;
  UserManagementcollapse: boolean = false;
  Reportscollapse: boolean = false;
  BankProfilecollapse: boolean = false;
  Monitoringcollapse: boolean = false;

  userType;
  userRoleId;
  userId;
  constant;
  dashboardId;

  @ViewChild('sideMenu', { static: false }) sideMenu!: ElementRef;

  menuData: any = [];
  isDashRouterUrl: boolean = false
  isLoginUrl: boolean = false;
  isChangePasswordRouterUrl: boolean = false;
  routeMainPath: any;
  roleName: any;
  updateDataObserver = new Subscription();

  constructor(private router: Router, private tnService: TnService, private commonService: CommonService) {
    this.userType = Number(CommonService.getStorage(Constants.httpAndCookies.USERTYPE, true));
    this.userId = Number(CommonService.getStorage(Constants.httpAndCookies.USER_ID, true));
    this.userRoleId = Number(CommonService.getStorage(Constants.httpAndCookies.ROLEID, true));
    this.dashboardId = Number(CommonService.getStorage(Constants.httpAndCookies.DASHBOARD_ID, true));
    this.roleName = _.find(Constants.RoleMaster, (x: any) => (x.id === this.userRoleId));
    this.constant = Constants;
    if (this.userId) {
      this.getMenuDetails(this.dashboardId);
    }
  }

  ngOnDestroy() {
    this.updateDataObserver.unsubscribe();
  }

  ngOnInit() {
    this.isDashRouterUrl = (this.router.url === (Constants.ROUTE_URL.BANKER_DASHBOARD));
    this.isLoginUrl = (this.router.url.includes(Constants.ROUTE_URL.LOGIN));
    this.isChangePasswordRouterUrl = this.router.url.includes(Constants.ROUTE_URL.CHANGE_PASSWORD);
    this.updateDataObserver = this.tnService.updateDataSubscriber$.subscribe((data: any) => {
      if (data) {
        this.dashboardId = Number(CommonService.getStorage(Constants.httpAndCookies.DASHBOARD_ID, true));
        this.getMenuDetails(this.dashboardId);
      }
    });
    // this java script Add Nikul Do not-Remove 1-1-2020 Start point
    (function ($) {
      $(document).ready(function () {
        ResizeView();
        //console.log("Working this")
      })

      $(window).resize(function () {
        ResizeView();
      });

    })(jQuery);

    // this java script Add Nikul Do not-Remove 1-1-2020 End Point
    function ResizeView() {
      const width = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
      if (width < 1450) {
        document.body.classList.add('enlarged');
        document.body.classList.remove('sidebar-enable');
        return true;
      } else {
        document.body.classList.add('sidebar-enable');
        document.body.classList.remove('enlarged');
        return false;
      }
    }
  }

  // getMenuDetails() {
  //   this.tnService.getMenuDetails().subscribe(success => {
  //     if (success.status === 200) {
  //       this.menuData = JSON.parse(success.data);
  //       // console.log('this.menuData: ', this.menuData);
  //       if (!this.commonService.isObjectNullOrEmpty(this.menuData)) {
  //         this.menuData.forEach(element => {
  //           if(this.router.url == element.navigatePath){
  //             element.isActive=true;
  //           }
  //           if (element.childList != undefined) {
  //             element.isCollapse = element.childList.length > 0 ? false : true;
  //           } else {
  //             element.childList = [];
  //             element.isCollapse = null;
  //           }
  //         });
  //       }
  //     } else {
  //       this.commonService.errorSnackBar("Error While get menu details")
  //     }
  //   });
  // }

  getMenuDetails(dashboardId: any) {
    this.menuData = [];
    const allMenu = JSON.parse(CommonService.getStorage(Constants.httpAndCookies.All_MENU, true));

    // const roleId = CommonService.getStorage(Constants.httpAndCookies.ROLEID, true);
    // this.menuData = (roleId == Constants.UserRoleList.FIELD_INSPECTION_OFFICER.id || roleId == Constants.UserRoleList.BRANCH_MANAGER.id) ? _.filter(allMenu, (x: any) => x.dashboardId == dashboardId) : allMenu;
    this.menuData = (this.userRoleId == Constants.UserRoleList.FIELD_INSPECTION_OFFICER.id || this.userRoleId == Constants.UserRoleList.BRANCH_MANAGER.id) ? _.filter(allMenu, (x: any) => x.dashboardId == dashboardId) : allMenu;
    if (!this.commonService.isObjectNullOrEmpty(this.menuData)) {
      this.menuData.forEach(element => {
        if (this.router.url == element.navigatePath) {
          element.isActive = true;
        }
        if (element.childList != undefined) {
          element.isCollapse = element.childList.length > 0 ? false : true;
        } else {
          element.childList = []
          element.isCollapse = null;
        }
      });
    }
  }

  clearTabs() {
    CommonService.removeStorage(Constants.httpAndCookies.HO_BO_DASHBOARD_TAB);
    CommonService.removeStorage(Constants.httpAndCookies.SUPER_ADMIN_DASHBOARD_TAB);
    CommonService.removeStorage(Constants.httpAndCookies.BO_DASHBOARD_TAB);
  }

  routeUrl(item) {
    this.clearTabs();
    if (this.commonService.isObjectNullOrEmpty(item.navigatePath)) {
      item.isCollapse = !item.isCollapse;
    } else {
      item.isActive = true;
      this.inActiveOthers(item);
      this.router.navigate([item.navigatePath]);
    }
  }


  inActiveOthers(currentActive) {
    this.menuData.forEach(element => {
      if (element.displayName != currentActive.displayName) {
        element.isActive = false;
      }
    });
  }

  ngAfterViewInit() {
    // this.menu = new MetisMenu(this.sideMenu.nativeElement);
    // this._activateMenuDropdown();
  }

  ngOnChanges() {
    if (!this.isCondensed && this.sideMenu || this.isCondensed) {
      setTimeout(() => {
        this.menu = new MetisMenu(this.sideMenu.nativeElement);
      });
    } else if (this.menu) {
      this.menu.dispose();
    }
  }
  /**
   * small sidebar
   */

  smallSidebar() {
    document.body.classList.add('left-side-menu-sm');
    document.body.classList.remove('left-side-menu-dark');
    document.body.classList.remove('topbar-light');
    document.body.classList.remove('boxed-layout');
    document.body.classList.remove('enlarged');
  }

  /**
   * Dark sidebar
   */
  darkSidebar() {
    document.body.classList.remove('left-side-menu-sm');
    document.body.classList.add('left-side-menu-dark');
    document.body.classList.remove('topbar-light');
    document.body.classList.remove('boxed-layout');
  }

  /**
   * Light Topbar
   */
  lightTopbar() {
    document.body.classList.add('topbar-light');
    document.body.classList.remove('left-side-menu-dark');
    document.body.classList.remove('left-side-menu-sm');
    document.body.classList.remove('boxed-layout');

  }

  /**
   * Sidebar collapsed
   */
  sidebarCollapsed() {
    document.body.classList.remove('left-side-menu-dark');
    document.body.classList.remove('left-side-menu-sm');
    document.body.classList.toggle('enlarged');
    document.body.classList.remove('boxed-layout');
    document.body.classList.remove('topbar-light');
  }

  /**
   * Boxed Layout
   */
  boxedLayout() {
    document.body.classList.add('boxed-layout');
    document.body.classList.remove('left-side-menu-dark');
    document.body.classList.add('enlarged');
    document.body.classList.remove('left-side-menu-sm');
  }

  /**
   * Activates the menu dropdown
   */
  _activateMenuDropdown() {

    const links: any = document.getElementsByClassName('side-nav-link-ref');
    let menuItemEl = null;
    // tslint:disable-next-line: prefer-for-of
    for (let i = 0; i < links.length; i++) {
      // tslint:disable-next-line: no-string-literal
      if (window.location.pathname === links[i]['pathname']) {
        menuItemEl = links[i];
        break;
      }
    }

    if (menuItemEl) {
      menuItemEl.classList.add('active');

      const parentEl = menuItemEl.parentElement;
      if (parentEl) {
        parentEl.classList.add('active');

        const parent2El = parentEl.parentElement;
        if (parent2El) {
          parent2El.classList.add('in');
        }

        const parent3El = parent2El.parentElement;
        if (parent3El) {
          parent3El.classList.add('active');
          parent3El.firstChild.classList.add('active');
        }
      }
    }
  }

}
