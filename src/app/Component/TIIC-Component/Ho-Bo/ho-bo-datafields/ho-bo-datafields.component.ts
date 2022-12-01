import { DatePipe } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, NgForm } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbDate, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CommonMethods } from 'src/app/CommoUtils/common-services/common-methods';
import { CommonService } from 'src/app/CommoUtils/common-services/common.service';
import { Constants } from 'src/app/CommoUtils/constants';
import { BOApplicationSubmitPopupComponent } from 'src/app/Popup/HO-BO/bo-application-submit-popup/bo-application-submit-popup.component';
import { TnService } from 'src/app/services/tn.service';
import { AddressMasterModel, ApplicantDetailsModel, BoDetailsModel, CreditDetailsModel, PromoterDetailsModel } from './ho-bo-datafields-model';
import * as _ from 'lodash';
import { toInteger } from 'lodash';
import { TranslateService } from '@ngx-translate/core';

declare var jQuery: any;
@Component({
  selector: 'app-ho-bo-datafields',
  templateUrl: './ho-bo-datafields.component.html',
  styleUrls: ['./ho-bo-datafields.component.scss'],
  providers: [DatePipe, TranslateService]
})
export class HOBODatafieldsComponent implements OnInit {
  // bread crumb items
  tab: number;
  breadCrumbItems: Array<{}>;
  selectValue: string[];
  consentId: any;
  jobId: any;
  fileToUpload: File = null;
  bsFileToUpload: File = null;
  roleId: any;
  workflowData: any = {};
  boDetailsList = [];
  branchDetails: FormGroup;
  applicantDetails = new ApplicantDetailsModel();
  applicantDetailsHo = new ApplicantDetailsModel();
  userOrgId: any;
  boDetails = new BoDetailsModel();
  fieldDetails = [];
  @ViewChild('applicantDetailForm') applicantDetailForm: NgForm;
  @ViewChild('boDetailsForm') boDetailsForm: NgForm;
  constitutionList: any = [];
  natureOfBusiness: any = [];
  sizeOfBusiness: any = [];
  smaList = [];
  sectorList = [];
  disableFlag: boolean = false;
  industryList = [];
  industryProductList = [];
  typeOfCollateral: any = [];
  isAlreadyEncumberedOp: any = [];
  maxDate;
  title: any;
  validationObjects = Object.create({});
  hoBoFieldsValidations = [];
  submitted = false;
  submittedHo = false;
  boUser: boolean = false;
  hoUser: boolean = false;
  endDate: any;
  minValDate: any;
  minDisbursementDate: any;
  isViewMode = false;
  factoryAddressLst: any[];
  factoryRegisterAddressLst: any[];
  startDate: any;
  enableIsSameAsFacAddOp=false;
  enableIsSameAsRegFacAddressOp=false;
  addressFieldList = ['block','nameOfBuilding','streetName','pincode','districtId','blockId','stateId','cityId','email','phone'];

  // ITR fields
  updateDate: any;
  itrDisplayYearList: any;
  profileId: any;
  totalSize = 10 * 1000000;
  formData = new FormData();
  allFiles = [];
  bsAllFiles = [];
  name = { itr1: '', itr2: '', itr3: '' };
  isRemoveBtn = false;
  isUploadITR = true;
  uploadITR1 = true;
  uploadITR2 = true;
  uploadITR3 = true;

  isDeleteButtion = false;
  isBankPartnerInterface = false;
  currentDate: Date = new Date(); // current
  lastDate: Date = new Date(); // previous
  beforeLastDate = new Date(); // previous last
  beforeLastToLastDate = new Date(); // previous last to previous
  objectData: any;
  count = 0;
  mandatoryYearDisp: any;
  latestYearItrAvail = new FormControl();
  flag = false;
  // ITR fields

  //BANK STATEMENT
  opationsForSlider = [Object.create({})];
  states = [];
  bsMasterId: any;
  commonservice: any;
  years = [];
  months = [
    { "key": 1, "value": "January" },
    { "key": 2, "value": "February" },
    { "key": 3, "value": "March" },
    { "key": 4, "value": "April" },
    { "key": 5, "value": "May" },
    { "key": 6, "value": "June" },
    { "key": 7, "value": "July" },
    { "key": 8, "value": "August" },
    { "key": 9, "value": "September" },
    { "key": 10, "value": "October" },
    { "key": 11, "value": "November" },
    { "key": 12, "value": "December" }
  ];
  currentYear = new Date().getFullYear();
  userId:any;
  borroweUserId:any;
  opationsfrom = [];
  isInvalidData=false;
  accountType:any
  disabledAddNew=false;
  isNewAdded=false;
  selectedBank:any={};
  selectedBSDetails:any = {};
  stateCtrl = new FormControl();
  bsFiles:any =[];
  pincodeList: any = [];

  activateBS:any;
  //BANK STATEMENT
  saveButton: boolean = false;
  sendToBo: boolean = false;
  campOrgList = [
    { id: 301, name: 'TIIC' },
    { id: 302, name: 'TAICO' }
  ]
  displayContacts = false;
  selectedOrgId;

  constructor(private router: Router, private route: ActivatedRoute, private tnServices: TnService,
    public commonServices: CommonService,
    private commonMethods: CommonMethods,
    private modalService: NgbModal) {
    commonMethods.getValidationByModule(Constants.validationModule.HOBO_DATA_FIELDS);
    const currentDate = new Date();
    this.endDate = new NgbDate(currentDate.getFullYear(), currentDate.getMonth() + 1, currentDate.getDate());
    this.startDate = new NgbDate(1910, 1, 1);
  }

