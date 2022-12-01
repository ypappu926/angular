import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { HttpService } from 'src/app/CommoUtils/common-services/http.service';
import { RestUrl } from 'src/app/CommoUtils/resturl';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  campaignObserver = new Subject();
  public campaignSubscriber$ = this.campaignObserver.asObservable();

  emitData(data) {
    this.campaignObserver.next(data);
  }

  constructor(
    private http: HttpService,
    ) { }

  signUp(request: object): Observable<any> {
    return this.http.post('RestUrl.SIGNUP', request);
  }
  otpSubmitForSignup(request: object): Observable<any> {
    return this.http.post('RestUrl.VERIFY_OTP_FOR_SIGNUP', (request));
  }
  reSendOTP(request: object): Observable<any> {
    return this.http.post('RestUrl.RESEND_OTP_SIGNUP', request);
  }
  setPassword(data: any): Observable<any> {
    return this.http.post('RestUrl.SET_PASSWORD', data);
  }
  checkLinkVarification(data: any): Observable<any> {
    return this.http.post('RestUrl.LINK_VARIFICATION', data);
  }

  // saveCampaignCode(request: any): Observable<any> {
  //   return this.http.post(RestUrl.SAVE_CAMPAIGN_CODE, request);
  // }
  // setLastCampaignCode(request: any): Observable<any> {
  //   return this.http.post(RestUrl.SET_LAST_CAMPAIGN_CODE, request, false);
  // }
  getAccessToken(): Observable<any> {
    return this.http.get(RestUrl.ACCESS_TOKEN, false, false);
  }

  // For Login
  sendOTP(request: object): Observable<any> {
    return this.http.post('RestUrl.SEND_OTP', request);
  }

  login(data: any): Observable<any> {
    return this.http.post(RestUrl.LOGIN, data);
  }
  //  For Logout User
  logoutUser(): Observable<any> {
    return this.http.get(RestUrl.LOGOUT_USER, false);
  }

}