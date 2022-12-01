import { Injectable } from '@angular/core';
import { Constants } from '../constants';
import { AesGcmEncryptionService } from './encryption/aes-gcm-encryption.service';
import * as CryptoJS from 'crypto-js';
import { SnackbarService } from './SnackbarService';
import { ActivatedRoute } from '@angular/router';
import { DatePipe } from '@angular/common';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

declare var jQuery: any;
declare var $: any;

@Injectable({
  providedIn: 'root'
})
export class CommonService {

  constructor(private modalService: NgbModal, private snackbar: SnackbarService, private datePipe: DatePipe, private activatedRoute: ActivatedRoute) { }

  getURLData(key: string) {
    return CommonService.decryptFunction(this.activatedRoute.snapshot.queryParamMap.get(key));
  }

  setURLData(data: string) {
    return CommonService.encryptFunction(data);
  }

  dateFormateForExcel(date) {
    return this.datePipe.transform(date, 'yyyy-MM-dd');
  }

  /**
   * For check null,empty and undefined
   */
  static isObjectNullOrEmpty(data: any) {
    return (data == null || data === undefined || data === '' || data === 'null' || data === 'undefined' ||
      data === '' || data === [] || data === {});
  }

  isObjectNull(data: any) {
    return (data == null || data === undefined || data === '' || data === [] || data === {});
  }

  static isObjectIsEmpty(data: any) {
    return data && Object.keys(data).length <= 0;
  }
  getConstant() {
    return Constants;
  }

  /**
   * for convert value(encrypt)
   */
  static toBTOA(value: string) {
    try {
      return btoa(value);
    } catch (err) {
      console.log('error while btoa convert');
      return null;
    }
  }

  /**
   * Decrypt value
   */
  static toATOB(value: any) {
    try {
      return atob(value);
    } catch (err) {
      console.log('error while atob convert');
      return null;
    }
  }

  static redirectToBankerFromFacilitator(tokenData) {
    // let cookiesObje: any = CommonService.getStorage(Constants.httpAndCookies.COOKIES_OBJ, true);
    // cookiesObje = this.parseData(cookiesObje);
    const cookiesObje: any = {};
    cookiesObje.ur_cu = btoa(tokenData.userName);
    cookiesObje.tk_ac = tokenData.access_token;
    cookiesObje.tk_rc = tokenData.refresh_token;
    cookiesObje.tk_lg = tokenData.loginToken;
    cookiesObje.token = tokenData.loginToken;

    cookiesObje.token = tokenData.loginToken;
    cookiesObje.userType = tokenData.userType;
    // cookiesObje.campaignCode = CommonService.getStorage(Constants.httpAndCookies.CAMPIGN_CODE, true);
    // cookiesObje.type = CommonService.getStorage(Constants.httpAndCookies.CAMPIGN_TYPE, true);
    cookiesObje.roleId = tokenData.userRoleId;
    cookiesObje.orgId = tokenData.userOrgId;
    cookiesObje.userId = tokenData.userId;

    const encObj = CommonService.encryptFunction(JSON.stringify(cookiesObje));
    let redirectModule;
    redirectModule = '/banker/redirect/';
    window.location.href = Constants.LOCATION_URL + redirectModule + encObj;
    // window.location.href = 'http://localhost:4100/redirect/' + encObj;
  }

  static encryptFunction(request) {
    if (Constants.IS_ENCRYPTION) {
      /** old code */
      // return CommonService.toBTOA(CommonService.encryptText(request));
      // return request;
      if (request != null && request != undefined) {
        return AesGcmEncryptionService.getEncPayload(request.toString());
      } else {
        return request;
      }
    } else {
      return request;
    }
  }

  static decryptFunction(request) {

    if (request) {
      if (Constants.IS_ENCRYPTION) {
        /** old code */
        // return CommonService.decryptText(CommonService.toATOB(request));

        return AesGcmEncryptionService.getDecPayload(request);
      } else {
        return request;
      }
    }
    return null;
  }

  getRoutUrl() {
    return Constants.ROUTE_URL;
  }

  /**
   * Get value from storage
   */
  static getStorage(key: string, decrypt: boolean) {
    const data: any = localStorage.getItem(key);
    if (CommonService.isObjectNullOrEmpty(data)) {
      return data;
    }
    // console.log('Get Storege-------Key-------->' + key + '-----------Value-----> ' + data);
    if (decrypt) {
      const decryptdata = this.decryptText(data);
      // console.log('Get Storege-------Key-------->' + key + '-----------Descrypt Value-----> ' + decryptdata);
      return CommonService.isObjectIsEmpty(decryptdata) ? null : decryptdata;
    }
    return data;
  }

  /**
   * set value in storage
   */
  static setStorage(key: any, value: any) {
    if (value != null) {
      value = value.toString();
    }
    const newLocal: any = this.encryptText(value);
    localStorage.setItem(key, newLocal);
  }