  ngOnInit(): void {
    this.maxDate = { year: new Date().getFullYear(), month: (new Date().getMonth() + 1), day: new Date().getDate() };
    this.minValDate = { year: 1985, month: 1, day: 1 };
    this.consentId = CommonService.decryptFunction(this.route.snapshot.queryParams.id);
    this.jobId = CommonService.decryptFunction(this.route.snapshot.queryParams.pid);
    this.borroweUserId = CommonService.getStorage(Constants.httpAndCookies.BORROWER_USER_ID,true);
    this.roleId = CommonService.getStorage(Constants.httpAndCookies.ROLEID, true);
    this.profileId = CommonService.getStorage(Constants.httpAndCookies.PROFILE_ID, true);
    this.userOrgId = CommonService.getStorage(Constants.httpAndCookies.ORGID, true);
    this.userId = CommonService.getStorage(Constants.httpAndCookies.USER_ID,true);

    this.natureOfBusiness = [{ id: 1, value: 'Manufacturing' }, { id: 2, value: 'Trade' }, { id: 3, value: 'Service' }];
    this.sizeOfBusiness = [{ id: 1, value: 'Micro' }, { id: 2, value: 'Small' }, { id: 3, value: 'Medium' }];
    // this.selectValue = ['Data Enter', 'Data Enter', 'Data Enter'];
    this.smaList = [{ id: 1, value: 'SMA 0' }, { id: 2, value: 'SMA 1' }, { id: 3, value: 'SMA 2' }];
    this.typeOfCollateral = [{ id: 1, value: 'Land' }, { id: 2, value: 'House' }, { id: 3, value: 'Flat' }, { id: 4, value: 'Machinery' }, { id: 5, value: 'Others' }];
    this.isAlreadyEncumberedOp = [{ id: 1, value: 'Yes' }, { id: 2, value: 'No' }];
    this.getOneformMasterData();
    // this.getPincodeMasterList();
    this.isViewMode = CommonService.getStorage('isViewMode', true);
    if (!this.isViewMode) {
      this.isViewMode = false;
    }
    // this.workflowData.step = {};
    // this.workflowData.step.stepActions = [];
    this.getActiveSteps();
    if (this.roleId == Constants.UserRoleList.BANK_HO.id) {
      this.title = 'Data fields for HO';
      this.getBoDetailsList();
      this.hoUser = true;
      this.breadCrumbItems = [{ label: 'Dashboard', path: '/Status-list/Dashboard-List' }];
    } else if (this.roleId == Constants.UserRoleList.BANK_BO.id) {
      this.title = 'Data fields for BO';
      this.disableFlag = true;
      this.getFieldDetails();
      this.boUser = true;
      this.breadCrumbItems = [{ label: 'Dashboard', path: '/TIIC/Dashboard-List' },];
    }
    this.getIndustryList();
    this.setValidations();
    this.getApplicantDetails();


    this.getUpdateDate();


    let range = [];
    //this.profileId = RootScopeService.get("profileId");
    range.push(this.currentYear);
    for (let i = 1; i < 60; i++) {
      range.push(this.currentYear - i);
    }
    this.years = range;

    // tab
    this.tab = 1;
    this.changeTab(this.tab);
  }

  setValidations(): any {
    this.hoBoFieldsValidations = CommonService.getStorage('module_val', true);
    if (this.hoBoFieldsValidations) {
      this.hoBoFieldsValidations = JSON.parse(this.hoBoFieldsValidations.toString());
    }
  }

  createValidationJSON(json): any {
    const obj = Object.create({});
    const objMsg = Object.create({});
    for (const val of json) {
      switch (val.key) {
        case 'required':
          obj.required = val.value;
          objMsg.required = val.errorMassage;
          break;
        case 'minLength':
          obj.minlength = val.value;
          objMsg.minlength = val.errorMassage;
          break;
        case 'maxLength':
          obj.maxlength = val.value;
          objMsg.maxlength = val.errorMassage;
          break;
        case 'pattern':
          obj.pattern = val.value;
          objMsg.pattern = val.errorMassage;
          break;
        case 'max':
          obj.max = val.value;
          objMsg.max = val.errorMassage;
          break;
        case 'min':
          obj.min = val.value;
          objMsg.min = val.errorMassage;
          break;
        default:
          break;
      }
    }
    return { obj, objMsg };
  }

  changeTab(tabId: number) {
    this.tab = tabId;

    if (tabId == 2) {
      this.getUploadData();
    }
  }

  handlBsUpload(files: FileList, list, item) {
    this.bsFileToUpload = files.item(0);
    if (this.bsFileToUpload != null) {


      item.name = this.bsFileToUpload.name;
      if (!this.commonServices.isObjectNullOrEmpty(this.bsFileToUpload)) {
        if (this.bsFileToUpload.size > this.totalSize) {
          this.commonServices.warningSnackBar('Please upload less then 10MB ITR XML file');

        } else {
          this.formData.append('uploadingFiles', this.bsFileToUpload);
          this.bsAllFiles.push(this.bsFileToUpload);
        }
      } else {
        this.bsFileToUpload = null;
      }
    }
  }
  // handle file input selected file put in formdata
  handleFileInput(files: FileList, list, item) {
    this.fileToUpload = files.item(0);
    if (this.fileToUpload != null) {


      item.name = this.fileToUpload.name;
      if (!this.commonServices.isObjectNullOrEmpty(this.fileToUpload)) {
        if (this.fileToUpload.size > this.totalSize) {
          this.commonServices.warningSnackBar('Please upload less then 10MB ITR XML file');

        } else {
          this.formData.append('uploadingFiles', this.fileToUpload);
          this.allFiles.push(this.fileToUpload);
        }
      } else {
        this.fileToUpload = null;
      }
    }
  }


  // file upload @Nikul
  files: any[] = [];

  /**
   * on file drop handler
   */
  onFileDropped($event) {
    this.prepareFilesList($event);
  }

  /**
   * handle file from browsing
   */
  fileBrowseHandler(files) {
    this.prepareFilesList(files);
  }

  /**
   * Delete file from files list
   * @param index (File index)
   */
  deleteFile(index: number) {
    this.bsFiles.splice(index, 1);
  }

  /**
   * Simulate the upload process
   */
  uploadFilesSimulator(index: number) {
    setTimeout(() => {
      //  // console.log("this.files.length) -------->",this.files.length);
      //  // console.log("this.demoForm.controls -------->",this.demoForm.controls.value[0]);
      if (index === this.bsFiles.length) {
        return;
      } else {
        const progressInterval = setInterval(() => {
          if (this.bsFiles[index].progress === 100) {
            clearInterval(progressInterval);
            this.uploadFilesSimulator(index + 1);
            //this.TIICUpload_SucessFully();
          } else {
            this.bsFiles[index].progress += 5;
          }
        }, 30);
      }
    }, 1000);
  }


  /**
   * Convert Files list to normal array list
   * @param files (Files List)
   */
  prepareFilesList(files: Array<any>) {
    for (const item of files) {
      item.progress = 0;
      this.bsFiles.push(item);
    }
    this.uploadFilesSimulator(0);
  }

  /**
   * format bytes
   * @param bytes (File size in bytes)
   * @param decimals (Decimals point)
   */
  formatBytes(bytes, decimals) {
    if (bytes === 0) {
      return '0 Bytes';
    }
    const k = 1024;
    const dm = decimals <= 0 ? 0 : decimals || 2;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
  }


