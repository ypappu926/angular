import { Directive, ElementRef, HostListener, Input } from '@angular/core';
import { AbstractControl, FormControl, NgControl } from '@angular/forms';
import * as _ from 'lodash';
import { Constants } from '../../constants';

@Directive({
  selector: '[appInputRestriction]'
})

export class InputRestrictionDirective {
  private el: HTMLInputElement;
  private regex = null;
  @Input() isNgModel = false;
  // @Input() ngModel: NgControl;

  @Input() control: AbstractControl = new FormControl();
  @Input() set regexType(regexType: number) {
    this.regex = _.find(Constants.REGEX_TYPE, { id: regexType })?.value;
  }

  constructor(private elementRef: ElementRef) {
    this.el = this.elementRef.nativeElement;
  }

  ngOnInit() { }
  @HostListener('input', ['$event'])
  onInput(event) {
    if (this.regex) {
      const data = event.target.value.replace(this.regex, '');
      // this.el.value = data;
      if (this.isNgModel) {
        this.el.value = data;
        // this.ngModel = data;
      } else {
        this.control.setValue(data);
      }
    }
  }
}