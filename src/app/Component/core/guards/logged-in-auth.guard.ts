import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { CommonService } from 'src/app/CommoUtils/common-services/common.service';
import { Constants } from 'src/app/CommoUtils/constants';
import { TnService } from 'src/app/services/tn.service';

@Injectable({
  providedIn: 'root'
})
export class LoggedInAuthGuard implements CanActivate {

  constructor(
    private router: Router,
    private tnService: TnService,
  ) { }

  canActivate() {
    if (CommonService.getStorage(Constants.httpAndCookies.COOKIES_OBJ, true) && CommonService.getStorage(Constants.httpAndCookies.USERTYPE, true)) {
      this.tnService.isTokenValid().subscribe(res => {
        const userType = Number(CommonService.getStorage(Constants.httpAndCookies.USERTYPE, true));
        if(userType == Constants.UserType.OTHER_USERS) {
          const userRoleId = Number(CommonService.getStorage(Constants.httpAndCookies.ROLEID, true));
          if (userRoleId == Constants.UserRoleList.BANK_BO.id) {
            this.router.navigate([Constants.ROUTE_URL.BO_DASHBOARD]);
          } else if (userRoleId == Constants.UserRoleList.BANK_HO.id) {
            this.router.navigate([Constants.ROUTE_URL.DASHBOARD]);
          } else if (userRoleId == Constants.UserRoleList.ADMIN_CHECKER.id ||
            userRoleId == Constants.UserRoleList.ADMIN_MAKER.id ||
            userRoleId == Constants.UserRoleList.SUPER_ADMIN.id) {
            this.router.navigate([Constants.ROUTE_URL.ALL_USER_LIST]);
          } else if (userRoleId == Constants.UserRoleList.FIELD_INSPECTION_OFFICER.id
            || userRoleId == Constants.UserRoleList.BRANCH_MANAGER.id
            || userRoleId == Constants.UserRoleList.LEAD_BANK_MANAGER.id
            || userRoleId == Constants.UserRoleList.GENERAL_MANAGER.id) {
            this.router.navigate([Constants.ROUTE_URL.BANKER_DASHBOARD]);
          }
        }
        return false;
      });
      return false;
    } else {
      return true;
    }
  }

}
