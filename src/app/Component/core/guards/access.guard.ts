import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import * as _ from 'lodash';
import { Observable } from 'rxjs';
import { CommonMethods } from 'src/app/CommoUtils/common-services/common-methods';
import { CommonService } from 'src/app/CommoUtils/common-services/common.service';
import { LoaderService } from 'src/app/CommoUtils/common-services/LoaderService';
import { Constants } from 'src/app/CommoUtils/constants';

@Injectable({
  providedIn: 'root'
})
export class AccessGuard implements CanActivate {

  roleId;
  userTypeId;
  isRouteUrl: boolean = false;
  constructor(private commonService: CommonService,
    private loaderService: LoaderService,
    private router: Router,
    private commonMethods: CommonMethods) {
    this.roleId = Number(CommonService.getStorage(Constants.httpAndCookies.ROLEID, true));
    this.userTypeId = Number(CommonService.getStorage(Constants.httpAndCookies.USERTYPE, true));
  }

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    const nextUrl = JSON.parse(CommonService.getStorage(Constants.httpAndCookies.ACCESS_PATH, true));
    if (nextUrl && (_.includes(nextUrl, state.url) || this.checkIsRouteUrl(nextUrl, state.url))) {
      return true;
    } else {
      this.loaderService.hide();
      this.commonService.warningSnackBar('You are not authorised person');

      // redirected to dashBoard Role Wise
      this.router.navigate([CommonService.getStorage(Constants.httpAndCookies.MAIN_DASHBOARD, true)]);
      // this.commonMethods.redirectedToDashBoard(this.roleId);
      return false;
    }
  }

  checkIsRouteUrl(pathList, path): boolean {
    for (const iterator of pathList) {
      if (_.includes(path, iterator)) {
        return true;
      }
    }
    return false;
  }
}
