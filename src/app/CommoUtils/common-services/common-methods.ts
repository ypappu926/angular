import { Injectable } from '@angular/core';
import { Meta } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { throwError } from 'rxjs';
import { Constants } from '../constants';
import { ObjectModel } from '../model/object-model';
import { CanonicalService } from './canonical.service';
import { CommonService } from './common.service';
import { DeviceDetectorService } from 'ngx-device-detector';
import { Location } from '@angular/common';
import { SnackbarService } from './SnackbarService';

@Injectable({
    providedIn: 'root'
})
export class CommonMethods {
    validations: any;
    validationsobj: any;
    constructor(private router: Router, private meta: Meta,
        private canonicalService: CanonicalService,
        private deviceService: DeviceDetectorService,
        private location: Location,
        private snackbar: SnackbarService) { }

    goBack() {
        this.location.back();
    }

    detectIEEdge(): any {
        const ua = window.navigator.userAgent;

        const msie = ua.indexOf('MSIE ');
        if (msie > 0) {
            // IE 10 or older => return version number
            return parseInt(ua.substring(msie + 5, ua.indexOf('.', msie)), 10);
        }

        const trident = ua.indexOf('Trident/');
        if (trident > 0) {
            // IE 11 => return version number
            const rv = ua.indexOf('rv:');
            return parseInt(ua.substring(rv + 3, ua.indexOf('.', rv)), 10);
        }

        const edge = ua.indexOf('Edge/');
        if (edge > 0) {
            // Edge => return version number
            return parseInt(ua.substring(edge + 5, ua.indexOf('.', edge)), 10);
        }

        // other browser
        return false;
    }

    // openDialogue(popUpName: any, obj: any): any {
    //     // and use the reference from the component itself
    //     console.log('popup name :: ', popUpName);
    //     console.log('popup obj :: ', obj);
    //     const modalRef = this.dialog.open(popUpName, obj).afterClosed();
    //     return modalRef;
    // }