  getActiveSteps() {
    let req = { roleIds: [this.roleId], jobId: this.jobId, workflowId: 1 };
    this.tnServices.getActiveSteps(req).subscribe(res => {
      if (res && res.status == 200) {
        if (res.data) {
          this.workflowData = res.data;

        }
      } else {
        this.commonServices.warningSnackBar("Failed to get data");
      }
    }, _error => {
      this.commonServices.warningSnackBar("Failed to get data");
    });

  }

  performAction(stepAction) {
    if (stepAction.action.id == Constants.workflow.action.SAVE.id) {
      this.saveButton = true;
      this.sendToBo = false;
    } else if (stepAction.action.id == Constants.workflow.action.SEND_TO_BO.id || stepAction.action.id == Constants.workflow.action.SUBMIT.id) {
      this.sendToBo = true;
      this.saveButton = false;
    }
    setTimeout(() => {
      this.checkValidationsAndProceed(stepAction)
    }, 0);
  }

  checkValidationsAndProceed(stepAction) {
    if (this.roleId == Constants.UserRoleList.BANK_BO.id) {
      this.submittedHo = true;
      setTimeout(() => {
        if(this.applicantDetailForm.invalid) {
          this.applicantDetailForm.form.markAllAsTouched();
          this.commonMethods.warningSnackBar("Please fill required fields.");
          this.submittedHo = false;
          // console.log(this.applicantDetailForm);
          return;
        }
        this.saveData(stepAction);
      }, 0);
    } else if (this.roleId == Constants.UserRoleList.BANK_HO.id) {
      this.submitted = true;
      setTimeout(() => {
        if (this.applicantDetailForm.invalid || this.boDetailsForm.invalid) {
          this.boDetailsForm.form.markAllAsTouched();
          this.applicantDetailForm.form.markAllAsTouched();
          this.commonMethods.warningSnackBar("Please fill required fields.");
          return;
        }
        this.saveData(stepAction);
      }, 0);
    }
  }

  saveData(stepAction) {
    if(!this.commonServices.isObjectNull(this.applicantDetails?.gstNo)){
      // let pan = this.applicantDetails.pan;
      if(this.commonServices.isObjectNull(this.applicantDetails?.pan)){
        this.commonServices.warningSnackBar('Enter PAN first and then enter GSTIN');
        return;
      } else if(this.applicantDetails.gstNo.length < 15 || (this.applicantDetails?.pan != this.applicantDetails.gstNo.toString().substr(2,10))){
        this.commonServices.warningSnackBar('Enter the Correct GSTIN linked to the PAN entered');
        return;
      }
    }
    if (stepAction.action.id == Constants.workflow.action.SAVE.id) {
      this.save();
    } else {
      if(this.submit && !this.isValidFactoryAddress()){
        this.commonServices.warningSnackBar('Please select primary address');
        return;
      }

      if(this.roleId == Constants.UserRoleList.BANK_BO.id){
        if(this.applicantDetails.isSameAsFactoryAddress && (this.applicantDetails.registerCopyAddressId == undefined || this.applicantDetails.registerCopyAddressId == null)){
          this.commonServices.warningSnackBar('Please select address from dropdown.');
          return;
        }

        if(this.applicantDetails.isSameAsRegisterFactoryAddress && (this.applicantDetails.correspondenceCopyAddressId == undefined || this.applicantDetails.correspondenceCopyAddressId == null)){
          this.commonServices.warningSnackBar('Please select address from dropdown.');
          return;
        }
      }

      const config: any = {
        windowClass: 'popup-650',
        backdrop: 'static'
      };
      const modalRef = this.modalService.open(BOApplicationSubmitPopupComponent, config);
      modalRef.closed.subscribe(result => {
        if (result && result == 1) {
          // UPDATE PROFILE PAN IF ITR IS COMPLETED
            if(this.isDeleteButtion == false && stepAction.action.id == Constants.workflow.action.SUBMIT.id){
              let profileDataReq = {pan:this.applicantDetails.pan,profileId:this.profileId};
              this.tnServices.updateProfilePanData(profileDataReq).subscribe(res => {
                if(res.flag == true){
                  this.save(true, stepAction);
                }else{
                  this.commonMethods.warningSnackBar("Failed to Submit");
                }
              });
            }else{
              this.save(true, stepAction);
            }
        }
      });
    }
  }

  isValidFactoryAddress() {
    let isPrimarySelected = false;
    if(this.applicantDetails.factoryAddressList.length == 1){
      this.applicantDetails.factoryAddressList[0].isPrimary = true;
      isPrimarySelected = true;
    } else {
      for (let i=0; i < this.applicantDetails.factoryAddressList.length; i++) {
        if(this.applicantDetails.factoryAddressList[i].isPrimary){
          isPrimarySelected = true;
          break;
        }
      }
    }
    return isPrimarySelected;
  }

  save(callWorkflow?, stepAction?) {
    if (this.roleId == Constants.UserRoleList.BANK_HO.id) {
      if ((!this.applicantDetails.isSelectExistingDetails) && this.boDetailsList.filter(obj => obj.emailId == this.applicantDetails.boDetailsProxy.emailId).length > 0) {
        this.commonServices.warningSnackBar('BO with emailId: ' + this.applicantDetails.boDetailsProxy.emailId + " Already exist Please select BO from drop down");
        return;
      }
    }
      const applicantDetails = _.cloneDeep(this.applicantDetails);
      for(const key in applicantDetails){
        this.setNullForEmptyValue(key, applicantDetails);
      }

      let saveFieldReq: any = {};
      saveFieldReq.fields = JSON.stringify(applicantDetails);
      saveFieldReq.borrowerProposalId = this.consentId;

      setTimeout(() => {
        this.tnServices.saveFieldForHoUser(saveFieldReq).subscribe(res => {
          if (res && res.status == 200) {
            this.saveApplicantDetails(callWorkflow,stepAction, applicantDetails);
            return;
          } else if (res && res.message) {
            this.commonServices.warningSnackBar(res.message);
          }
          this.commonServices.warningSnackBar('Failed to save fields details');
        });
      }, 0);
    // } else {
    //     this.saveApplicantDetails(callWorkflow,stepAction);
    // }
  }

