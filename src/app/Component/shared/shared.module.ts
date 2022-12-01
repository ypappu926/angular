import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { UIModule } from './ui/ui.module';
import { ValidateElementDirective } from 'src/app/CommoUtils/common-services/directives/validate-element.directive';
import { CurrencyInputDirectiveDirective } from 'src/app/CommoUtils/common-services/directives/currencyinput';
import { IndNumFormatPipe } from 'src/app/CommoUtils/common-services/pipe/ind-num-format.pipe';
import { NgSelectModule } from '@ng-select/ng-select';
import { FormsModule } from '@angular/forms';
import { SafeHtmlPipe } from 'src/app/CommoUtils/common-services/pipe/safe-html.pipe';
import { TranslateModule } from '@ngx-translate/core';
import { InputRestrictionDirective } from 'src/app/CommoUtils/common-services/directives/input-restriction.directive';

@NgModule({
  imports: [
    CommonModule,
    UIModule,
    NgSelectModule,
    FormsModule,
    TranslateModule
  ],
  declarations: [
    ValidateElementDirective,
    CurrencyInputDirectiveDirective,
    IndNumFormatPipe,
    InputRestrictionDirective,
    SafeHtmlPipe,
  ],
  exports: [
    ValidateElementDirective,
    CurrencyInputDirectiveDirective,
    InputRestrictionDirective,
    IndNumFormatPipe,
    SafeHtmlPipe,
    TranslateModule
  ]
})
export class SharedModule { }