    // For handle error and display error msg
    errorHandle(error: any): any {
        if (error != null && error.encData != undefined && error.encData != null) {
            error = CommonService.decryptText(error.encData);
        }
        let errMsg = '';
        // console.error('errMsg ->' , errMsg);
        if (errMsg == null) {
            console.error('Error Logs Not Found ', errMsg);
            return;
        }
        if (error?.status === 401) {
            this.router.navigate([Constants.ROUTE_URL.LOGIN]);
            localStorage.clear();
            errMsg = 'You are not authorised';
        } else if (error?.status === 404) {
            if (error.message !== undefined && error.message != null) {
                errMsg = error.message;
            } else {
                errMsg = 'Method Not found';
            }
        } else if (error?.status === 400) {
            if (error.message !== undefined && error.message != null) {
                errMsg = error.message;
            } else {
                errMsg = 'Bad Request';
            }
        } else if (error?.status === 0) {
            errMsg = 'Internal Server error';
        } else if (error?.status === 500) {
            if (error.message !== undefined && error.message != null) {
                errMsg = error.message;
            } else {
                errMsg = 'Internal Server error';
            }
        } else if (error?.status === 502) {
            errMsg = 'Server is not responding';
        } else {
            if (error?.error !== undefined && error?.error != null) {
                errMsg = error.error.message;
            } else {
                errMsg = 'Something went wrong';
            }
            if (errMsg === '') {
                errMsg = 'Something went wrong';
            }
        }
        // if (error.includes('html')) {

        // }
        this.errorSnackBar(errMsg);
        return throwError(errMsg);
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

    generateMetaTag(description: any, keyword?: any): any {
        this.canonicalService.setCanonicalURL();
        this.canonicalService.setCanonicalURLalternet();
        this.meta.updateTag({ name: 'description', content: description });
        this.meta.updateTag({ name: 'keywords', content: keyword });
    }

    senitizeURL(urlpath: string, title: string): any {
        // this.iconRegistry.addSvgIcon(title, this.sanitizer.bypassSecurityTrustResourceUrl(urlpath));
    }



    // Get Validations By Module name
    getValidationByModule(moduleName): any {
        const listdata = CommonService.parseData(CommonService.getStorage('validations', true)) as any;
        CommonService.setStorage('module_val', null);
        if (!CommonService.isObjectNullOrEmpty(listdata)) {
            this.validations = listdata.filter(option => option.module.startsWith(moduleName));
            if (this.validations[0].fieldList != null) {
                CommonService.setStorage('module_val', JSON.stringify(this.validations[0].fieldList));
            }
        }
    }


    // Dynamic Validations
    getValidations(labelOrKeyName: string): Array<ObjectModel> {
        const listdata = CommonService.parseData(CommonService.getStorage('module_val', true)) as any;
        if (!CommonService.isObjectNullOrEmpty(listdata)) {
            const fieldValidations = listdata.filter(option => option.label.startsWith(labelOrKeyName));
            if (fieldValidations != null || fieldValidations !== undefined) {
                if (fieldValidations[0] != null || fieldValidations[0] !== undefined) {
                    return fieldValidations[0].validations;
                }
            }
        }
        return [];
    }

    // Given Error Msg customised
    getErrorMessage(labelOrKeyName: string, propertyName): string {
        const listdata = JSON.parse(CommonService.getStorage('module_val', true)) as any;
        if (!CommonService.isObjectNullOrEmpty(listdata)) {
            const fieldValidations = listdata.filter(option => option.label.startsWith(labelOrKeyName));
            if (fieldValidations != null || fieldValidations !== undefined) {
                if (fieldValidations[0] != null || fieldValidations[0] !== undefined) {
                    const errormsgObj = fieldValidations[0].validations.filter(msg => msg.key === propertyName)[0];
                    return errormsgObj !== undefined ? errormsgObj.errorMassage : null;
                }
            }
        }
        return null;
    }

    getClientLoginDetails(): any {
        return this.deviceService.getDeviceInfo();
        // this.deviceInfo = this.deviceService.getDeviceInfo();
        // var clientData :any={};
        // clientData.browser=this.deviceInfo.browser;
        // clientData.browserVersion=this.deviceInfo.browser_version;
        // clientData.device=this.deviceInfo.device;
        // clientData.deviceType=this.deviceInfo.deviceType;
        // clientData.deviceOs=this.deviceInfo.os;
        // clientData.deviceOsVersion=this.deviceInfo.​os_version;
        // clientData.userAgent=this.deviceInfo.​userAgent;
        // return clientData;
    }

    clearStorageAndMoveToLogin(isMsgShow: boolean, isRedirectToLoginPage?) {
        if (isMsgShow) {
            this.warningSnackBar('Its seems your authorized token is expired, please login again !!');
        }
        const validation = CommonService.getStorage('validations', true);
        //const campaignDetails = CommonService.getStorage(Constants.httpAndCookies.CAMPAIGN_DETAILS, true);
        CommonService.clearStorage();
        CommonService.setStorage(Constants.httpAndCookies.VALIDATIONS, validation);
        if (isRedirectToLoginPage != 'NO') {
            this.router.navigate([Constants.ROUTE_URL.LOGIN]);
        }
    }

    public copyToClipBoard(data, isJson?) {
        // if (data) {
        //     const adminPermissionList = _.split(CommonService.getStorage(Constants.httpAndCookies.ADMIN_BASIC_PERMISSION, true), ',');
        //     const index: number = adminPermissionList.indexOf('IS_COPY');
        //     document.addEventListener('copy', (e: ClipboardEvent) => {
        //         e.clipboardData.setData('text/plain', isJson ? JSON.stringify(data) : (index != -1) ? data : '');
        //         e.preventDefault();
        //         document.removeEventListener('copy', null);
        //     });
        //     document.execCommand('copy');
        //     isJson ? this.successSnackBar("String Copied") : (index != -1) ? this.successSnackBar("Copied") : undefined;
        // }
        // else {
        //     this.warningSnackBar("data not Found")
        // }

        document.addEventListener('copy', (e: ClipboardEvent) => {
            e.clipboardData.setData('text/plain', data);
            e.preventDefault();
            document.removeEventListener('copy', null);
        });
        document.execCommand('copy');
        this.successSnackBar("Copied")
    }

    keyPressEvent(event, type): boolean {
        const charCode = (event.which) ? event.which : event.keyCode;
        if (type == 1 && charCode > 31 && (charCode >= 48 && charCode <= 57)) {
            //numeric allow
            return true;
        } else if (type == 2 && charCode > 31 && ((charCode >= 97 && charCode <= 122) || (charCode >= 65 && charCode <= 90))) {
            //alphabetic allow
            return true;
        } else if (type == 3 && charCode > 31 && ((charCode >= 97 && charCode <= 122) || (charCode >= 65 && charCode <= 90) || (charCode >= 48 && charCode <= 57))) {
            //alpha-numeric allow
            return true;
        } else if (type == 4 && charCode > 31 && ((charCode >= 97 && charCode <= 122) || (charCode >= 65 && charCode <= 90) || (charCode >= 48 && charCode <= 57) || charCode == 32)) {
            //alpha-numeric with space allow
            return true;
        } else if (type == 5 && charCode > 31 && ((charCode >= 97 && charCode <= 122) || (charCode >= 65 && charCode <= 90) || charCode == 32)) {
            //alphabetic with space allow
            return true;
        } else if (type == 6 && charCode != 32) {
            //no space allow
            return true;
        } else if (type == 7 && charCode > 31 && charCode != 32 && (!(charCode >= 48 && charCode <= 57))) {
            //no numeric value
            return true;
        }
        return false;
    }

    // redirectedToDashBoard(roleId) {
    //     if (Constants.UserRoleList.SUPER_ADMIN.id == roleId || Constants.UserRoleList.ADMIN_CHECKER.id == roleId || Constants.UserRoleList.ADMIN_MAKER.id == roleId) {
    //         this.router.navigate([Constants.ROUTE_URL.ALL_USER_LIST]);
    //     } else if (Constants.UserRoleList.BANK_BO.id == roleId) {
    //         this.router.navigate([Constants.ROUTE_URL.BO_DASHBOARD]);
    //     } else if (Constants.UserRoleList.BANK_HO.id == roleId) {
    //         this.router.navigate([Constants.ROUTE_URL.DASHBOARD]);
    //     } else if (Constants.UserRoleList.FIELD_INSPECTION_OFFICER.id == roleId || Constants.UserRoleList.BRANCH_MANAGER.id == roleId || Constants.UserRoleList.LEAD_BANK_MANAGER.id == roleId || Constants.UserRoleList.GENERAL_MANAGER.id == roleId) {
    //         this.router.navigate([Constants.ROUTE_URL.BANKER_DASHBOARD]);
    //     } else if (Constants.UserRoleList.SUPPORT.id == roleId) {
    //         this.router.navigate([Constants.ROUTE_URL.SUPPORT_DASHBOARD]);
    //     }
    // }
}
