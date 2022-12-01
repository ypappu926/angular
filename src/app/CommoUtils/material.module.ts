import { NgModule } from '@angular/core';
import { A11yModule } from '@angular/cdk/a11y';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatInputModule } from '@angular/material/input';
import { MAT_DATE_LOCALE } from '@angular/material/core';
/**
 *  this module is common for use of any directive of material
 */
@NgModule({
  imports:[],
  exports: [
    A11yModule,   
    MatAutocompleteModule,
    MatInputModule,
  ],
  providers: [
    { provide: MAT_DATE_LOCALE, useValue: 'en-GB' }
  ]
})
export class MaterialModule { }
