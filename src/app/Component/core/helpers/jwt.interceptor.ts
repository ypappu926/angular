import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor, HttpResponse } from '@angular/common/http';
import { catchError, finalize, map, Observable, throwError } from 'rxjs';

import { AuthenticationService } from '../services/auth.service';
import { LoaderService } from 'src/app/CommoUtils/common-services/LoaderService';
import { CommonService } from 'src/app/CommoUtils/common-services/common.service';
import { Constants } from 'src/app/CommoUtils/constants';
import { AesGcmEncryptionService } from 'src/app/CommoUtils/common-services/encryption/aes-gcm-encryption.service';

@Injectable()
export class JwtInterceptor implements HttpInterceptor {
    private requests: HttpRequest<any>[] = [];
  constructor(private loaderService: LoaderService) { }

   // Handle request for loader spin
   removeRequest(req: HttpRequest<any>) {
    const i = this.requests.indexOf(req);
    if (i >= 0) {
      this.requests.splice(i, 1);
    }
    this.loaderService.isLoading.next(this.requests.length > 0);
  }

  // For Skip URLS
  isHeaderSkipUrls(url: string): boolean {
    if (url.endsWith('/login')
      || url.endsWith('/forgotpassword')
      || url.includes('/forgotpasswordEncrypt')
      || url.endsWith('.json')
      || url.endsWith('/otp')
      || url.endsWith('/resend')
      || url.endsWith('/checkOtpVarification')
      || url.endsWith('/linkVerification')
      || url.endsWith('/password')
      || url.endsWith('/register')
      || url.endsWith('/getLoanMasters')
      || url.endsWith('/saveCustomForm')
      || url.includes('/scheme/application/getLoan')
      || url.includes('/getBorrowerQuestions')
      || url.includes('/getAllValidations/')
      || url.endsWith('/getLoanFilledData')
      || url.endsWith('/saveEligibility')
      || url.endsWith('/maintenance')
      || url.includes('/getStateList/satateByCountry')
      || url.includes('/getCityList/cityByState')
      || url.includes('/updateEligibilityUser')
      || url.includes('/captcha/gen')
      || url.includes('/new')
      || url.includes('/setPass')
      || url.includes('/verifyOTP')
      || url.includes('/sendEmailOTP')
      || url.includes('/resendMobileOTP')
      || url.includes('/get_by_key')
      || url.includes('/skipEmailVerification')
      || url.includes('/getConsentByConsentTypeId')
      || url.includes('/saveAllConsentBySchemeId')
      || url.includes('/grievances/save')
      || url.endsWith('/getByCampaignUrl')
    ) {
      return true;
    } else {
      return false;
    }
  }

  // For Skip Encryption URLS
  isSkipEncryption(url: string): boolean {
    if (url.endsWith('/admin/spGetAgGridData'))
      return true;
    else
      return false;
  }

  handleError(error: any) {
    let errorMessage = '';
    if (error.error instanceof ErrorEvent) {
      // client-side error
      errorMessage = `Error: ${error.error.message}`;
    } else {
      // server-side error
      console.log(error.status);
      errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
    }
    // window.alert(errorMessage);
    console.log(errorMessage);
    return throwError(errorMessage);
  }

  private logDetails(msg: string) {
    //console.log(msg);
  }

  private showLoader(): void {
    this.loaderService.show();
  }
  private hideLoader(): void {
    this.loaderService.hide();
  }

    // call interceptor and add token parameter into request
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any> | any> {
    const headers = req.headers;
    //console.log('url=====>',req.url);
    if (!this.isHeaderSkipUrls(req.url)) {// for skip URL
      const cookiesObj = CommonService.parseData(CommonService.getStorage(Constants.httpAndCookies.COOKIES_OBJ, true));
      if (cookiesObj != null || cookiesObj !== undefined) {
        req = req.clone({ headers: req.headers.set(Constants.httpAndCookies.USNM, cookiesObj[Constants.httpAndCookies.USNM]) });
        req = req.clone({ headers: req.headers.set(Constants.httpAndCookies.ACTK, cookiesObj[Constants.httpAndCookies.ACTK]) });
        req = req.clone({ headers: req.headers.set(Constants.httpAndCookies.LGTK, cookiesObj[Constants.httpAndCookies.LGTK].toString()) });
        req = req.clone({ headers: req.headers.set(Constants.httpAndCookies.RFTK, cookiesObj[Constants.httpAndCookies.RFTK]) });
        if(this.isSkipEncryption(req.url)){
          req = req.clone({ headers: req.headers.set('is_decrypt', 'true') });
        }
        // req = req.clone({ headers: req.headers.set('req_auth', 'true') });
      } else {
        this.hideLoader();
        console.log('You are not authorised person');
      }
    }
    const startTime = Date.now();
    let status: string;
    if (Constants.IS_ENCRYPTION && !this.isSkipEncryption(req.url)) {
      if (req.body != null && !(req.body instanceof FormData) && !(req.body instanceof Array) && !req.url.includes("/consent")) {
        // req = req.clone({ body: { data: CommonService.encryptText(req.body) } })
        req = req.clone({ body: { data: AesGcmEncryptionService.getEncPayload(JSON.stringify(req.body)) } })
      }
    }

    // Hide loader
    if (headers.has('ignoreLoader') && (headers.get('ignoreLoader') === 'false')) {
      req = req.clone({ headers: req.headers.delete('ignoreLoader', 'false') });
      this.hideLoader();
    } else {
      this.requests.push(req);
    }
    return next.handle(req).pipe(
      map((event: HttpEvent<any>) => {
        if (event instanceof HttpResponse) {
          status = 'succeeded';
          this.removeRequest(req);
          // console.log('event--->>>', event);
          if (Constants.IS_ENCRYPTION && !this.isSkipEncryption(req.url)) {
            if (event.body != null && event.body.encData != undefined && event.body.encData != null) {
              // let data = CommonService.decryptText(event.body.encData);
              let data = AesGcmEncryptionService.getDecPayload(event.body.encData);
              event = event.clone({ body: JSON.parse(data) })
              // event = event.clone({ body: data })
            }
          }
          return event;
        } else {
          const elapsedTime = Date.now() - startTime;
          const message = req.method + ' ' + req.urlWithParams + ' ' + status + ' in ' + elapsedTime + 'ms';
          this.logDetails(message);
          // this.removeRequest(req);
          return null;
        }
      }, catchError(error => {
        status = 'Error';
        this.removeRequest(req);
        return this.handleError(error);
      })), finalize(() => {
        const elapsedTime = Date.now() - startTime;
        const message = req.method + ' ' + req.urlWithParams + ' ' + status + ' in ' + elapsedTime + 'ms';
        this.logDetails(message);
        this.removeRequest(req);
        // this.hideLoader();
      }));
  }
}
