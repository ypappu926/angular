import { Component, OnInit, AfterViewInit } from '@angular/core';
import { Router } from '@angular/router';
import { ThemeService } from 'src/app/CommoUtils/common-services/Theme_service/theme.service';
import { Constants } from 'src/app/CommoUtils/constants';



@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.scss']
})
export class LayoutComponent implements OnInit, AfterViewInit {

  isCondensed = false;
  isLoginRouterURL: any = false;
  isChangePasswordRouterUrl: any = false;
  isDashboardRouterUrl: any = false;
  isHeaderWithoutRouterURL:any = false;
  isDisbursmentCertificateRouterUrl: boolean = false;

  constructor(private router: Router,private themeService: ThemeService) { }

  changeTheme(name) {
    this.themeService.setTheme(name);
    // console.log('============================>',name)
  }


  ngOnInit() {
    this.changeTheme('TamilNaduColor');
    this.isLoginRouterURL = (this.router.url.includes(Constants.ROUTE_URL.LOGIN));
    this.isChangePasswordRouterUrl = (this.router.url.includes(Constants.ROUTE_URL.CHANGE_PASSWORD));
    this.isDashboardRouterUrl = (this.router.url.includes(Constants.ROUTE_URL.BANKER_DASHBOARD) || this.router.url.includes('/ESignCompleted') );
    this.isHeaderWithoutRouterURL = (this.router.url.includes(Constants.ROUTE_URL.LOGIN) || this.router.url.includes(Constants.ROUTE_URL.CHANGE_PASSWORD) || this.router.url.includes('/DisbursmentCertificate') );
    this.isDisbursmentCertificateRouterUrl = this.router.url.includes('/DisbursmentCertificate');
  }

  isMobile() {
    const ua = navigator.userAgent;
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini|Mobile|mobile|CriOS/i.test(ua);
  }

  ngAfterViewInit() {
    // document.body.classList.remove('authentication-bg');
    // document.body.classList.remove('authentication-bg-pattern');



    if (!this.isMobile()) {
      document.body.classList.add('sidebar-enable');
    }
  }

  /**
   * on settings button clicked from topbar
   */
  onSettingsButtonClicked() {
    document.body.classList.toggle('right-bar-enabled');
  }

  /**
   * On mobile toggle button clicked
   */
  onToggleMobileMenu() {
    document.body.classList.toggle('sidebar-enable');
    if (!this.isMobile()) {
      document.body.classList.toggle('enlarged');
      this.isCondensed = !this.isCondensed;
    }
  }
}