  /**
   * Remove value from storage
   */
  static removeStorage(key: any) {
    localStorage.removeItem(key);
  }

  static clearStorage(): void {
    localStorage.clear();
  }

  /**
   * for set Header for cookies
   */
  static setSessionAndHttpAttr(email: any, response: { access_token: any; refresh_token: any; }, loginToken: any): boolean {
    CommonService.removeStorage(Constants.httpAndCookies.COOKIES_OBJ);
    // set cookies object
    const cookies: any = {};
    const config = { secure: true };
    cookies[Constants.httpAndCookies.USNM] = email;
    cookies[Constants.httpAndCookies.ACTK] = response.access_token;
    cookies[Constants.httpAndCookies.RFTK] = response.refresh_token;
    cookies[Constants.httpAndCookies.LGTK] = loginToken;
    CommonService.setStorage(Constants.httpAndCookies.COOKIES_OBJ, JSON.stringify(cookies));
    return true;
  }




  static loadScript(url: string) {
    const body = document.body as HTMLDivElement;
    const script = document.createElement('script');
    script.innerHTML = '';
    script.src = url;
    script.async = false;
    script.defer = true;
    body.appendChild(script);
  }

  static downloadFile(bytes: BlobPart, fileName: any) {
    const blob = new Blob([bytes], {
      type: 'application/octet-stream'
    });
    const a: any = document.createElement('a');
    document.body.appendChild(a);
    a.style = 'display:none';
    const url = window.URL.createObjectURL(blob);
    a.href = url;
    a.download = fileName;
    a.click();
    window.URL.revokeObjectURL(url);
    a.remove();
  }

  static encryptText(request: object): string {
    if(!CommonService.isObjectNullOrEmpty(request)){
      return AesGcmEncryptionService.getEncPayload(request.toString());
    }
    return null;
    // const data = CryptoJS.AES.encrypt(JSON.stringify(request), Constants.cwjs);
    // return data.toString();
  }

  static decryptText(request: string): string {
    try{
      if(!CommonService.isObjectNullOrEmpty(request)){
        return AesGcmEncryptionService.getDecPayload(request);
      }
      return request;
    } catch(ex){
      console.log("Error on parse data", ex);
      return null;
    } 
    // const data = CryptoJS.AES.decrypt(request, Constants.cwjs);
    // if (!this.isObjectNullOrEmpty(data.toString())) {
    //   const data1 = data.toString(CryptoJS.enc.Utf8)
    //   return CommonService.parseData(data1);
    // }
    // return data.toString(CryptoJS.enc.Utf8);
  }

  static getCampaignCode() {
    return CommonService.getStorage('campaignCode', true);
  }

  static setAppCount(countTOUpdate: number) {
    this.setStorage(Constants.httpAndCookies.App_Count, countTOUpdate + ""); // to preventing multiple tab issue
  }

  static getConstants() {
    return Constants;
  }

  static parseData(data) {
    try {
      return JSON.parse(data);
    } catch (ex) {
      console.log("Error on parse data", ex);
      return JSON.parse(JSON.stringify(data));
    }
  }

  /**
   * For check null,empty and undefined
   */
  isObjectNullOrEmpty(data: any) {
    return (data == null || data === undefined || data === '' || data === 'null' || data === 'undefined' ||
      data === '' || data === [] || data === {});
  }

  isObjectIsEmpty(data: any) {
    return data && Object.keys(data).length <= 0;
  }

  /**
   * For display Toaster msg in right side
   */
  successSnackBar(message: any, action?: any) {
    this.snackbar.openSnackBar(message, action, 'success');
  }
  errorSnackBar(message: string, action?: any) {
    this.snackbar.openSnackBar(message, action, 'error');
  }
  warningSnackBar(message: any, action?: any) {
    this.snackbar.openSnackBar(message, action, 'warning');
  }
  infoSnackBar(message: any, action?: any) {
    this.snackbar.openSnackBar(message, action, 'info');
  }
  defaultSnackBar(message: any, action?: any) {
    this.snackbar.openSnackBar(message, action, '');
  }


  static redirectToBanker() {
    let cookiesObje: any = CommonService.getStorage(Constants.httpAndCookies.COOKIES_OBJ, true);
    cookiesObje = this.parseData(cookiesObje);
    cookiesObje.token = cookiesObje.tk_lg;
    cookiesObje.userType = CommonService.getStorage(Constants.httpAndCookies.USERTYPE, true);
    cookiesObje.campaignCode = CommonService.getStorage(Constants.httpAndCookies.CAMPIGN_CODE, true);
    cookiesObje.type = CommonService.getStorage(Constants.httpAndCookies.CAMPIGN_TYPE, true);
    cookiesObje.roleId = CommonService.getStorage(Constants.httpAndCookies.ROLEID, true);
    cookiesObje.orgId = CommonService.getStorage(Constants.httpAndCookies.ORGID, true);
    cookiesObje.orgName = CommonService.getStorage(Constants.httpAndCookies.ORG_NAME, true);
    cookiesObje.userId = CommonService.getStorage(Constants.httpAndCookies.USER_ID, true);


    const encObj = CommonService.encryptFunction(JSON.stringify(cookiesObje));
    let redirectModule;
    redirectModule = '/banker/redirect/';
    window.location.href = Constants.LOCATION_URL + redirectModule + encObj;
    //  window.location.href = 'http://localhost:4200/redirect/'+ encObj;
  }





