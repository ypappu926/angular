import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { interval } from 'rxjs';
import { CommonMethods } from 'src/app/CommoUtils/common-services/common-methods';
import { CommonService } from 'src/app/CommoUtils/common-services/common.service';
import { LoaderService } from 'src/app/CommoUtils/common-services/LoaderService';
import { Constants } from 'src/app/CommoUtils/constants';
import { ApiService } from '../../../services/api.service';

import { AuthenticationService } from '../services/auth.service';

@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate {
    constructor(private router: Router, private commonMethods: CommonMethods, private loaderService: LoaderService, private apiService: ApiService,private authenticationService:AuthenticationService) { }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {

      if (CommonService.getStorage(Constants.httpAndCookies.COOKIES_OBJ, true) != null) {
        // logged in so return true
        this.startIntervalForGetNewAccessKey(1800000);
        return true;
      } else {
        // not logged in so redirect to login page with the return url
        this.loaderService.hide();
        this.commonMethods.warningSnackBar('You are not Authorized');
        this.logoutUser();
        // this.router.navigate(['/login'], { queryParams: { returnUrl: state.url } });
        this.router.navigate(['/login']);
        return false;
      }

    }



    logoutUser(isRedirectToLoginPage?): void {
        if (CommonService.getStorage(Constants.httpAndCookies.COOKIES_OBJ, true) != null) {
          this.apiService.logoutUser().subscribe(res => {
            if (res.status === 200) {
              this.commonMethods.successSnackBar(res.message);
            } else {
              this.commonMethods.errorSnackBar(res.message);
            }
          }, error => {
            this.commonMethods.errorSnackBar(error);
          });
        }
        this.commonMethods.clearStorageAndMoveToLogin(false, isRedirectToLoginPage);
      }


    startIntervalForGetNewAccessKey(seconds: any) {
        // this is for get access token every 28 min
        interval(seconds).subscribe(x => {
          if (CommonService.getStorage(Constants.httpAndCookies.COOKIES_OBJ, true) !== undefined
            && CommonService.getStorage(Constants.httpAndCookies.COOKIES_OBJ, true) != null) {
            this.apiService.getAccessToken().subscribe((res: any) => {
              if (res.status === 200) {
                let cookiesObje = CommonService.getStorage(Constants.httpAndCookies.COOKIES_OBJ, true);
                cookiesObje = CommonService.parseData(cookiesObje);
                const email = cookiesObje[Constants.httpAndCookies.USNM];
                const lgTk = cookiesObje[Constants.httpAndCookies.LGTK];
                CommonService.setSessionAndHttpAttr(email, res, lgTk);
                clearInterval();
              }
            }, (error: any) => {
              // this.commonMethods.errorSnackBar({ message: error });
              CommonService.removeStorage(Constants.httpAndCookies.COOKIES_OBJ);
              this.router.navigate([Constants.ROUTE_URL.LOGIN]);
            });
          }
        });
      }
}