  updateWorkflow(stepAction){
    let workflowReq = { jobId: this.jobId, applicationId: this.consentId, workflowId: 1, roleIds: [this.roleId], toStep: stepAction.nextworkflowStep, actionId: stepAction.action.id, currentStep: stepAction.workflowStep };
    this.tnServices.updateWrokflow(workflowReq).subscribe(succss => {
      if (succss && succss.status == 200) {
        this.commonServices.successSnackBar('Applicant details sent successfully');
        if (this.roleId == Constants.UserRoleList.BANK_HO.id) {
          this.router.navigate([Constants.ROUTE_URL.DASHBOARD]);
          return;
        }
        this.router.navigate([Constants.ROUTE_URL.BO_DASHBOARD]);
        return
      }
      if(this.roleId == Constants.UserRoleList.BANK_BO.id && workflowReq.actionId == Constants.workflow.action.SUBMIT.id){
        this.commonServices.warningSnackBar('Selected District has no Branch Manager/Field Inspection Officer tagged. Kindly select another district or contact the Selected Lender');
        return;
      }
      this.commonServices.warningSnackBar('Failed to sent application');
    });
  }

  setNullForEmptyValue(fieldName, applicantData) {
    if(this.isNestedObj(fieldName)){ // correspondenceAddress
      if(!this.removeNullStringFromObject(applicantData[fieldName], true)) {
        applicantData[fieldName] = null;
      }
    } else if(this.isArrayObject(fieldName)) { // key == 'promoterDetailsList','creditDetailsList','factoryAddressList';
      applicantData[fieldName].forEach((element, i) => {
        if(!this.removeNullStringFromObject(element, true)) {
          applicantData[fieldName].splice(i, 1);
        }
      });
    } else { // Applicant Details
      if(this.commonServices.isObjectNull(applicantData[fieldName])) {
        applicantData[fieldName] = null
      }
    }
  }

  removeNullStringFromObject(data, isUseForLoop) {
    let isHasValue = false;
    if(isUseForLoop){
      for (const key in data) {
        // if(_.isEmpty(data[key])) {
        if(this.commonServices.isObjectNull(data[key])) {
          data[key] = null
        } else {
          isHasValue = true;
        }
      }
    }
    return isHasValue;
  }

  saveApplicantDetails(callWorkflow?, stepAction?, applicantDetails?) {
    let data: any = {};
    if(applicantDetails) {
      data = applicantDetails;
    } else {
      data = this.applicantDetails;
    }
    data.borrowerProposalId = this.consentId;
    if(callWorkflow){
      data.isSendToBo = true;
      this.applicantDetails.isSendToBo = true;
    }
    this.tnServices.saveApplicantDetails(data).subscribe(res => {
      if (res && res.status == 200) {
        if (callWorkflow) {
          if(stepAction.action.id == Constants.workflow.action.SUBMIT.id){
            let req= {userId:this.borroweUserId};
            this.tnServices.updatedUserActiveFlag(req).subscribe(resFlag=>{
              if(resFlag && resFlag.status==200){
                this.updateWorkflow(stepAction);
              }else{
                this.commonServices.warningSnackBar('Failed to save details');
                return;
              }
            });
          }else{
            this.updateWorkflow(stepAction);
          }
        } else {

          this.commonServices.successSnackBar('Applicant details save successfully');
          this.getApplicantDetails();

          return;
          // if(this.roleId == Constants.UserRoleList.BANK_HO.id){
          //   this.router.navigate([Constants.ROUTE_URL.TIIC_BANKER_PARTNER]);
          //   return;
          // }
          // this.router.navigate([Constants.ROUTE_URL.BO_DASHBOARD]);
        }

      } else if (res && res.message) {
        this.commonServices.warningSnackBar(res.message);
      } else {
        this.commonServices.warningSnackBar('Failed to save details');
      }
    });
  }

  isNestedObj(key) {
    return key == 'correspondenceAddress' || key == 'registeredAddress' || key == 'boDetailsProxy';
  }

  isArrayObject(key) {
    return key == 'promoterDetailsList' || key == 'creditDetailsList' || key == 'factoryAddressList';
  }

  getBoDetailsList() {
    this.tnServices.getBoDetails(this.userOrgId).subscribe(res => {
      if (res && res.data && res.status == 200) {
        this.boDetailsList = res.data;
        // // console.log('this.boList:: ',this.boDetailsList);
        return;
      }
      //this.commonServices.warningSnackBar(res.message);
    }, _error => {
      this.commonServices.warningSnackBar('Failed to get branch details');
    });
  }

  addNewBO() {
    this.applicantDetails.isSelectExistingDetails = false;
  }

  getFieldDetails() {
    //// console.log('Consent id:: '+ this.consentId);
    this.tnServices.getFieldDetails(this.consentId, Constants.UserRoleList.BANK_HO.id).subscribe(success => {
      if (success && success.data && success.data.fields) {
        this.applicantDetailsHo = JSON.parse(success.data.fields);
        // console.log('this.applicantDetailsHo: ', this.applicantDetailsHo);
      }
    });
  }

  disableField(fieldName): boolean {
    if (this.roleId == Constants.UserRoleList.BANK_BO.id && this.fieldDetails.indexOf(fieldName) != -1) {
      return true;
    }
    return false;
  }

  getOneformMasterData() {
    // this.constitutionList = [{ id: 1, value: 'Proprietorship' }, { id: 2, value: 'Partnership' }, { id: 3, value: 'Pvt Ltd' }, { id: 4, value: 'Public Ltd' }, { id: 5, value: 'Other' }];
    let classes = ['CONSTITUTION'];
    this.tnServices.getListByClass(classes).subscribe(success =>{
      if(success && success.data){
        this.constitutionList = success.data.CONSTITUTION;
        return;
      }
    },_error =>{
      this.commonServices.warningSnackBar('Failed to get list');
    })
  }

  applyValidation(fieldName) {
    //// console.log(this.applicantDetailForm);
    if (this.isNestedObj(fieldName)) {
      let nestedObj: any = [];
      for (const key in this.applicantDetails[fieldName]) {
        let tmp = this.hoBoFieldsValidations.filter(o => o.label == key);
        if (tmp && tmp.length > 0) {
          let valObj = tmp[0];
          if (valObj.validations) {
            const validateObj = this.createValidationJSON(valObj.validations);
            let o = { ['' + key.toString()]: validateObj };
            nestedObj.push(o);
          }
        }
      }
      this.validationObjects['' + fieldName] = nestedObj;
    } else if (this.isArrayObject(fieldName)) {
      return;
    } else {
      for (let validationsObjs of this.hoBoFieldsValidations) {
        if (validationsObjs.label == fieldName) {
          if (validationsObjs.validations) {
            const validateObj = this.createValidationJSON(validationsObjs.validations);
            //let obj: any ={};
            this.validationObjects['' + fieldName] = validateObj;
            return validateObj;
          } else {
            this.validationObjects['' + fieldName] = null;
            //this.validationObjects.validateMsg = null;
          }
        }
      }
    }
    //// console.log(this.validationObjects);
  }

