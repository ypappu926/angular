import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CommonMethods } from 'src/app/CommoUtils/common-services/common-methods';
import { CommonService } from 'src/app/CommoUtils/common-services/common.service';
import { ValidationsService } from 'src/app/CommoUtils/common-services/validations.service';
import { Constants } from 'src/app/CommoUtils/constants';

declare var jQuery: any;
declare var $: any;

@Component({
  selector: 'app-tiic-field-inspection-form',
  templateUrl: './tiic-field-inspection-form.component.html',
  styleUrls: ['./tiic-field-inspection-form.component.scss']
})
export class TIICFieldInspectionFormComponent implements OnInit {

  fieldInspectionForm: FormGroup;
  submitted = false;

  breadCrumbItems!: Array<{}>;

  selectValue!: string[];
  // Collapse declare
  isCollapsed!: boolean;
  constructor(private modalService: NgbModal, 
              private fb : FormBuilder,
              private validationService: ValidationsService,
              private commonMethods: CommonMethods,
              private commonService: CommonService) { 
                commonMethods.getValidationByModule(Constants.validationModule.FIELD_INSPECTION_FORM);
              }

  ngOnInit(): void {
    this.isCollapsed=false;
    this.breadCrumbItems = [{ label: 'Dashboard', path: '/' }, { label: 'My Applications', path: '/', active: true }];
    this.selectValue = ['Newest First', 'Oldest First'];

    this.createForm();
  }

  createForm(data?){
    this.fieldInspectionForm = this.fb.group({
       firmName : this.validationService.validationConfig(data && data.firmName ? data.firmName : ''),
       constitution : this.validationService.validationConfig(data && data.constitution ? data.constitution : ''),
       gstNo : this.validationService.validationConfig(data && data.gstNo ? data.gstNo : ''),
       nameOfPerson: this.validationService.validationConfig(data && data.nameOfPerson ? data.nameOfPerson : '', this.commonMethods.getValidations('nameOfPerson')),
       businessAddress: this.validationService.validationConfig(data && data.businessAddress ? data.businessAddress : '', this.commonMethods.getValidations('businessAddress')),
       residenceAddress: this.validationService.validationConfig(data && data.residenceAddress ? data.residenceAddress : '', this.commonMethods.getValidations('residenceAddress')),
       businessDescription: this.validationService.validationConfig(data && data.businessDescription ? data.businessDescription : '', this.commonMethods.getValidations('businessDescription')),
       mobile: this.validationService.validationConfig(data && data.mobile ? data.mobile : '', this.commonMethods.getValidations('mobile')),
       email: this.validationService.validationConfig(data && data.email ? data.email : '', this.commonMethods.getValidations('email')),
       remark : this.validationService.validationConfig(data && data.remark ? data.remark : ''),
    });
  }
  // Check_Email_user_Popup(){
  //   const config = {
  //     windowClass: 'Mediam-model',
  //     size: 'lg',
  //   };
  //   console.log("start popup")
  //   const modalRef = this.modalService.open(BUEmailCheckComponent, config);
  //   console.log("start popup")
  //   return modalRef;
  // }

  keyPressEvent(event, type): boolean {
    const charCode = (event.which) ? event.which : event.keyCode;

    if (type == 1 && charCode > 31 && (charCode >= 48 && charCode <= 57)) {
      //numeric allow
      return true;
    } else if (type == 2 && charCode > 31 && ((charCode >= 97 && charCode <= 122) || (charCode >= 65 && charCode <= 90))) {
      //alphabetic allow
      return true;
    } else if (type == 3 && charCode > 31 && ((charCode >= 97 && charCode <= 122) || (charCode >= 65 && charCode <= 90) || (charCode >= 48 && charCode <= 57))) {
      //alphanumeric allow
      return true;
    } else if (type == 4 && charCode > 31 && ((charCode >= 97 && charCode <= 122) || (charCode >= 65 && charCode <= 90) || (charCode >= 48 && charCode <= 57) || charCode == 32)) {
      //alphabetic with space allow
      return true;
    } else if (type == 5 && charCode > 31 && ((charCode >= 97 && charCode <= 122) || (charCode >= 65 && charCode <= 90) || charCode == 32)) {
      //alphanumeric with space allow
      return true;
    } else if (type == 6 && charCode != 32) {
      //no space allow
      return true;
    }
    return false;
  }

  onSubmit(){
    if(!this.fieldInspectionForm.valid) {
      this.fieldInspectionForm.markAllAsTouched();
      this.commonMethods.warningSnackBar("Please fill all required information.");
      return;
    }
  }

}
