import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { CommonService } from 'src/app/CommoUtils/common-services/common.service';
import { Constants } from 'src/app/CommoUtils/constants';
import { TnService } from 'src/app/services/tn.service';

@Component({
  selector: 'app-set-password',
  templateUrl: './set-password.component.html',
  styleUrls: ['./set-password.component.scss']
})
export class SetPasswordComponent implements OnInit {
  @ViewChild('changePasswordForm') changePasswordForm: NgForm;
  hide = true;
  hide1 = true;
  hide2 = true;

  isDisabled: boolean = false;

  isMatchPswEightCharLength: any;

  isMatchPswOneNumber: RegExpMatchArray;
  isMatchPswOneSpecialChar: RegExpMatchArray;
  isMatchPswOneAlpha: RegExpMatchArray;
  isMatchPswOneCapAlpha: RegExpMatchArray;
  
  currentPassword: any;
  newPassword: any;
  reEnterPassword: any;

  firstPwdChange;
  submitted = false;
  constructor(
    
    private tnService: TnService,
    private commonService: CommonService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
  ) { }

  ngOnInit(): void {
    this.activatedRoute.queryParams.subscribe(params => {
      if (!this.commonService.isObjectNullOrEmpty(params)
        && !this.commonService.isObjectNullOrEmpty(params.firstPwdChange)) {
        this.firstPwdChange = CommonService.decryptFunction(params['firstPwdChange']);
      }
    });
    this.currentPassword="ZjJFZTl3QlZmb2dLT21UcUQ0Y1Nla0sxZ2gyc0wyUUFmUT09OjoxMi0wOS0yMDIyIDAzOjE4";
  }

  submit() {
    const data = {
      oldPassword: CommonService.decryptFunction(this.currentPassword),
      password: this.newPassword,
      confirmPassword: this.reEnterPassword,
      isPasswordSet: true,
    }

    if (!this.newPassword && !this.reEnterPassword) {
      this.commonService.warningSnackBar('Please fill all the details correctly.')
      return;
    }

    this.tnService.changePassword(data).subscribe(res => {
      if (res && res.status === 200) {
        this.commonService.successSnackBar("New password successfully updated!");
          // this.router.navigate([Constants.ROUTE_URL.DASHBOARD], { queryParams: { id: CommonService.encryptFunction(res.userId) } });
          this.router.navigate([Constants.ROUTE_URL.LOGIN]);
      } else {
        this.commonService.warningSnackBar(res.message);
      }
    }, error => {
      this.commonService.errorSnackBar(error);
    });
  }

  checkPasswordMatch(): any {
    this.submitted=false;
    setTimeout(() => {
      this.submitted = true;
    }, 0);

    // console.log(this.changePasswordForm)
    if(this.changePasswordForm.invalid){
      return;
    }
    if (this.newPassword !== this.reEnterPassword) {
      this.commonService.warningSnackBar('Password and Confirm password should be same');
      return false;
    }
    //  else if ((this.isMatchPswEightCharLength <= 8 && this.isMatchPswEightCharLength >= 20) ||
    //   (this.isMatchPswOneNumber == null) || (this.isMatchPswOneCapAlpha == null) ||
    //   (this.isMatchPswOneAlpha == null) || (this.isMatchPswOneSpecialChar == null)) {
    //   this.commonService.warningSnackBar('Please enter valid password');
    //   return;
    // }
    else {
      this.submit();
    }
  }
  chkPatternMatch(event: any) {
    this.isDisabled = true;
    let x: String;
    x = event.target.value;
    this.isMatchPswEightCharLength = x.length;
    this.isMatchPswOneNumber = x.match(".*\\d+.*");
    this.isMatchPswOneSpecialChar = x.match("(?=.*[$@!%*#?&_=`~{}:;,.'$-])");
    this.isMatchPswOneAlpha = x.match("(?=.*[a-z]){1,}");
    this.isMatchPswOneCapAlpha = x.match("(?=.*[A-Z]){1,}");
  }

  cancel() {
    if (this.firstPwdChange) {
      this.router.navigate([Constants.ROUTE_URL.LOGIN]);
    }
  }

}