  getApplicantDetails() {
    this.applicantDetails.borrowerProposalId = this.consentId;
    this.tnServices.getApplicantDetails(this.applicantDetails).subscribe(success => {
      if (success && success.status == 200) {
        this.applicantDetails = success.data;
        if(this.applicantDetails.boDetailsProxy && !this.applicantDetails.boDetailsProxy.isSendCopy){
          this.applicantDetails.boDetailsProxy.isSendCopy = !(!this.applicantDetails.boDetailsProxy.zoEmailId);
        }
        if(this.applicantDetails.campOrgId != null){
          this.displayContacts = true;
        }
        setTimeout(() => {
        this.updateFactoryAddressList();
        this.updateFactoryRegisterAddressList();
        },1200);

        // to avoid saving full address in register address
        if(this.applicantDetails.isSameAsFactoryAddress){
          this.resetAddressFields(this.applicantDetails.registeredAddress);
        }

        // to avoid saving full address in correspondence address
        if(this.applicantDetails.isSameAsRegisterFactoryAddress){
          this.resetAddressFields(this.applicantDetails.correspondenceAddress);
        }
        // if(this.applicantDetails.correspondenceCopyFrom == 2){
        //   this.applicantDetails.correspondenceCopyAddressId = this.factoryRegisterAddressLst.length-1;
        // }
        if (this.applicantDetails.typeOfIndustry != null) {
          this.getIndustryProductList(this.applicantDetails.typeOfIndustry);
        }
        if(this.applicantDetails?.promoterDetailsList?.length == 0) {
          this.applicantDetails.promoterDetailsList.push(new PromoterDetailsModel());
        }
        if(this.applicantDetails?.factoryAddressList?.length == 0) {
          this.applicantDetails.factoryAddressList.push(new AddressMasterModel());
        }

        if(this.applicantDetails && this.applicantDetails.creditDetailsList && this.applicantDetails.creditDetailsList.length ==0){
          this.applicantDetails.creditDetailsList.push(new CreditDetailsModel());
        }

        if (this.applicantDetails.boId != null) {
          this.getBoDetailsList();
        }
        for (const key in this.applicantDetails) {
          this.applyValidation(key);
        }
        this.flag = true;
        return;
      }
      this.commonServices.warningSnackBar('Failed to get applicant details');
    });
  }

  isValidAddress(address,addressTypeStr){

    for(let i=0;i<this.addressFieldList.length;i++){
      const control = this.applicantDetailForm?.form?.controls['applicantDetails.'+addressTypeStr+'.address.'+this.addressFieldList[i]];
      if(!control){
        return false;
      }
      const isValid = ((control.errors == null || control.errors == undefined)) || (control.valid);// !this.applicantDetailForm?.form?.controls['applicantDetails.'+addressTypeStr+'.address.'+this.addressFieldList[i]].valid;
      const isNotNull = !address[this.addressFieldList[i]];
      if(isNotNull || !isValid){
        return false;
      }
      // applicantDetails.correspondenceAddress.address.block
      // applicantDetails.factoryAddressList[0].address.block
      // this.applicantDetailForm?.form?.controls['applicantDetails.correspondenceAddress' + '.address.block']?.valid
    }
    return true;
  }

  updateFactoryAddressList() {
    this.enableIsSameAsFacAddOp = false;
    this.enableIsSameAsRegFacAddressOp = false;
    this.factoryAddressLst = [];
    for (let i = 0; i < this.applicantDetails.factoryAddressList.length; i++) {
      if(this.isValidAddress(this.applicantDetails.factoryAddressList[i],'factoryAddressList[' +i+ ']')){
        let addressObj = {
          id:i,
          value:('Factory address '+ (i+1)),
          address : this.applicantDetails.factoryAddressList[i],
          type:1
        }
        this.factoryAddressLst.push(addressObj);
      }
    }

    if(this.factoryAddressLst.length > 0){
      this.enableIsSameAsFacAddOp = true;
      this.enableIsSameAsRegFacAddressOp = true;
    }else{
      this.enableIsSameAsFacAddOp = false;
      this.applicantDetails.isSameAsFactoryAddress=false;
      this.applicantDetails.registerCopyAddressId = undefined;
      if(this.applicantDetails.correspondenceCopyFrom == 1){
        this.applicantDetails.correspondenceCopyAddressId = undefined;
      }
    }
  }


  updateFactoryRegisterAddressList(isIgnoreFactorAdd?) {

    this.factoryRegisterAddressLst = [];
    this.factoryRegisterAddressLst = this.factoryRegisterAddressLst.concat(this.factoryAddressLst);
    if(!this.applicantDetails.isSameAsFactoryAddress){
      if(this.isValidAddress(this.applicantDetails.registeredAddress,'registeredAddress')){
        const startIndex = this.factoryAddressLst.length;
        let addressObj = {
          id:startIndex,
          value:('Registered Office Address'),
          address : this.applicantDetails.registeredAddress,
          type:2
        }
        this.factoryRegisterAddressLst.push(addressObj);
      }
    }

    if(this.factoryRegisterAddressLst.length > 0){
      this.enableIsSameAsRegFacAddressOp = true;

      // to set register address in drop down in case any factory address added/remove from list
      if(this.applicantDetails.isSameAsRegisterFactoryAddress && this.applicantDetails.correspondenceCopyAddressId && this.applicantDetails.correspondenceCopyFrom == 2){
          this.applicantDetails.correspondenceCopyAddressId =  this.factoryRegisterAddressLst.length - 1;
      }
    }else{
      this.enableIsSameAsRegFacAddressOp = false;
      this.applicantDetails.isSameAsRegisterFactoryAddress = false;
      this.applicantDetails.correspondenceCopyAddressId=undefined;
    }
  }

  setCopyFrom(event){
    this.applicantDetails.correspondenceCopyFrom = event.type;
  }

  removeCollateral(index) {
    this.applicantDetails.creditDetailsList.splice(index, 1);
  }

  addNewCollateral() {
    //let newCredit = _.cloneDeep(this.applicantDetails.creditDetailsList[this.applicantDetails.creditDetailsList.length-1]);
    this.applicantDetails.creditDetailsList.push(new CreditDetailsModel());
  }

  addNewPromoterDetails() {
    this.applicantDetails.promoterDetailsList.push(new PromoterDetailsModel());
  }

  addNewFactoryAddress() {
    this.applicantDetails.factoryAddressList.push(new AddressMasterModel());
  }

  getIndustryList() {
    this.tnServices.getIndustryList().subscribe(success => {
      if (success && success.listData) {
        this.industryList = success.listData;
        return;
      }
      this.commonServices.warningSnackBar('Failed to get industry list')
    })
  }

