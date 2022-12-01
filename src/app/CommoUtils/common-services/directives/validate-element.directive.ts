import { Directive, DoCheck, ElementRef, Input, OnInit } from '@angular/core';
import { NgControl } from '@angular/forms';
import { CommonMethods } from '../common-methods';
import { CommonService } from '../common.service';
import { ValidationsService } from '../validations.service';

@Directive({
  selector: '[appValidateElement]'
})
export class ValidateElementDirective implements DoCheck, OnInit {

  // validate on save click
  @Input() set appValidateElement(value) {
    this.validateElement(value);
  }

  // to pass custom message
  @Input() validationMessage;
  @Input() isRemoveRequired = false;
  @Input() validationControlName;

  @Input() minlength = 3;
  @Input() maxlength = 100;

  validationMessageJSON = {
    required: '',
    minlength: '',
    maxlength: '',
    pattern: '',
  };

  inputGroup = false;

  constructor(
    private elementRef: ElementRef,
    private ngControl: NgControl,
    private commonMethod: CommonMethods,
    private validationService: ValidationsService
  ) {
    if (elementRef.nativeElement.parentElement.classList.contains('input-group') ) {
      elementRef.nativeElement.parentElement.insertAdjacentHTML('afterend', '<p class="errorClass d-none small text-danger"></p>');  // errorClass is just for identify element
      this.inputGroup = true;
    } else if(elementRef.nativeElement.parentElement.classList.contains('psb-input-group')) {
      elementRef.nativeElement.parentElement.insertAdjacentHTML('afterend', '<p class="errorClass d-none small text-danger" style="position:relative;margin-top:-9px;"></p>');  // errorClass is just for identify element
      this.inputGroup = true;
    } else {
      elementRef.nativeElement.insertAdjacentHTML('afterend', '<p class="errorClass d-none small text-danger"></p>');
    }
    // ngControl.valueChanges.subscribe((changes: any) => {
      if(this.validationControlName) {
        this.ngControl = this.validationService.validationConfig(this.ngControl, this.commonMethod.getValidations(this.validationControlName), this.isRemoveRequired);
      }
    // });
  }

  ngOnInit(): void {
    if(this.validationControlName) {
      this.ngControl = this.validationService.validationConfig(this.ngControl, this.commonMethod.getValidations(this.validationControlName), this.isRemoveRequired);
    }
  }

  ngDoCheck(): void {
    // if (this.validationControlName && !this.ngControl.errors) {
    //   this.ngControl = this.validationService.validationConfig(this.ngControl, this.commonMethod.getValidations(this.validationControlName));
    // }
    if (this.ngControl && ((this.ngControl.dirty || this.ngControl.touched) && !this.ngControl.valid)) {
      this.validateElement();
    } else {
      const errorElement = this.inputGroup ? this.elementRef.nativeElement.parentElement.nextSibling : this.elementRef.nativeElement.nextSibling;
      errorElement.innerHTML = '';
      if (errorElement.className.indexOf('d-none') === -1) {
        errorElement.classList.toggle('d-none');
      }
    }
  }

  validateElement(submitted?) {
    // CALL ONLY IF WANT TO REMOVE REQUIRED VALIDATION
    if(this.validationControlName && submitted && this.isRemoveRequired) {
      this.ngControl.control.clearValidators();
      this.ngControl.control.updateValueAndValidity();
      this.ngControl = this.validationService.validationConfig(this.ngControl, this.commonMethod.getValidations(this.validationControlName), this.isRemoveRequired);
    } else {
      this.ngControl = this.validationService.validationConfig(this.ngControl, this.commonMethod.getValidations(this.validationControlName), this.isRemoveRequired);      
    }
    const control = this.ngControl;
    let message = '';
    this.setValidationMessage();
    if (control && (((control.dirty || control.touched) && !control.valid) || (submitted && !control.valid))) {
      for (const key in control.errors) {
        if (key && message == '') {
          if(this.validationMessage && !this.validationControlName) {
            message += this.validationMessageJSON[key] + ' ';
          } else {
            message = this.validatorErrorMessage(key);
          }
          if (CommonService.isObjectNullOrEmpty(message)) {
            message = this.validationService.getValidatorErrorMessage(key, control.errors[key]);
          }
        } else {
          break;
        }
      }
    }
    const errorElement = this.inputGroup ? this.elementRef.nativeElement.parentElement.nextSibling : this.elementRef.nativeElement.nextSibling;
    if (errorElement.classList.contains('errorClass')) {
      if (message) {
        errorElement.innerHTML = message;
        if (errorElement.className.indexOf('d-none') > -1) {
          errorElement.classList.toggle('d-none');
        }
      } else {
        errorElement.innerHTML = '';
        if (errorElement.className.indexOf('d-none') === -1) {
          errorElement.classList.toggle('d-none');
        }
      }
    }
  }

  setValidationMessage() {
    this.validationMessageJSON = {
      required: this.validationMessage && this.validationMessage.required || 'Required',
      minlength: this.validationMessage && this.validationMessage.minlength || `Minimum ${this.minlength} characters required`,
      maxlength: this.validationMessage && this.validationMessage.maxlength || `Maximum ${this.maxlength} characters allowed`,
      pattern: this.validationMessage && this.validationMessage.pattern || 'Invalid pattern',
    };
  }

  validatorErrorMessage(propertyName): string | null {    
    return this.commonMethod.getErrorMessage(this.validationControlName, propertyName) || null;
  }

}