  /* Don't remove this javascript @nikul 22_04_2022 Start */
  DropDownjquery() {
    // this java script Add Nikul Do not-Remove 1-1-2020 Start point
    (function ($) {
      $(document).ready(function ($) {
        ResizeView();

      })

      $(window).resize(function () {
        ResizeView();
      });
    })(jQuery);
    function ResizeView(): any {
      const width = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
      if (width < 1024) {
        //customdropdown_mobile
        $("ul.customdropdown_mobile").on("click", ".init", function () {
          $(this).closest(".customdropdown_mobile").children('li:not(.init)').toggle();
          // console.log('======================> Working Drop Jquery 001')
        });
        var allOptions = $("ul.customdropdown_mobile").children('li:not(.init)');
        $("ul.customdropdown_mobile").on("click", "li:not(.init)", function () {
          allOptions.removeClass('selected');
          $(this).addClass('selected');
          $("ul.customdropdown_mobile").children('.init').html($(this).html());
          allOptions.toggle();
          // console.log('======================> Working Drop Jquery 002')
        });
        return true;
      } else {
        return false;
      }
    }
  }
  DropDownNOTwojquery() {
    (function ($) {
      $(document).ready(function ($) {
        TwoDropDown();
      })
      $(window).resize(function () {
        TwoDropDown();
      });
    })(jQuery);
    function TwoDropDown(): any {
      const width = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
      if (width < 1024) {
        // Two Tab Drop
        $("ul.SubCustomMobileTwo").on("click", ".initTwo.TwoDrop", function () {
          $(this).closest(".SubCustomMobileTwo").children('li:not(.initTwo.TwoDrop)').toggle();
          // console.log('======================> Working Drop Jquery 003')
        });
        var allOptionsTow = $("ul.SubCustomMobileTwo").children('li:not(.initTwo.TwoDrop)');
        $("ul.SubCustomMobileTwo").on("click", "li:not(.initTwo.TwoDrop)", function () {
          allOptionsTow.removeClass('selected');
          $(this).addClass('selected');
          $("ul.SubCustomMobileTwo").children('.initTwo.TwoDrop').html($(this).html());
          allOptionsTow.toggle();
          // console.log('======================> Working Drop Jquery 004')
        });
        return true;
      } else {
        return false;
      }
    }
  }

  DropDownNOThreejquery() {
    (function ($) {
      $(document).ready(function ($) {
        ThreeDropDown();
      })

      $(window).resize(function () {
        ThreeDropDown();
      });
    })(jQuery);
    function ThreeDropDown(): any {
      const width = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
      if (width < 1024) {
        // three Tab Drop
        $("ul.SubCustomMobileThree").on("click", ".initThree.ThreeDrop", function () {
          $(this).closest(".SubCustomMobileThree").children('li:not(.initThree.ThreeDrop)').toggle();
          // console.log('======================> Working Drop Jquery 005')
        });
        var allOptionsThree = $("ul.SubCustomMobileThree").children('li:not(.initThree.ThreeDrop)');
        $("ul.SubCustomMobileThree").on("click", "li:not(.initThree.ThreeDrop)", function () {
          allOptionsThree.removeClass('selected');
          $(this).addClass('selected');
          $("ul.SubCustomMobileThree").children('.initThree.ThreeDrop').html($(this).html());
          allOptionsThree.toggle();
          //  console.log('======================> Working Drop Jquery 006')
        });
        return true;
      } else {
        return false;
      }
    }
  }
  /* Don't remove this javascript @nikul 22_04_2022 End */

  /**
  * Open PopUp
  */
  openPopUp(obj: any, popUpName: any, isYesNo: any, objClass?: any) {
    // and use the reference from the component itself

    const modalRef = this.modalService.open(popUpName, objClass);
    modalRef.componentInstance.popUpObj = obj;
    modalRef.componentInstance.isYesNo = isYesNo; // if isYesNo true than display both buttons
    return modalRef;
  }

  static getCurrentPath() {
    // const businessTypeId = Number(getStorage(Constants.httpAndCookies.BUSINESS_TYPE_ID, true));
    // if (businessTypeId != undefined && businessTypeId != null && businessTypeId != 0) {
    //   return Constants.productCategory.filter(ele => ele.id === businessTypeId)[0].path;
    // }
    return 'TIIC';
  }
}