  getIndustryProductList(industryId) {
    this.industryProductList = [];
    this.tnServices.getIndustryProductList(industryId).subscribe(success => {
      if (success && success.listData) {
        this.industryProductList = success.listData;
        return;
      }
      this.commonServices.warningSnackBar('Failed to get industry product list')
    })
  }

  changeTypeOfIndustry(_event: any) {
    this.getIndustryProductList(this.applicantDetails.typeOfIndustry);
    this.applicantDetails.typeOfProduct = null;
  }

  // saveOrUpdateUser() {
  //   let userData = new BankPartnerModel();

  //   if (this.boDetailsForm.invalid) {
  //     this.commonServices.warningSnackBar("please fill user details")
  //     return;

  //   }

  //   userData.userRoleId = Constants.UserRoleList.BANK_BO;
  //   userData.email = this.applicantDetails.boDetailsProxy.emailId;
  //   userData.isActive=true

  //   userData.loggedInUserId = parseInt(CommonService.getStorage(Constants.httpAndCookies.USER_ID, true));;

  //   this.tnServices.createOrUpdateUser(userData).subscribe(res => {
  //     if (res.status === 200 && res.data) {
  //       // // console.log("Successfully Created User");
  //       this.commonServices.successSnackBar("Successfully Created User");
  //       this.router.navigate([Constants.ROUTE_URL.DASHBOARD]);
  //     } else {
  //       // // console.log("error while save or update user details");
  //       this.commonServices.warningSnackBar(res.message);
  //     }
  //   });
  // }

  // getFormatedDate(date): any {
  //   return;
  //   //const dateParts = date.split('-');
  //   const dateObj = new Date(+date.year, date.month - 1, +date.day);
  //   return this.datePipe.transform(dateObj, 'y-MM-dd');
  // }

  numberOnly(event): boolean {
    const charCode = (event.which) ? event.which : event.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
      return false;
    }
    return true;
  }

  back() {
    CommonService.removeStorage("isViewMode");
    if (this.roleId == Constants.UserRoleList.BANK_HO.id) {
      this.router.navigate([Constants.ROUTE_URL.DASHBOARD]);
    } else {
      this.router.navigate([Constants.ROUTE_URL.BO_DASHBOARD]);
    }
  }

  change() {
    if (this.applicantDetails.isSelectExistingDetails) {
      //// console.log('Input changed:: '+ this.applicantDetails.isSelectExistingDetails);
      //this.applicantDetails.boId=null;
      this.getBoDetailsList();
    }
  }

  checkSanctionDisburseDate(index) {
    var selectedSancationDate = this.applicantDetails.creditDetailsList[index].sanctionDate;
    this.applicantDetails.creditDetailsList[index].minDDate = new NgbDate(toInteger(selectedSancationDate.split('-')[2]), toInteger(selectedSancationDate.split('-')[1]), toInteger(selectedSancationDate.split('-')[0]));
    if (selectedSancationDate) {
      this.applicantDetails.creditDetailsList[index].disbursementDate = null;
    }
    return null;
  }

  changePrimaryAddress(index) {
    for (let i = 0; i < this.applicantDetails.factoryAddressList.length; i++) {
      if (index == i) {
        this.applicantDetails.factoryAddressList[i].isPrimary = true;
      } else {
        this.applicantDetails.factoryAddressList[i].isPrimary = false;
      }
    }
  }

  getUpdateDate(count?) {
    this.tnServices.getItrDetails(this.profileId).subscribe(res => {
      if (res.status === 200) {
        const responseData = res.data;
        this.updateDate = responseData.updateDate;
        const itrDetails = responseData.itrDetailsList;
        this.isDeleteButtion = res.data.isUpload;
        this.itrDisplayYearList = responseData.yearData;
        this.itrDisplayYearList = responseData.yearData;
        const latestYear = responseData.latestYear;
        let date: any[];
        if (this.updateDate.includes('-')) {
          date = this.updateDate.split('-');
          const abc = Math.floor((Date.UTC(this.currentDate.getFullYear(), Number(date[1]) - 1, Number(date[0])) -
            Date.UTC(this.currentDate.getFullYear(), this.currentDate.getMonth(), this.currentDate.getDate())) / (1000 * 60 * 60 * 24));
          if (abc <= 0) {
            this.currentDate.setFullYear(this.currentDate.getFullYear());
            this.lastDate.setFullYear(this.lastDate.getFullYear() - 1);
            this.beforeLastDate.setFullYear(this.beforeLastDate.getFullYear() - 2);
            this.beforeLastToLastDate.setFullYear(this.beforeLastToLastDate.getFullYear() - 3);
          } else {
            this.currentDate.setFullYear(this.currentDate.getFullYear() - 1);
            this.lastDate.setFullYear(this.lastDate.getFullYear() - 2);
            this.beforeLastDate.setFullYear(this.beforeLastDate.getFullYear() - 3);
            this.beforeLastToLastDate.setFullYear(this.beforeLastToLastDate.getFullYear() - 4);
          }
        }
        this.mandatoryYearDisp = this.itrDisplayYearList[0].isMandatory ? this.itrDisplayYearList[0].displayYear :
          ((Number(latestYear) - 1) + '-' + (Number(latestYear) - 2));
        if (this.count == 0) {
          if (this.itrDisplayYearList[0].year == latestYear && this.itrDisplayYearList[0].viewRequest != null) {
            this.latestYearItrAvail.patchValue(true);
            this.mandatoryYearDisp = this.itrDisplayYearList[0].isMandatory ? this.itrDisplayYearList[0].displayYear :
              ((Number(latestYear)) + '-' + (Number(latestYear) - 1));
            this.latestYearItrAvail.disable();
          } else {
            this.mandatoryYearDisp = this.itrDisplayYearList[0].isMandatory ? this.itrDisplayYearList[0].displayYear :
              ((Number(latestYear) - 1) + '-' + (Number(latestYear) - 2));
            this.latestYearItrAvail.patchValue(false);
          }
          if (!this.latestYearItrAvail.value && this.count == 0) {
            this.getUpdateDate(this.count);
            this.count++;
          }
        }
        if (this.itrDisplayYearList[0].viewRequest != null) {
          this.isUploadITR = false;
        } else {
          this.isUploadITR = true;
        }
      }
    });
  }

  removeFile(index) {
    if(this.allFiles && this.allFiles.length > 0){
      this.allFiles.splice(index, 1);
      this.itrDisplayYearList[index].name =null;
    }
  }

  uploadITRFiles() {
    // FIRST CHECK APPLICANT PAN IS VALID OR NOT
    if(this.applicantDetails.pan){
        let newPan = this.applicantDetails.pan;
        var reg  = new RegExp("^([a-zA-Z]){5}([0-9]){4}([a-zA-Z]){1}?$");
        if(newPan.match(reg)){
            // console.log("Pan is valid")
        }else{
          // console.log("Pan is Invalid ---------{}")
          this.commonServices.warningSnackBar('Kindy enter Valid PAN to proceed with ITR upload !');
        return;
        }
      }
      //------------------- END



   // UPDATE APPLICANT PAN IN PROFILE DETAILS
  let profileDataReq = {pan:this.applicantDetails.pan,profileId:this.profileId};
  this.tnServices.updateProfilePanData(profileDataReq).subscribe(res => {
    if(res && res.flag == false){
      this.commonServices.warningSnackBar('Kindy enter PAN to proceed with ITR upload !');
       return false;
    } else {
      if(!this.itrDisplayYearList[0].name  && this.itrDisplayYearList[0].viewRequest == null) {
        this.commonMethods.warningSnackBar('Please fill in data for ' + this.mandatoryYearDisp);
         return false;
      }
      var flagNew = false;
      if(flagNew == false){
        this.itrDisplayYearList.forEach(element => {
          if(element.isMandatory == true){
            if(!element.name){
              flagNew = true;
              this.commonMethods.warningSnackBar('Please fill in data for ' + element.displayYear);
              return;
            }
          }
        });
      }
      if(flagNew){
         return false;
      }
      if (this.formData.get('uploadingFiles') == null || this.formData.get('uploadingFiles') === undefined) {
        this.commonServices.warningSnackBar('Please upload the ITR files first');
        //return ;
      }
    }
    let data: any = {};
    data.isAlreadyRead = true;
    data.profileId = this.profileId;
    data.isBankPartnerInterface = true;
    this.formData.append('itrRequest', JSON.stringify(data));
    this.tnServices.uploadITR(this.formData).subscribe(res => {
      if (res.status === 200) {
        if (res.success === 'true') {
          this.tnServices.profileVersionDetails(this.profileId).subscribe(res => {
            if (res.data && res.status === 200) {
              this.getUpdateDate();
              // console.log("res.data --------=> ", res.data);
            } else {
              this.commonServices.warningSnackBar(res.message);
            }

          }, error => {
            this.commonServices.errorSnackBar(error);
          });

          this.commonServices.successSnackBar(res.message);
          if (this.commonMethods.detectIEEdge() != false) {
            window.location.reload();
          }

        } else {
          data = {};
          this.name = { itr1: '', itr2: '', itr3: '' };
          // this.fileToUpload = null;
          this.formData = new FormData();
          this.commonServices.errorSnackBar(res.message);
        }
      } else {
        data = {};
        this.name = { itr1: '', itr2: '', itr3: '' };
        // this.fileToUpload = null;
        this.formData = new FormData();
        this.commonServices.errorSnackBar(res.message);
      }
    }, error => {
      data = {};
      this.name = { itr1: '', itr2: '', itr3: '' };
      // this.fileToUpload = null;
      this.formData = new FormData();
      this.commonServices.errorSnackBar(error);
    });
    return false;
    });
  }


  getBankList() {
    this.tnServices.getBankList().subscribe(res => {
      if (res.status === 200) {
        //this.commonServices.loadScript('assets/js/SlickSlider.js');
        this.states = res.data;
        //this.commonservice.successSnackBar(res.status);
      } else {
        this.commonServices.errorSnackBar(res.message);
      }
    }, error => {
      this.commonServices.errorSnackBar(error);
    });
  }


  getPincodeMasterList() {
    // this.tnServices.getFioCreatedPincodeList().subscribe(res => {
    //   this.pincodeList = [];
    //   if(res && res.data) {
    //     // // console.log("Pincode api Response  ===={}",res.data);
    //     this.pincodeList = res.data;
    //   } else {
    //     this.pincodeList = [];
    //   }
    // });
  }

  getBsMasterId() {
    let req = { "profileId": this.profileId };
    this.isNewAdded = true;
    this.selectedBank = {};
    this.activateBS = -1;
    this.selectedBSDetails = {};
    this.stateCtrl.setValue("");
    this.tnServices.getBsMasterId(req).subscribe(res => {
      if (res.status == 200 && res.data != null && res.data != undefined) {
        this.bsMasterId = res.data;
        this.getCombineBankList();

      } else {
        this.commonServices.errorSnackBar(res.message);
      }
    }, error => {
      this.commonServices.errorSnackBar(error);
    })
  }

  getCombineBankList() {
    let reportRequest = { "profileId": this.profileId, "bsMasterId": this.bsMasterId ,isFromSbi:false,isFromFederal:false};
    this.tnServices.getCombineBankList(reportRequest).subscribe(res => {
      if (res.status === 200) {
        // onloan jaava script in  SlickSlider.js file
        this.opationsfrom = res.data;
        this.opationsForSlider = Object.create(res.data);
        this.opationsForSlider.forEach(x => {
          x.number = this.opationsfrom.indexOf(x) +1;
          x.position = (this.opationsfrom.indexOf(x) +1) +"/"+this.opationsfrom.length;
        });
        if (this.opationsfrom.length > 0) {
          this.checkMissingMonth();
          this.selectedBank = this.opationsForSlider[0];
          this.opationsForSlider[0].accountDuration = '' + (this.currentYear - this.selectedBank.sinceYear) + ' Year,' + Math.abs(this.selectedBank.sinceMonth - this.currentDate.getMonth()) + ' Months'
          for (var i = 0; i < this.opationsfrom.length; i++) {
            this.opationsfrom[i].totalTransactions = this.formatValue(this.opationsfrom[i].totalTransactions);
          }
          this.files = [];
        }else{
          this.opationsForSlider = [Object.create({})];
        }
      }else{
        this.commonServices.errorSnackBar('Failed to get bank statement details');
      }
    },
      error => {
        this.commonServices.errorSnackBar(error);
      });
  }

  checkMissingMonth(){
    let request = { "profileId": this.profileId, "bsMasterId": this.bsMasterId};
    this.tnServices.checkMissingMonth(request).subscribe(res => {
        if (res.status == 500 && res.message.includes('missing')) {
          this.isInvalidData = true;
        }
        if(res.status == 500){
          this.commonServices.errorSnackBar(res.message);
        }
    }, error => {
      this.commonServices.errorSnackBar(error);
    });
  }

  getUploadData(){
    //this.getUpdateDate();
    this.getBsData();
  }

  getBsData(){
    this.getBankList();
    this.getBsMasterId();
  }


  formatValue(textMIncome: string) {

    if (textMIncome == null || textMIncome == undefined) {
      return "";
    }
    textMIncome = textMIncome.toString();
    if (textMIncome.indexOf(".") != -1) {
      textMIncome = textMIncome.split(".")[0];
    }

    if (textMIncome.length > 3 && !textMIncome.startsWith("0")) {
      textMIncome = textMIncome.replace(/,/g, "");
      let formatedIncome = "";
      if (textMIncome.length == 4) {
        textMIncome = textMIncome.substr(0, 1) + "," + textMIncome.substr(1, textMIncome.length);
      } else {
        if (textMIncome.length > 3) {
          formatedIncome = textMIncome.substr(textMIncome.length - 3);
          textMIncome = textMIncome.substr(0, textMIncome.length - 3);

          let netMonthlyIncomeArray = Array.from(textMIncome);
          if (textMIncome.length >= 2) {
            if (textMIncome.length % 2 == 0) {
              for (var i = netMonthlyIncomeArray.length; i > 0; i--) {
                if (i % 2 == 0) {
                  formatedIncome = "," + formatedIncome;
                }
                formatedIncome = netMonthlyIncomeArray[i - 1] + formatedIncome;
              }
            } else {
              for (var i = netMonthlyIncomeArray.length; i > 0; i--) {
                if (i % 2 != 0) {
                  formatedIncome = "," + formatedIncome;
                }
                formatedIncome = netMonthlyIncomeArray[i - 1] + formatedIncome;
              }
            }
          }
        }
        textMIncome = formatedIncome;
      }
    }
    return textMIncome;
  }


  submit() {
    this.selectedBank = this.opationsForSlider[0];
    if (this.bsFiles == null || this.bsFiles.length == 0) {
      //this.commonservice.errorSnackBar("Kindly select Bank Statement");
      this.commonServices.warningSnackBar("Kindly select Bank Statement");
      return;
    }

    if (!this.selectedBank || !this.selectedBank.bankId) {
      this.commonServices.warningSnackBar("Kindly select your bank");
      return;
    }

    if (!this.selectedBank || !this.selectedBank.sinceYear || !this.selectedBank.sinceMonth) {
        this.commonServices.warningSnackBar("Kindly enter your account's age");
      return;
    }

    let date = new Date();
    if (this.selectedBank.sinceYear === date.getFullYear()) {
      if (this.selectedBank.sinceMonth > date.getMonth()) {
        this.commonServices.warningSnackBar("Selected Month should not greter than current running month.");
        return;
      }
    }

    //this.submitDisabled = true;
    var formData: any = new FormData();
    let statement: any;

    let relationDetail = { "sinceYear": this.selectedBank.sinceYear, "sinceMonth": this.selectedBank.sinceMonth };
    statement = {};
    let data: any;
    data = statement;
    data.relationDetail = relationDetail;
    data.bankId = this.selectedBank.bankId;
    data.passList = [];
    data.isFromMsme = true;
    data.accountType = this.selectedBank.accountType;

    if (this.selectedBank.perfiousId) {
      data.perfiousId = this.selectedBank.perfiousId;
    }
    data.profileId = this.profileId;
    data.bsMasterId = this.bsMasterId;
    let pass: any;
    //let obj = document.getElementsByClassName('file-password');
    for (let i = 0; i < this.bsFiles.length; i++) {
      formData.append("statement1", this.bsFiles[i]);
      data.passList.push(null);
      //pass = obj.item(i);
      // if (pass.firstElementChild.value == "") {
      //   data.passList.push(null);
      // } else {
      //   data.passList.push(pass.firstElementChild.value);
      // }

    }

    //data.passList.push("test");
    formData.append("uploadRequest", JSON.stringify(data));
    // formData.forEach((value,key) => {
    //   // console.log(key+" "+value)
    // });
    this.tnServices.uploadBankStatement(formData).subscribe(res => {
      if (res.status === 200) {
        //this.submitDisabled = false;
        this.commonServices.successSnackBar("Bank Statment uploaded successfully.");
        this.getCombineBankList();
      } else {
        this.commonServices.errorSnackBar(res.message);
        //this.submitDisabled = false;
        return;
      }
    }, error => {
      this.commonServices.errorSnackBar(error);
      //this.submitDisabled = false;
    });
  }

  proceed() {
    let request = { "profileId": this.profileId, "bsMasterId": this.bsMasterId};
    this.tnServices.checkMissingMonth(request).subscribe(res => {
      if (res.status == 200) {
        let proceedRequest = { "profileId": this.profileId, "bsMasterId": this.bsMasterId};
        this.tnServices.proceedBankStatement(proceedRequest).subscribe(res => {
          if (res.status == 200) {
            this.commonServices.successSnackBar("Bank Statment uploaded successfully.");
            this.getCombineBankList();
          } else {
            this.commonServices.errorSnackBar(res.message);
          }
        }, error => {
          this.commonServices.errorSnackBar(error);
        })
      } else {
        if (res.status == 500 && res.message.includes('missing')) {
          this.isInvalidData = true;
        }
        this.commonServices.errorSnackBar(res.message);
      }
    }, error => {
      this.commonServices.errorSnackBar(error);
    });
  }

  removePromoterDetails(index) {
    this.applicantDetails.promoterDetailsList.splice(index, 1);
  }

  resetAddressByType(addressType:any) {

    if (addressType == 1) {
      this.applicantDetails.registerCopyAddressId = null;
      this.resetAddressFields(this.applicantDetails.registeredAddress);
      this.updateFactoryAddressList();
    } else if (addressType == 2 || this.applicantDetails.correspondenceCopyFrom == 1){
      this.applicantDetails.correspondenceCopyAddressId = null;
      this.resetAddressFields(this.applicantDetails.correspondenceAddress);
      this.updateFactoryAddressList();
      this.updateFactoryRegisterAddressList();
    }
  }

  setdisplayContacts(){
    this.displayContacts = true;
    // this.selectedOrgId = _event.selected.value;
  }


  resetAddressFields(address:AddressMasterModel){

      // 'block','nameOfBuilding','streetName','pincode','districtId','blockId','stateId','cityId','email','phone'
      if(address){
        address.id = undefined;
        address.block = undefined;
        address.nameOfBuilding = undefined;
        address.streetName = undefined;
        address.pincode = undefined;
        address.districtId = undefined;
        address.blockId = undefined;
        address.stateId = undefined;
        address.cityId = undefined;
        address.email = undefined;
        address.phone = undefined;
      }

  }
}
